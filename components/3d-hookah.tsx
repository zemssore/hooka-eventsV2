"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ThreeDHookah() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 5

    // Create hookah components
    const group = new THREE.Group()

    // Base
    const baseGeometry = new THREE.CylinderGeometry(1.5, 1.8, 0.4, 32)
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x8b7355, metalness: 0.3, roughness: 0.6 })
    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    group.add(base)

    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.15, 0.15, 3, 16)
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.2 })
    const stem = new THREE.Mesh(stemGeometry, stemMaterial)
    stem.position.y = 1.8
    group.add(stem)

    // Bowl
    const bowlGeometry = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6)
    const bowlMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.6, roughness: 0.4 })
    const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial)
    bowl.position.y = 3.3
    group.add(bowl)

    // Hose connections
    const hoseGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2, 16)
    const hoseMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.5, roughness: 0.5 })

    for (let i = 0; i < 3; i++) {
      const hose = new THREE.Mesh(hoseGeometry, hoseMaterial)
      const angle = (i * Math.PI * 2) / 3
      hose.position.x = Math.cos(angle) * 1.2
      hose.position.z = Math.sin(angle) * 1.2
      hose.position.y = 0.5
      hose.rotation.z = 0.4
      group.add(hose)
    }

    scene.add(group)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffd700, 0.4)
    pointLight.position.set(-5, 3, 3)
    scene.add(pointLight)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      group.rotation.y += 0.005
      group.rotation.x = Math.sin(Date.now() * 0.0003) * 0.1

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-screen" />
}
