"use client"

import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import Advantages from "@/components/advantages"
import About from "@/components/about"
import Gallery from "@/components/gallery"
import Staff from "@/components/staff"
import Menu from "@/components/menu"
import Services from "@/components/services"
import Calculator from "@/components/calculator"
import Reviews from "@/components/reviews"
import Partners from "@/components/partners"
import Contacts from "@/components/contacts"
import Footer from "@/components/footer"
import AnimatedBackground from "@/components/animated-background"
import Interactive3DShowcase from "@/components/interactive-3d-showcase"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative" style={{ backgroundColor: 'oklch(1 0 0)' }}>
      <AnimatedBackground />

      <Navigation />
      <Hero />
      <Advantages />
      <About />
      <Interactive3DShowcase />
      <Gallery />
      <Staff />
      <Menu />
      <Services />
      <Calculator />
      <Reviews />
      <Partners />
      <Contacts />
      <Footer />
    </main>
  )
}
