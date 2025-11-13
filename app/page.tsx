"use client"

import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import Promotions from "@/components/promotions"
import Advantages from "@/components/advantages"
import Gallery from "@/components/gallery"
import Staff from "@/components/staff"
import Menu from "@/components/menu"
import Calculator from "@/components/calculator"
import Reviews from "@/components/reviews"
import Partners from "@/components/partners"
import Contacts from "@/components/contacts"
import About from "@/components/about"
import Footer from "@/components/footer"
import AnimatedBackground from "@/components/animated-background"
import BrandsSlider from "@/components/brands-slider"
import BookingButton from "@/components/booking-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative w-full max-w-full overflow-x-hidden" style={{ backgroundColor: 'oklch(1 0 0)' }}>
      <AnimatedBackground />

      <Navigation />
      <Hero />
      <Promotions />
      <Advantages />
      <Gallery />
      <Staff />
      <Menu />
      <BrandsSlider />
      <Calculator />
      <Reviews />
      <Partners />
      <Contacts />
      <About />
      <Footer />
      <BookingButton />
    </main>
  )
}
