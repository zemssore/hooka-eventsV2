"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, X, Upload, Trash2, LogOut, Star, Edit } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/toast"
import { useConfirm } from "@/components/ui/confirm-dialog"

interface Mix {
  id: number
  name: string
  description: string
  image: string | null
  tobaccos: { brand: string; flavor: string }[]
}

interface Staff {
  id: number
  name: string
  role: string
  image: string
}

interface Review {
  id: number
  name: string
  company: string
  rating: number
  text: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

interface Hookah {
  id: number
  name: string
  description: string
  image: string
}

interface Brand {
  id: number
  name: string
  logo: string
}

interface CaseItem {
  id: number
  title: string
  image: string
  category?: string
}

export default function AdminPanel() {
  const router = useRouter()
  const toast = useToast()
  const { confirm } = useConfirm()
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState<"mixes" | "staff" | "reviews" | "hookahs" | "brands" | "cases">("mixes")
  const [mixes, setMixes] = useState<Mix[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [hookahs, setHookahs] = useState<Hookah[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [cases, setCases] = useState<CaseItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [reviewFilter, setReviewFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [editingMix, setEditingMix] = useState<Mix | null>(null)
  const [editingHookah, setEditingHookah] = useState<Hookah | null>(null)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [editingCase, setEditingCase] = useState<CaseItem | null>(null)

  const [mixForm, setMixForm] = useState({
    name: "",
    description: "",
    image: null as File | null,
    imageUrl: "",
    tobaccos: [{ brand: "", flavor: "" }],
  })

  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "",
    image: null as File | null,
    imageUrl: "",
  })

  const [hookahForm, setHookahForm] = useState({
    name: "",
    description: "",
    image: null as File | null,
    imageUrl: "",
    tobaccos: [{ brand: "", flavor: "" }],
  })

  const [brandForm, setBrandForm] = useState({
    name: "",
    logo: null as File | null,
    logoUrl: "",
  })

  const [caseForm, setCaseForm] = useState({
    title: "",
    image: null as File | null,
    imageUrl: "",
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (authenticated) {
      loadMixes()
      loadStaff()
      loadReviews()
      loadHookahs()
      loadBrands()
      loadCases()
    }
  }, [authenticated])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check")
      const data = await res.json()
      if (data.authenticated) {
        setAuthenticated(true)
      } else {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Error checking auth:", error)
      router.push("/admin/login")
    } finally {
      setChecking(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const loadMixes = async () => {
    try {
      const res = await fetch("/api/mixes")
      const data = await res.json()
      setMixes(data.classic || [])
    } catch (error) {
      console.error("Error loading mixes:", error)
    }
  }

  const loadStaff = async () => {
    try {
      const res = await fetch("/api/staff")
      const data = await res.json()
      setStaff(data || [])
    } catch (error) {
      console.error("Error loading staff:", error)
    }
  }

  const loadReviews = async () => {
    try {
      const res = await fetch("/api/reviews")
      if (res.ok) {
        const data = await res.json()
        setReviews(data || [])
      }
    } catch (error) {
      console.error("Error loading reviews:", error)
    }
  }

  const loadHookahs = async () => {
    try {
      const res = await fetch("/api/hookahs")
      const data = await res.json()
      setHookahs(data || [])
    } catch (error) {
      console.error("Error loading hookahs:", error)
    }
  }

  const loadBrands = async () => {
    try {
      const res = await fetch("/api/brands")
      const data = await res.json()
      setBrands(data || [])
    } catch (error) {
      console.error("Error loading brands:", error)
    }
  }

  const loadCases = async () => {
    try {
      const res = await fetch("/api/cases")
      const data = await res.json()
      setCases(data || [])
    } catch (error) {
      console.error("Error loading cases:", error)
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        return data.url
      } else {
        const errorMessage = data.error || "Ошибка при загрузке файла"
        toast.showError(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      if (error instanceof Error && error.message) {
        throw error
      }
      throw new Error("Ошибка при загрузке изображения")
    } finally {
      setUploading(false)
    }
  }

  const handleAddMix = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = mixForm.imageUrl

      if (mixForm.image) {
        try {
          imageUrl = await handleImageUpload(mixForm.image)
        } catch (error) {
          setLoading(false)
          return
        }
      }

      const isEditing = !!editingMix
      const url = isEditing ? `/api/mixes/${editingMix.id}` : "/api/mixes"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: mixForm.name,
          description: mixForm.description,
          image: imageUrl || (isEditing ? editingMix.image : null),
          tobaccos: mixForm.tobaccos.filter((t) => t.brand && t.flavor),
        }),
      })

      const data = await res.json()
      if (data.success) {
        setMixForm({
          name: "",
          description: "",
          image: null,
          imageUrl: "",
          tobaccos: [{ brand: "", flavor: "" }],
        })
        const wasEditing = !!editingMix
        setEditingMix(null)
        loadMixes()
        toast.showSuccess(wasEditing ? "Микс успешно обновлен!" : "Микс успешно добавлен!")
      } else {
        toast.showError("Ошибка: " + (data.error || "Неизвестная ошибка"))
      }
    } catch (error) {
      console.error("Error adding/updating mix:", error)
      toast.showError("Ошибка при сохранении микса")
    } finally {
      setLoading(false)
    }
  }

  const handleEditMix = (mix: Mix) => {
    setEditingMix(mix)
    setMixForm({
      name: mix.name,
      description: mix.description,
      image: null,
      imageUrl: mix.image || "",
      tobaccos: mix.tobaccos && mix.tobaccos.length > 0 
        ? mix.tobaccos 
        : [{ brand: "", flavor: "" }],
    })
  }

  const handleCancelEditMix = () => {
    setEditingMix(null)
    setMixForm({
      name: "",
      description: "",
      image: null,
      imageUrl: "",
      tobaccos: [{ brand: "", flavor: "" }],
    })
  }

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = staffForm.imageUrl || "/placeholder-user.jpg"

      if (staffForm.image) {
        try {
          imageUrl = await handleImageUpload(staffForm.image)
        } catch (error) {
          setLoading(false)
          return
        }
      }

      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: staffForm.name,
          role: staffForm.role,
          image: imageUrl,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setStaffForm({
          name: "",
          role: "",
          image: null,
          imageUrl: "",
        })
        loadStaff()
        toast.showSuccess("Мастер успешно добавлен!")
      } else {
        toast.showError("Ошибка: " + (data.error || "Неизвестная ошибка"))
      }
    } catch (error) {
      console.error("Error adding staff:", error)
      toast.showError("Ошибка при добавлении мастера")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMix = async (id: number) => {
    confirm({
      title: "Удаление микса",
      message: "Вы уверены, что хотите удалить этот микс?",
      confirmText: "Удалить",
      cancelText: "Отмена",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/mixes?id=${id}`, {
            method: "DELETE",
          })

          const data = await res.json()
          if (data.success) {
            loadMixes()
            toast.showSuccess("Микс успешно удален!")
          } else {
            toast.showError("Ошибка: " + (data.error || "Неизвестная ошибка"))
          }
        } catch (error) {
          console.error("Error deleting mix:", error)
          toast.showError("Ошибка при удалении микса")
        }
      },
    })
  }

  const handleDeleteStaff = async (id: number) => {
    confirm({
      title: "Удаление мастера",
      message: "Вы уверены, что хотите удалить этого мастера?",
      confirmText: "Удалить",
      cancelText: "Отмена",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/staff?id=${id}`, {
            method: "DELETE",
          })

          const data = await res.json()
          if (data.success) {
            loadStaff()
            toast.showSuccess("Мастер успешно удален!")
          } else {
            toast.showError("Ошибка: " + (data.error || "Неизвестная ошибка"))
          }
        } catch (error) {
          console.error("Error deleting staff:", error)
          toast.showError("Ошибка при удалении мастера")
        }
      },
    })
  }

  const handleApproveReview = async (id: number) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      })

      const data = await res.json()
      if (data.success) {
        loadReviews()
        toast.showSuccess("Отзыв одобрен!")
      } else {
        toast.showError("Ошибка при одобрении отзыва")
      }
    } catch (error) {
      console.error("Error approving review:", error)
      toast.showError("Ошибка при одобрении отзыва")
    }
  }

  const handleRejectReview = async (id: number) => {
    confirm({
      title: "Отклонение отзыва",
      message: "Вы уверены, что хотите отклонить этот отзыв?",
      confirmText: "Отклонить",
      cancelText: "Отмена",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch("/api/reviews", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: "rejected" }),
          })

          const data = await res.json()
          if (data.success) {
            loadReviews()
            toast.showSuccess("Отзыв отклонен!")
          } else {
            toast.showError("Ошибка при отклонении отзыва")
          }
        } catch (error) {
          console.error("Error rejecting review:", error)
          toast.showError("Ошибка при отклонении отзыва")
        }
      },
    })
  }

  const handleDeleteReview = async (id: number) => {
    confirm({
      title: "Удаление отзыва",
      message: "Вы уверены, что хотите удалить этот отзыв?",
      confirmText: "Удалить",
      cancelText: "Отмена",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/reviews?id=${id}`, {
            method: "DELETE",
          })

          const data = await res.json()
          if (data.success) {
            loadReviews()
            toast.showSuccess("Отзыв удален!")
          } else {
            toast.showError("Ошибка при удалении отзыва")
          }
        } catch (error) {
          console.error("Error deleting review:", error)
          toast.showError("Ошибка при удалении отзыва")
        }
      },
    })
  }

  const handleAddHookah = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = hookahForm.imageUrl

      if (hookahForm.image) {
        try {
          imageUrl = await handleImageUpload(hookahForm.image)
        } catch (error) {
          setLoading(false)
          return
        }
      }

      const url = editingHookah ? `/api/hookahs` : `/api/hookahs`
      const method = editingHookah ? "PATCH" : "POST"
      const body = editingHookah
        ? JSON.stringify({
            id: editingHookah.id,
            name: hookahForm.name,
            description: hookahForm.description,
            image: imageUrl || editingHookah.image,
            tobaccos: hookahForm.tobaccos.filter((t) => t.brand && t.flavor),
          })
        : JSON.stringify({
            name: hookahForm.name,
            description: hookahForm.description,
            image: imageUrl || "/placeholder.svg",
            tobaccos: hookahForm.tobaccos.filter((t) => t.brand && t.flavor),
          })

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      })

      const data = await res.json()
      if (data.success) {
        setHookahForm({
          name: "",
          description: "",
          image: null,
          imageUrl: "",
          tobaccos: [{ brand: "", flavor: "" }],
        })
        const wasEditing = !!editingHookah
        setEditingHookah(null)
        loadHookahs()
        toast.showSuccess(wasEditing ? "Кальян успешно обновлен!" : "Кальян успешно добавлен!")
      } else {
        toast.showError("Ошибка: " + (data.error || "Неизвестная ошибка"))
      }
    } catch (error) {
      console.error("Error adding/updating hookah:", error)
      toast.showError("Ошибка при сохранении кальяна")
    } finally {
      setLoading(false)
    }
  }

  const handleEditHookah = (hookah: Hookah) => {
    setEditingHookah(hookah)
    setHookahForm({
      name: hookah.name,
      description: hookah.description,
      image: null,
      imageUrl: hookah.image,
      tobaccos: (hookah as any).tobaccos && (hookah as any).tobaccos.length > 0 
        ? (hookah as any).tobaccos 
        : [{ brand: "", flavor: "" }],
    })
  }

  const handleCancelEdit = () => {
    setEditingHookah(null)
    setHookahForm({
      name: "",
      description: "",
      image: null,
      imageUrl: "",
      tobaccos: [{ brand: "", flavor: "" }],
    })
  }

  const handleDeleteHookah = async (id: number) => {
    confirm({
      title: "Удаление кальяна",
      message: "Вы уверены, что хотите удалить этот кальян?",
      confirmText: "Удалить",
      cancelText: "Отмена",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/hookahs?id=${id}`, {
            method: "DELETE",
          })

          const data = await res.json()
          if (data.success) {
            loadHookahs()
            toast.showSuccess("Кальян успешно удален!")
          } else {
            toast.showError("Ошибка: " + (data.error || "Неизвестная ошибка"))
          }
        } catch (error) {
          console.error("Error deleting hookah:", error)
          toast.showError("Ошибка при удалении кальяна")
        }
      },
    })
  }

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let logoUrl = brandForm.logoUrl

      if (brandForm.logo) {
        try {
          logoUrl = await handleImageUpload(brandForm.logo)
        } catch (error) {
          setLoading(false)
          return
        }
      }

      const url = `/api/brands`
      const method = editingBrand ? "PATCH" : "POST"
      const body = editingBrand
        ? JSON.stringify({
            id: editingBrand.id,
            name: brandForm.name,
            logo: logoUrl || editingBrand.logo,
          })
        : JSON.stringify({
            name: brandForm.name,
            logo: logoUrl || "/placeholder-logo.svg",
          })

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      })

      const data = await res.json()
      if (data.success) {
        setBrandForm({
          name: "",
          logo: null,
          logoUrl: "",
        })
        const wasEditing = !!editingBrand
        setEditingBrand(null)
        loadBrands()
        toast.showSuccess(wasEditing ? "Бренд успешно обновлен!" : "Бренд успешно добавлен!")
      } else {
        toast.showError("Ошибка: " + (data.error || "Неизвестная ошибка"))
      }
    } catch (error) {
      console.error("Error adding/updating brand:", error)
      toast.showError("Ошибка при сохранении бренда")
    } finally {
      setLoading(false)
    }
  }

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand)
    setBrandForm({
      name: brand.name,
      logo: null,
      logoUrl: brand.logo,
    })
  }

 бренда
  const handleCancelBrandEdit = () => {
    setEditingBrand(null)
    setBrandForm({
      name: "",
      logo: null,
      logoUrl: "",
    })
  }

  const handleDeleteBrand = async (id: number) => {
    confirm({
      title: "Удаление бренда",
      message: "Вы уверены, что хотите удалить этот бренд?",
      confirmText: "Удалить",
      cancelText: "Отмена",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/brands?id=${id}`, {
            method: "DELETE",
          })

          const data = await res.json()
          if (data.success) {
            loadBrands()
            toast.showSuccess("Бренд успешно удален!")
          } else {
            toast.showError("Ошибка: " + (data.error || "Неизвестная ошибка"))
          }
        } catch (error) {
          console.error("Error deleting brand:", error)
          toast.showError("Ошибка при удалении бренда")
        }
      },
    })
  }

  const handleAddCase = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = caseForm.imageUrl

      if (caseForm.image) {
        try {
          imageUrl = await handleImageUpload(caseForm.image)
        } catch (error) {
          setLoading(false)
          return
        }
      }

      const url = `/api/cases`
      const method = editingCase ? "PATCH" : "POST"
      const body = editingCase
        ? JSON.stringify({
            id: editingCase.id,
            title: caseForm.title,
            image: imageUrl || editingCase.image,
          })
        : JSON.stringify({
            title: caseForm.title,
            image: imageUrl || "/placeholder.svg",
          })

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      })

      const data = await res.json()
      if (data.success) {
        setCaseForm({
          title: "",
          image: null,
          imageUrl: "",
        })
        const wasEditing = !!editingCase
        setEditingCase(null)
        loadCases()
        toast.showSuccess(wasEditing ? "Кейс успешно обновлен!" : "Кейс успешно добавлен!")
      } else {
        toast.showError("Ошибка: " + (data.error || "Неизвестная ошибка"))
      }
    } catch (error) {
      console.error("Error adding/updating case:", error)
      toast.showError("Ошибка при сохранении кейса")
    } finally {
      setLoading(false)
    }
  }

  const handleEditCase = (caseItem: CaseItem) => {
    setEditingCase(caseItem)
    setCaseForm({
      title: caseItem.title,
      image: null,
      imageUrl: caseItem.image,
    })
  }

 кейса
  const handleCancelCaseEdit = () => {
    setEditingCase(null)
    setCaseForm({
      title: "",
      image: null,
      imageUrl: "",
    })
  }

  const handleDeleteCase = async (id: number) => {
    confirm({
      title: "Удаление кейса",
      message: "Вы уверены, что хотите удалить этот кейс?",
      confirmText: "Удалить",
      cancelText: "Отмена",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/cases?id=${id}`, {
            method: "DELETE",
          })

          const data = await res.json()
          if (data.success) {
            loadCases()
            toast.showSuccess("Кейс успешно удален!")
          } else {
            toast.showError("Ошибка: " + (data.error || "Неизвестная ошибка"))
          }
        } catch (error) {
          console.error("Error deleting case:", error)
          toast.showError("Ошибка при удалении кейса")
        }
      },
    })
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Проверка авторизации...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 md:py-16 lg:py-24 w-full max-w-full overflow-x-hidden">
      <div className="mx-auto px-4 sm:px-6 max-w-6xl w-full overflow-x-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
        <motion.div
          className="mb-6 sm:mb-8 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute top-0 right-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-background border border-border text-foreground hover:bg-background/80 hover:border-accent/50 transition-colors text-sm sm:text-base"
              title="Выйти"
            >
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
          <div className="pt-8 sm:pt-10 text-center w-full max-w-full overflow-x-hidden">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-1 sm:mb-2 break-words">Админ-панель</h1>
            <p className="text-xs sm:text-sm text-muted-foreground break-words">Управление миксами, мастерами, отзывами, кальянами, брендами и кейсами</p>
          </div>
        </motion.div>

        {/* Табы */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-border overflow-x-auto scrollbar-hide w-full max-w-full">
          <button
            onClick={() => setActiveTab("mixes")}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
              activeTab === "mixes"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Миксы
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
              activeTab === "staff"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Мастера
          </button>
          <button
            onClick={() => {
              setActiveTab("reviews")
              loadReviews()
            }}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
              activeTab === "reviews"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Отзывы
          </button>
          <button
            onClick={() => setActiveTab("hookahs")}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
              activeTab === "hookahs"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Кальяны
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
              activeTab === "brands"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Бренды
          </button>
          <button
            onClick={() => setActiveTab("cases")}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
              activeTab === "cases"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Кейсы
          </button>
        </div>

        {/* Форма добавления микса */}
        {activeTab === "mixes" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start w-full max-w-full overflow-x-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            <motion.div
              className="p-4 sm:p-6 md:p-8 rounded-lg bg-card border border-border h-fit w-full max-w-full overflow-x-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 break-words">
                {editingMix ? "Редактировать микс" : "Добавить микс"}
              </h2>
              <form onSubmit={handleAddMix} className="space-y-3 sm:space-y-4 w-full max-w-full overflow-x-hidden">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Название</label>
                  <input
                    type="text"
                    value={mixForm.name}
                    onChange={(e) => setMixForm({ ...mixForm, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Описание</label>
                  <textarea
                    value={mixForm.description}
                    onChange={(e) => setMixForm({ ...mixForm, description: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Фото</label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full max-w-full overflow-x-hidden">
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-background border border-border cursor-pointer hover:bg-background/80 transition-colors text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                      <Upload size={16} className="sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground">Выбрать файл</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setMixForm({ ...mixForm, image: file })
                          }
                        }}
                      />
                    </label>
                    {mixForm.image && (
                      <span className="text-xs sm:text-sm text-muted-foreground break-words min-w-0 max-w-full">{mixForm.image.name}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Табаки</label>
                  <div className="space-y-2">
                    {mixForm.tobaccos.map((tobacco, idx) => (
                      <div key={idx} className="flex gap-2 items-center w-full max-w-full overflow-x-hidden">
                        <input
                          type="text"
                          placeholder="Бренд"
                          value={tobacco.brand}
                          onChange={(e) => {
                            const newTobaccos = [...mixForm.tobaccos]
                            newTobaccos[idx].brand = e.target.value
                            setMixForm({ ...mixForm, tobaccos: newTobaccos })
                          }}
                          className="flex-1 min-w-0 max-w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          type="text"
                          placeholder="Вкус"
                          value={tobacco.flavor}
                          onChange={(e) => {
                            const newTobaccos = [...mixForm.tobaccos]
                            newTobaccos[idx].flavor = e.target.value
                            setMixForm({ ...mixForm, tobaccos: newTobaccos })
                          }}
                          className="flex-1 min-w-0 max-w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        {mixForm.tobaccos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newTobaccos = mixForm.tobaccos.filter((_, i) => i !== idx)
                              setMixForm({ ...mixForm, tobaccos: newTobaccos })
                            }}
                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                            aria-label="Удалить табак"
                          >
                            <X size={16} className="sm:w-5 sm:h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setMixForm({
                          ...mixForm,
                          tobaccos: [...mixForm.tobaccos, { brand: "", flavor: "" }],
                        })
                      }}
                      className="flex items-center gap-2 text-xs sm:text-sm text-accent hover:text-accent/80 transition-colors mt-2"
                    >
                      <Plus size={14} className="sm:w-4 sm:h-4" />
                      Добавить табак
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading || uploading ? "Загрузка..." : editingMix ? "Сохранить изменения" : "Добавить микс"}
                  </button>
                  {editingMix && (
                    <button
                      type="button"
                      onClick={handleCancelEditMix}
                      disabled={loading || uploading}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground font-medium hover:bg-background/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Отмена
                    </button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Список миксов */}
            <motion.div
              className="p-4 sm:p-6 md:p-8 rounded-lg bg-card border border-border h-fit w-full max-w-full overflow-x-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 break-words">Список миксов</h2>
              <div className="space-y-2 sm:space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto overflow-x-hidden w-full">
                {mixes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Миксы не добавлены</p>
                ) : (
                  mixes.map((mix) => (
                    <motion.div
                      key={mix.id}
                      className="p-3 sm:p-4 rounded-lg bg-background border border-border/50 flex items-start justify-between gap-3 sm:gap-4 hover:border-border transition-colors w-full max-w-full overflow-x-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex-1 min-w-0 max-w-full">
                        <h3 className="font-bold text-foreground mb-1 text-sm sm:text-base break-words">{mix.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{mix.description}</p>
                        {mix.image && (
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-border mt-2">
                            <Image src={mix.image} alt={mix.name} fill className="object-cover" />
                          </div>
                        )}
                        {mix.tobaccos && mix.tobaccos.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <p className="text-xs text-muted-foreground mb-1">Табаки:</p>
                            <div className="flex flex-wrap gap-1">
                              {mix.tobaccos.slice(0, 3).map((tob, idx) => (
                                <span key={idx} className="text-xs text-foreground/70 break-words">
                                  {tob.brand} {tob.flavor}
                                  {idx < Math.min(mix.tobaccos.length, 3) - 1 && ","}
                                </span>
                              ))}
                              {mix.tobaccos.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{mix.tobaccos.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditMix(mix)}
                          className="p-1.5 sm:p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          aria-label="Редактировать микс"
                        >
                          <Edit size={16} className="sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMix(mix.id)}
                          className="p-1.5 sm:p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          aria-label="Удалить микс"
                        >
                          <Trash2 size={16} className="sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Форма добавления мастера */}
        {activeTab === "staff" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start w-full max-w-full overflow-x-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            <motion.div
              className="p-4 sm:p-6 md:p-8 rounded-lg bg-card border border-border h-fit w-full max-w-full overflow-x-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 break-words">Добавить мастера</h2>
              <form onSubmit={handleAddStaff} className="space-y-3 sm:space-y-4 w-full max-w-full overflow-x-hidden">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Имя</label>
                  <input
                    type="text"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Роль</label>
                  <input
                    type="text"
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Например: Кальянщик, Мастер"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Фото</label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full max-w-full overflow-x-hidden">
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-background border border-border cursor-pointer hover:bg-background/80 transition-colors text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                      <Upload size={16} className="sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground">Выбрать файл</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setStaffForm({ ...staffForm, image: file })
                          }
                        }}
                      />
                    </label>
                    {staffForm.image && (
                      <span className="text-xs sm:text-sm text-muted-foreground break-words min-w-0 max-w-full">{staffForm.image.name}</span>
                    )}
                  </div>
                  {staffForm.image && (
                    <div className="mt-4 relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-border">
                      <Image
                        src={URL.createObjectURL(staffForm.image)}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading || uploading ? "Загрузка..." : "Добавить мастера"}
                </button>
              </form>
            </motion.div>

            {/* Список мастеров */}
            <motion.div
              className="p-4 sm:p-6 md:p-8 rounded-lg bg-card border border-border h-fit w-full max-w-full overflow-x-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 break-words">Список мастеров</h2>
              <div className="space-y-2 sm:space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto overflow-x-hidden w-full">
                {staff.length === 0 ? (
                  <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">Мастера не добавлены</p>
                ) : (
                  staff.map((member) => (
                    <motion.div
                      key={member.id}
                      className="p-3 sm:p-4 rounded-lg bg-background border border-border/50 flex items-center gap-3 sm:gap-4 hover:border-border transition-colors w-full max-w-full overflow-x-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 max-w-full">
                        <h3 className="font-bold text-foreground text-sm sm:text-base break-words">{member.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">{member.role}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteStaff(member.id)}
                        className="p-1.5 sm:p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Удалить мастера"
                      >
                        <Trash2 size={16} className="sm:w-5 sm:h-5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Модерация отзывов */}
        {activeTab === "reviews" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-full overflow-x-hidden"
            style={{ maxWidth: '100%', boxSizing: 'border-box' }}
          >
            <div className="mb-4 sm:mb-6 flex gap-2 sm:gap-4 flex-wrap w-full">
              <button
                onClick={() => setReviewFilter("all")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${
                  reviewFilter === "all"
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border text-foreground hover:bg-background/80"
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setReviewFilter("pending")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${
                  reviewFilter === "pending"
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border text-foreground hover:bg-background/80"
                }`}
              >
                На модерации
              </button>
              <button
                onClick={() => setReviewFilter("approved")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${
                  reviewFilter === "approved"
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border text-foreground hover:bg-background/80"
                }`}
              >
                Одобренные
              </button>
              <button
                onClick={() => setReviewFilter("rejected")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${
                  reviewFilter === "rejected"
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border text-foreground hover:bg-background/80"
                }`}
              >
                Отклоненные
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4 w-full max-w-full overflow-x-hidden">
              {reviews
                .filter((review) => reviewFilter === "all" || review.status === reviewFilter)
                .length === 0 ? (
                <div className="text-center py-8 sm:py-12 bg-card border border-border rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {reviewFilter === "pending"
                      ? "Нет отзывов на модерации"
                      : reviewFilter === "approved"
                        ? "Нет одобренных отзывов"
                        : reviewFilter === "rejected"
                          ? "Нет отклоненных отзывов"
                          : "Нет отзывов"}
                  </p>
                </div>
              ) : (
                reviews
                  .filter((review) => reviewFilter === "all" || review.status === reviewFilter)
                  .map((review) => (
                    <motion.div
                      key={review.id}
                      className="p-4 sm:p-6 rounded-lg bg-card border border-border w-full max-w-full overflow-x-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 w-full max-w-full overflow-x-hidden">
                        <div className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 w-full max-w-full">
                            <h3 className="font-bold text-foreground text-base sm:text-lg break-words">{review.name}</h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                                review.status === "approved"
                                  ? "bg-green-500/20 text-green-600"
                                  : review.status === "rejected"
                                    ? "bg-red-500/20 text-red-600"
                                    : "bg-yellow-500/20 text-yellow-600"
                              }`}
                            >
                              {review.status === "approved"
                                ? "Одобрен"
                                : review.status === "rejected"
                                  ? "Отклонен"
                                  : "На модерации"}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 break-words">{review.company}</p>
                          <div className="flex gap-1 mb-2 sm:mb-3">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} size={14} className="sm:w-4 sm:h-4 fill-accent text-accent" />
                            ))}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-3 break-words">{review.text}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("ru-RU", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-3 sm:pt-4 border-t border-border w-full max-w-full overflow-x-hidden">
                        {review.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApproveReview(review.id)}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-500/20 text-green-600 hover:bg-green-500/30 transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                            >
                              Одобрить
                            </button>
                            <button
                              onClick={() => handleRejectReview(review.id)}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                            >
                              Отклонить
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-colors font-medium text-xs sm:text-sm sm:ml-auto whitespace-nowrap"
                        >
                          Удалить
                        </button>
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          </motion.div>
        )}

        {/* Управление кальянами */}
        {activeTab === "hookahs" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start w-full max-w-full overflow-x-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            <motion.div
              className="p-4 sm:p-6 md:p-8 rounded-lg bg-card border border-border h-fit w-full max-w-full overflow-x-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 break-words">
                {editingHookah ? "Редактировать кальян" : "Добавить кальян"}
              </h2>
              <form onSubmit={handleAddHookah} className="space-y-3 sm:space-y-4 w-full max-w-full overflow-x-hidden">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Название</label>
                  <input
                    type="text"
                    value={hookahForm.name}
                    onChange={(e) => setHookahForm({ ...hookahForm, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Описание</label>
                  <textarea
                    value={hookahForm.description}
                    onChange={(e) => setHookahForm({ ...hookahForm, description: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Фото</label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full max-w-full overflow-x-hidden">
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-background border border-border cursor-pointer hover:bg-background/80 transition-colors text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                      <Upload size={16} className="sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground">Выбрать файл</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setHookahForm({ ...hookahForm, image: file })
                          }
                        }}
                      />
                    </label>
                    {hookahForm.image && (
                      <span className="text-xs sm:text-sm text-muted-foreground break-words min-w-0 max-w-full">{hookahForm.image.name}</span>
                    )}
                    {hookahForm.imageUrl && !hookahForm.image && (
                      <span className="text-xs sm:text-sm text-muted-foreground break-words min-w-0 max-w-full">Текущее изображение</span>
                    )}
                  </div>
                  {hookahForm.imageUrl && (
                    <div className="mt-4 relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden border border-border">
                      <Image
                        src={hookahForm.image ? URL.createObjectURL(hookahForm.image) : hookahForm.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Табаки (опционально)</label>
                  <div className="space-y-2">
                    {hookahForm.tobaccos.map((tobacco, idx) => (
                      <div key={idx} className="flex gap-2 items-center w-full max-w-full overflow-x-hidden">
                        <input
                          type="text"
                          placeholder="Бренд"
                          value={tobacco.brand}
                          onChange={(e) => {
                            const newTobaccos = [...hookahForm.tobaccos]
                            newTobaccos[idx].brand = e.target.value
                            setHookahForm({ ...hookahForm, tobaccos: newTobaccos })
                          }}
                          className="flex-1 min-w-0 max-w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          type="text"
                          placeholder="Вкус"
                          value={tobacco.flavor}
                          onChange={(e) => {
                            const newTobaccos = [...hookahForm.tobaccos]
                            newTobaccos[idx].flavor = e.target.value
                            setHookahForm({ ...hookahForm, tobaccos: newTobaccos })
                          }}
                          className="flex-1 min-w-0 max-w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        {hookahForm.tobaccos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newTobaccos = hookahForm.tobaccos.filter((_, i) => i !== idx)
                              setHookahForm({ ...hookahForm, tobaccos: newTobaccos })
                            }}
                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                            aria-label="Удалить табак"
                          >
                            <X size={16} className="sm:w-5 sm:h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setHookahForm({
                          ...hookahForm,
                          tobaccos: [...hookahForm.tobaccos, { brand: "", flavor: "" }],
                        })
                      }}
                      className="flex items-center gap-2 text-xs sm:text-sm text-accent hover:text-accent/80 transition-colors mt-2"
                    >
                      <Plus size={14} className="sm:w-4 sm:h-4" />
                      Добавить табак
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading || uploading ? "Загрузка..." : editingHookah ? "Сохранить изменения" : "Добавить кальян"}
                  </button>
                  {editingHookah && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground hover:bg-background/80 transition-colors"
                    >
                      Отмена
                    </button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Список кальянов */}
            <motion.div
              className="p-4 sm:p-6 md:p-8 rounded-lg bg-card border border-border h-fit w-full max-w-full overflow-x-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 break-words">Список кальянов</h2>
              <div className="space-y-2 sm:space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto overflow-x-hidden w-full">
                {hookahs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Кальяны не добавлены</p>
                ) : (
                  hookahs.map((hookah) => (
                    <motion.div
                      key={hookah.id}
                      className="p-3 sm:p-4 rounded-lg bg-background border border-border/50 flex items-start justify-between gap-3 sm:gap-4 hover:border-border transition-colors w-full max-w-full overflow-x-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex-1 min-w-0 max-w-full">
                        <h3 className="font-bold text-foreground mb-1 text-sm sm:text-base break-words">{hookah.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{hookah.description}</p>
                        {hookah.image && (
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-border mt-2">
                            <Image src={hookah.image} alt={hookah.name} fill className="object-cover" />
                          </div>
                        )}
                        {(hookah as any).tobaccos && (hookah as any).tobaccos.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <p className="text-xs text-muted-foreground mb-1">Табаки:</p>
                            <div className="flex flex-wrap gap-1">
                              {(hookah as any).tobaccos.slice(0, 3).map((tob: any, idx: number) => (
                                <span key={idx} className="text-xs text-foreground/70 break-words">
                                  {tob.brand} {tob.flavor}
                                  {idx < Math.min((hookah as any).tobaccos.length, 3) - 1 && ","}
                                </span>
                              ))}
                              {(hookah as any).tobaccos.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{(hookah as any).tobaccos.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditHookah(hookah)}
                          className="p-1.5 sm:p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          aria-label="Редактировать кальян"
                        >
                          <Edit size={16} className="sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteHookah(hookah.id)}
                          className="p-1.5 sm:p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          aria-label="Удалить кальян"
                        >
                          <Trash2 size={16} className="sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Управление брендами */}
        {activeTab === "brands" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start w-full max-w-full overflow-x-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            <motion.div
              className="p-4 sm:p-6 md:p-8 rounded-lg bg-card border border-border h-fit w-full max-w-full overflow-x-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 break-words">
                {editingBrand ? "Редактировать бренд" : "Добавить бренд"}
              </h2>
              <form onSubmit={handleAddBrand} className="space-y-3 sm:space-y-4 w-full max-w-full overflow-x-hidden">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Название бренда</label>
                  <input
                    type="text"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Логотип</label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full max-w-full overflow-x-hidden">
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-background border border-border cursor-pointer hover:bg-background/80 transition-colors text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                      <Upload size={16} className="sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground">Выбрать файл</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setBrandForm({ ...brandForm, logo: file })
                          }
                        }}
                      />
                    </label>
                    {brandForm.logo && (
                      <span className="text-xs sm:text-sm text-muted-foreground break-words min-w-0 max-w-full">{brandForm.logo.name}</span>
                    )}
                    {brandForm.logoUrl && !brandForm.logo && (
                      <span className="text-xs sm:text-sm text-muted-foreground break-words min-w-0 max-w-full">Текущий логотип</span>
                    )}
                  </div>
                  {brandForm.logoUrl && (
                    <div className="mt-4 relative w-32 h-16 sm:w-40 sm:h-20 rounded-lg overflow-hidden border border-border bg-card">
                      <Image
                        src={brandForm.logo ? URL.createObjectURL(brandForm.logo) : brandForm.logoUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading || uploading ? "Загрузка..." : editingBrand ? "Сохранить изменения" : "Добавить бренд"}
                  </button>
                  {editingBrand && (
                    <button
                      type="button"
                      onClick={handleCancelBrandEdit}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground hover:bg-background/80 transition-colors"
                    >
                      Отмена
                    </button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Список брендов */}
            <motion.div
              className="p-4 sm:p-6 md:p-8 rounded-lg bg-card border border-border h-fit w-full max-w-full overflow-x-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 break-words">Список брендов</h2>
              <div className="space-y-2 sm:space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto overflow-x-hidden w-full">
                {brands.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Бренды не добавлены</p>
                ) : (
                  brands.map((brand) => (
                    <motion.div
                      key={brand.id}
                      className="p-3 sm:p-4 rounded-lg bg-background border border-border/50 flex items-center justify-between gap-3 sm:gap-4 hover:border-border transition-colors w-full max-w-full overflow-x-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 max-w-full">
                        {brand.logo && (
                          <div className="relative w-16 h-8 sm:w-20 sm:h-10 rounded overflow-hidden border border-border flex-shrink-0">
                            <Image src={brand.logo} alt={brand.name} fill className="object-contain" unoptimized />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 max-w-full">
                          <h3 className="font-bold text-foreground text-sm sm:text-base break-words">{brand.name}</h3>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditBrand(brand)}
                          className="p-1.5 sm:p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          aria-label="Редактировать бренд"
                        >
                          <Edit size={16} className="sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand.id)}
                          className="p-1.5 sm:p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          aria-label="Удалить бренд"
                        >
                          <Trash2 size={16} className="sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Управление кейсами */}
        {activeTab === "cases" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start w-full max-w-full overflow-x-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            <motion.div
              className="p-4 sm:p-6 md:p-8 rounded-lg bg-card border border-border h-fit w-full max-w-full overflow-x-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 break-words">
                {editingCase ? "Редактировать кейс" : "Добавить кейс"}
              </h2>
              <form onSubmit={handleAddCase} className="space-y-3 sm:space-y-4 w-full max-w-full overflow-x-hidden">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Название кейса</label>
                  <input
                    type="text"
                    value={caseForm.title}
                    onChange={(e) => setCaseForm({ ...caseForm, title: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Фото</label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full max-w-full overflow-x-hidden">
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-background border border-border cursor-pointer hover:bg-background/80 transition-colors text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                      <Upload size={16} className="sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground">Выбрать файл</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setCaseForm({ ...caseForm, image: file })
                          }
                        }}
                      />
                    </label>
                    {caseForm.image && (
                      <span className="text-xs sm:text-sm text-muted-foreground break-words min-w-0 max-w-full">{caseForm.image.name}</span>
                    )}
                    {caseForm.imageUrl && !caseForm.image && (
                      <span className="text-xs sm:text-sm text-muted-foreground break-words min-w-0 max-w-full">Текущее изображение</span>
                    )}
                  </div>
                  {caseForm.imageUrl && (
                    <div className="mt-4 relative w-full h-48 sm:h-56 rounded-lg overflow-hidden border border-border bg-card">
                      <Image
                        src={caseForm.image ? URL.createObjectURL(caseForm.image) : caseForm.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading || uploading ? "Загрузка..." : editingCase ? "Сохранить изменения" : "Добавить кейс"}
                  </button>
                  {editingCase && (
                    <button
                      type="button"
                      onClick={handleCancelCaseEdit}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-background border border-border text-foreground hover:bg-background/80 transition-colors"
                    >
                      Отмена
                    </button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Список кейсов */}
            <motion.div
              className="p-4 sm:p-6 md:p-8 rounded-lg bg-card border border-border h-fit w-full max-w-full overflow-x-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6 break-words">Список кейсов</h2>
              <div className="space-y-2 sm:space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto overflow-x-hidden w-full">
                {cases.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Кейсы не добавлены</p>
                ) : (
                  cases.map((caseItem) => (
                    <motion.div
                      key={caseItem.id}
                      className="p-3 sm:p-4 rounded-lg bg-background border border-border/50 flex items-start justify-between gap-3 sm:gap-4 hover:border-border transition-colors w-full max-w-full overflow-x-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 max-w-full">
                        {caseItem.image && (
                          <div className="relative w-20 h-16 sm:w-24 sm:h-20 rounded overflow-hidden border border-border flex-shrink-0">
                            <Image src={caseItem.image} alt={caseItem.title} fill className="object-cover" unoptimized />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 max-w-full">
                          <h3 className="font-bold text-foreground text-sm sm:text-base break-words">{caseItem.title}</h3>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditCase(caseItem)}
                          className="p-1.5 sm:p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          aria-label="Редактировать кейс"
                        >
                          <Edit size={16} className="sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCase(caseItem.id)}
                          className="p-1.5 sm:p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          aria-label="Удалить кейс"
                        >
                          <Trash2 size={16} className="sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

