import { Hero } from "@/components/hero/Hero";
import { EmotionChapter } from "@/components/experience/EmotionChapter";
import { EmesChapter } from "@/components/experience/EmesChapter";
import { TicketsChapter } from "@/components/tickets/TicketsChapter";
import { Finale } from "@/components/closing/Finale";
import { Header } from "@/components/layout/Header";
import { Support } from "@/components/layout/Support";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <EmotionChapter />
        <TicketsChapter />
        <EmesChapter />
        <Finale />
        <Support />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
