import { Receipt } from "lucide-react";
import { whatsappLinks } from "@/config/integrations";
import { Countdown } from "@/components/countdown/Countdown";
import { PixPayment } from "@/components/payment/PixPayment";
import { WhatsAppAction } from "@/components/payment/WhatsAppAction";
import { TrackOnView } from "@/components/analytics/TrackOnView";
import { Reveal } from "@/components/ui/Reveal";
import { GoldDivider, SectionHeading } from "@/components/ui/SectionHeading";
import { Atmosphere, Particles } from "@/components/ui/StageBackdrop";
import { EventInfo } from "./EventInfo";
import { Program } from "./Program";
import { TicketCard } from "./TicketCard";
import { VenueMap } from "./VenueMap";

export function TicketsChapter() {
  return (
    <section
      id="ingressos"
      aria-labelledby="ingressos-title"
      className="relative isolate overflow-hidden border-y border-ouro/10 bg-gradient-to-b from-noite via-noite-2 to-noite py-24 sm:py-32"
    >
      <Atmosphere variant="blue" className="-z-10" />
      <Particles count={16} seed={21} className="-z-10 opacity-60" />

      <div className="mx-auto max-w-6xl space-y-24 px-5 sm:px-8">
        <div>
          <SectionHeading
            id="ingressos-title"
            chapter="Capítulo III"
            eyebrow="Ingressos"
            title={
              <>
                Seu lugar na plateia <span className="text-gold italic">está esperando</span>
              </>
            }
            subtitle="Faltam poucos dias para as luzes se acenderem."
          />
          <div className="mt-12">
            <Countdown />
          </div>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <TicketCard />
          </Reveal>
          <Reveal delay={0.15}>
            <div id="pagamento" className="glass scroll-mt-24 rounded-[2rem] p-6 sm:p-9">
              <TrackOnView />
              <PixPayment />
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div
            id="comprovante"
            className="relative overflow-hidden rounded-[2rem] border border-verde/25 bg-gradient-to-br from-verde/10 via-transparent to-azul/10 px-6 py-12 text-center sm:px-12"
          >
            <Receipt aria-hidden className="mx-auto size-10 text-verde-claro" />
            <h3 className="mt-5 font-display text-3xl font-semibold text-creme sm:text-4xl">
              Já realizou o pagamento?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-lg text-nevoa">
              Envie seu comprovante para a equipe da Emes e aguarde a confirmação do seu ingresso.
            </p>
            <WhatsAppAction
              href={whatsappLinks.receipt}
              label="Enviar comprovante pelo WhatsApp"
              context="receipt"
              className="mt-8"
            />
          </div>
        </Reveal>

        <div className="space-y-8">
          <EventInfo />
          <VenueMap />
        </div>

        <GoldDivider />

        <Program />
      </div>
    </section>
  );
}
