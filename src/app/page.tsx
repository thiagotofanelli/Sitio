import { Header } from "@/components/public/header";
import { HeroSection } from "@/components/public/hero-section";
import { GallerySection } from "@/components/public/gallery-section";
import { AccommodationsSection } from "@/components/public/accommodations-section";
import { AmenitiesSection } from "@/components/public/amenities-section";
import { PricingSection } from "@/components/public/pricing-section";
import { AvailabilityCalendar } from "@/components/public/availability-calendar";
import { BookingForm } from "@/components/public/booking-form";
import { LocationSection } from "@/components/public/location-section";
import { FaqSection } from "@/components/public/faq-section";
import { Footer } from "@/components/public/footer";
import { MobileBottomBar } from "@/components/public/mobile-bottom-bar";
import { WhatsAppFab } from "@/components/ui/whatsapp-fab";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <GallerySection />
        <AccommodationsSection />
        <AmenitiesSection />
        <PricingSection />
        <AvailabilityCalendar />
        <BookingForm />
        <LocationSection />
        <FaqSection />
      </main>
      <Footer />
      <MobileBottomBar />
      <WhatsAppFab />
    </>
  );
}
