# Kids Fest Emes 2026

Landing page oficial do **Kids Fest Emes 2026**.

> **Pequenos artistas. Grandes conquistas. Memórias para toda a vida.**
> 30 de novembro de 2026 · 19h (horário de Brasília) · Teatro Marília, Belo Horizonte (MG) · Ingresso único R$ 20,00 via PIX

O site foi pensado como a divulgação de uma estreia teatral, com cortinas, holofotes, partículas de luz e animações de entrada. O pagamento é feito por PIX com QR Code real, e o comprovante é enviado pelo WhatsApp para conferência manual da equipe da Emes.

---

## Sumário

1. [Tecnologias](#tecnologias)
2. [Como rodar](#como-rodar)
3. [Estrutura](#estrutura)
4. [O que editar e onde](#o-que-editar-e-onde)
5. [Ativar o PIX](#ativar-o-pix)
6. [WhatsApp](#whatsapp)
7. [Meta Pixel](#meta-pixel)
8. [Fotos, logos e patrocinadores](#fotos-logos-e-patrocinadores)
9. [Deploy na Vercel](#deploy-na-vercel)
10. [Checklist antes de divulgar](#checklist-antes-de-divulgar)

---

## Tecnologias

- **Next.js 16** (App Router, Cache Components) com **React 19**
- **TypeScript** em modo `strict`
- **Tailwind CSS 4**
- **Motion for React**, para as animações de entrada ao rolar
- **Lucide React**, para os ícones
- **qrcode**, para gerar o QR Code PIX como SVG a partir do payload real
- **Vitest**, para os testes do payload PIX, da contagem regressiva e do WhatsApp
- **ESLint** (`eslint-config-next`)

O projeto não tem banco de dados, autenticação nem backend de pagamento. A página é gerada de forma estática.

## Como rodar

Requisito: **Node.js 20.9 ou mais recente** (testado no Node 22).

```bash
npm install
cp .env.example .env.local   # opcional em desenvolvimento
npm run dev                  # http://localhost:3000
```

| Comando             | O que faz                                    |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento                  |
| `npm run build`     | Build de produção                            |
| `npm start`         | Serve o build de produção                    |
| `npm run lint`      | ESLint                                       |
| `npm run typecheck` | TypeScript (`tsc --noEmit`)                  |
| `npm test`          | Testes unitários (Vitest)                    |
| `npm run check`     | Lint, typecheck, testes e build, nesta ordem |

## Estrutura

```
app/
  layout.tsx            fontes (Playfair Display + Poppins), SEO, Open Graph, JSON-LD do evento
  page.tsx              montagem dos capítulos
  globals.css           design system (paleta, CTA, holofotes, partículas, movimento reduzido)
  icon.svg              favicon
  opengraph-image.tsx   imagem de compartilhamento gerada no build
  robots.ts, sitemap.ts
components/
  hero/                 Capítulo 1: abertura cinematográfica
  experience/           Capítulo 2 (emoção) e Capítulo 4 (Emes)
  tickets/              Capítulo 3: ingresso, informações, mapa, programação
  payment/              PIX (QR Code e copia e cola) e botões de WhatsApp
  countdown/            contagem regressiva
  gallery/              galeria com lightbox
  sponsors/             patrocinadores
  faq/                  acordeão acessível
  closing/              encerramento
  layout/               cabeçalho, rodapé, suporte, WhatsApp flutuante
  analytics/            Meta Pixel com consentimento e evento ViewContent
  ui/                   peças reutilizáveis (Reveal, CTA, cortinas, holofotes, partículas)
config/
  event.ts              conteúdo editável: datas, local, programação, FAQ, galeria, patrocinadores
  payment.ts            configuração e estado do PIX
  integrations.ts       WhatsApp, Meta Pixel, mapas, URL do site
lib/
  pix.ts                geração do BR Code (EMV + CRC16) e validação de chaves
  countdown.ts          cálculo do tempo restante
  whatsapp.ts           montagem e validação dos links
  analytics.ts          eventos do Meta Pixel sem duplicidade
tests/                  testes unitários
public/images/gallery/  fotos reais
public/sponsors/        logos de patrocinadores
public/logos/           logos da Emes
```

## O que editar e onde

Todo o conteúdo editável fica em **`config/event.ts`**:

- `event`: nome, data, horário, local, endereço, preço e telefone
- `program`: itens confirmados da programação
- `performances`: ordem das apresentações. Enquanto estiver vazia, o site mostra “será divulgada em breve”.
- `faq`: perguntas frequentes. Acrescente respostas sobre quantidade de ingressos, crianças de colo, acessibilidade, portões ou estacionamento **somente depois que a Emes confirmar**.
- `gallery` e `sponsors`: veja [Fotos, logos e patrocinadores](#fotos-logos-e-patrocinadores)

> O endereço do Teatro Marília (Av. Professor Alfredo Balena, 586, Santa Efigênia, CEP 30130-100) foi conferido na ficha técnica do teatro publicada pela Prefeitura de Belo Horizonte. Reconfirme com o teatro antes da divulgação.

## Ativar o PIX

Enquanto a configuração estiver incompleta, a área de pagamento mostra **“Pagamento em configuração”**. Nenhum QR Code fictício é exibido. Em desenvolvimento, a mesma área lista o que ainda falta configurar.

1. Defina as variáveis (em `.env.local` ou na Vercel):
   ```
   NEXT_PUBLIC_PIX_KEY=<chave PIX da Emes>
   NEXT_PUBLIC_PIX_MERCHANT_NAME=<nome do recebedor, como no banco>
   NEXT_PUBLIC_PIX_MERCHANT_CITY=Belo Horizonte
   NEXT_PUBLIC_PIX_TXID=            # opcional, ex.: KIDSFEST2026
   ```
2. Gere um build (`npm run build && npm start`) ou faça um deploy de *preview*.
3. **Faça um PIX de teste** pelo app do banco, lendo o QR Code e também colando o código. Confira se o valor (R$ 20,00) e o nome do recebedor aparecem corretamente e se o dinheiro caiu na conta da Emes.
4. Só então defina `NEXT_PUBLIC_PIX_VALIDATED=true` e publique de novo.

Observações:

- O payload segue o padrão BR Code do Banco Central (EMV, campo 26 `br.gov.bcb.pix`, CRC16-CCITT). Os testes conferem o exemplo oficial do manual.
- Telefones como chave precisam do prefixo `+55` (ex.: `+5531999999999`).
- A chave PIX é pública por natureza. **Nunca** coloque tokens de bancos ou de provedores de pagamento em variáveis `NEXT_PUBLIC_*`.
- O site **não confirma compras**. A confirmação acontece quando a equipe confere o comprovante.

## WhatsApp

O número **(31) 2555-3273** foi testado pela equipe da Emes e recebe mensagens no WhatsApp (confirmado em 09/11/2026). Por isso, os botões “Enviar comprovante”, “Chamar no WhatsApp agora” e o botão flutuante já ficam ativos, sem precisar de variável.

- Para trocar de número: `NEXT_PUBLIC_WHATSAPP_NUMBER=55DDDNUMERO`, só dígitos. Teste antes em `https://wa.me/55DDDNUMERO`.
- Para desativar os links, por exemplo se o número deixar de funcionar: `NEXT_PUBLIC_WHATSAPP_VALIDATED=false`. Os botões passam a mostrar “Canal de WhatsApp em validação” e o telefone como alternativa.

As mensagens pré-preenchidas ficam em `config/integrations.ts`.

## Meta Pixel

1. Defina `NEXT_PUBLIC_META_PIXEL_ID=<ID numérico>`.
2. Por padrão, o pixel **só carrega depois que o visitante aceita** o aviso de privacidade (`NEXT_PUBLIC_META_PIXEL_REQUIRE_CONSENT=true`). Sem ID configurado, nem o aviso nem o script aparecem.

| Evento             | Quando dispara                                                    |
| ------------------ | ----------------------------------------------------------------- |
| `PageView`         | Ao carregar o pixel (uma vez)                                     |
| `ViewContent`      | Quando a área de pagamento aparece na tela (uma vez por visita)   |
| `InitiateCheckout` | Clique em “Garantir meu ingresso” ou cópia do código PIX (uma vez) |
| `Contact`          | Clique em um botão de WhatsApp ativo                              |
| `Purchase`         | **Nunca automaticamente**                                         |

`Purchase` só deve ser enviado depois da confirmação real do pagamento. Se no futuro houver um fluxo de confirmação, use `trackConfirmedPurchase()` de `lib/analytics.ts` ou, de preferência, a Conversions API no servidor.

## Fotos, logos e patrocinadores

**Galeria**: coloque as fotos em `public/images/gallery/` e cadastre-as em `config/event.ts`:

```ts
export const gallery: GalleryImage[] = [
  {
    src: "/images/gallery/kids-fest-2025-01.jpg",
    alt: "Alunos da turma de musicalização tocando no palco",
    width: 1600,
    height: 1067,
    caption: "Kids Fest 2025",
    imageUseAuthorized: true,
  },
];
```

- Use **apenas fotos reais** da Emes. Imagens geradas por IA não devem ser apresentadas como registro da escola.
- `imageUseAuthorized: true` só deve ser marcado com **autorização de uso de imagem dos responsáveis** por todas as crianças que aparecem na foto. Fotos marcadas como `false` não são exibidas.
- Exporte as fotos com cerca de 1600px no lado maior. O `next/image` faz a otimização e o carregamento sob demanda.

**Patrocinadores**: coloque os logos (de preferência SVG ou PNG transparente) em `public/sponsors/` e cadastre:

```ts
export const sponsors: Sponsor[] = [
  { name: "Nome do patrocinador", logo: "/sponsors/nome.svg", width: 240, height: 80, url: "https://..." },
];
```

Os logos aparecem em branco monocromático, para combinar com o fundo escuro.

## Deploy na Vercel

1. Envie o projeto para o GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. O framework Next.js é detectado sozinho.
3. Em **Settings → Environment Variables**, cadastre as variáveis do `.env.example`. Lembre-se de `NEXT_PUBLIC_SITE_URL` com o domínio final.
4. Faça o deploy. Como as variáveis `NEXT_PUBLIC_*` entram no build, **depois de alterar uma variável é preciso fazer um novo deploy** (Deployments → Redeploy).
5. **Domínio personalizado**: em **Settings → Domains**, adicione o domínio e crie no seu provedor de DNS os registros indicados pela Vercel (geralmente `A` para o domínio raiz e `CNAME` para `www`). O HTTPS é emitido automaticamente.

Outras hospedagens compatíveis com Next.js também funcionam com `npm run build` e `npm start`.

## Checklist antes de divulgar

- [ ] PIX de teste feito e `NEXT_PUBLIC_PIX_VALIDATED=true`
- [x] WhatsApp testado (09/11/2026)
- [ ] Endereço do teatro reconfirmado
- [ ] `NEXT_PUBLIC_SITE_URL` com o domínio final
- [ ] Fotos reais com autorização de uso de imagem
- [ ] Patrocinadores confirmados
- [ ] Ordem das apresentações, se a Emes quiser divulgar
- [ ] `npm run check` passando

## Acessibilidade e desempenho

- HTML semântico, link “Pular para o conteúdo”, foco visível dourado, navegação completa por teclado
- Acordeão e lightbox seguem os padrões WAI-ARIA. O lightbox usa `<dialog>` nativo e responde às setas e ao Esc.
- `prefers-reduced-motion` desliga partículas, holofotes, pulsos e reflexos
- Efeitos visuais feitos em CSS e SVG, sem imagens pesadas. Fontes servidas pelo próprio site via `next/font`.
- O mapa do Google só carrega depois do clique, o que poupa requisições a terceiros
- A contagem regressiva usa `useSyncExternalStore`, então não há divergência de hidratação. Depois do horário, mostra uma mensagem em vez de números negativos.
