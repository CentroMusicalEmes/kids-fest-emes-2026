import { faq } from "@/config/event";
import { whatsappLinks } from "@/config/integrations";
import { Faq } from "@/components/faq/Faq";
import { WhatsAppAction } from "@/components/payment/WhatsAppAction";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Atmosphere } from "@/components/ui/StageBackdrop";

export function Support() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative isolate overflow-hidden py-24 sm:py-32">
      <Atmosphere variant="gold" className="-z-10" />
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading id="faq-title" eyebrow="Perguntas frequentes" title="Tudo o que você precisa saber" />
        <Reveal className="mt-12">
          <Faq items={faq} />
        </Reveal>

        <Reveal className="mt-20">
          <div id="contato" className="glass scroll-mt-24 rounded-[2rem] px-6 py-12 text-center sm:px-12">
            <h2 className="font-display text-3xl font-semibold text-creme sm:text-4xl">Ainda tem dúvidas?</h2>
            <p className="mt-3 text-lg text-nevoa">Chama a gente no WhatsApp.</p>
            <WhatsAppAction
              href={whatsappLinks.support}
              label="Chamar no WhatsApp agora"
              context="support"
              className="mt-8"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
