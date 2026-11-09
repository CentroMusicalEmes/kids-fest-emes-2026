# Planilha de controle de vendas: preenchimento automático

Cada pedido enviado pelo formulário do site (nome completo, e-mail, nome do aluno e quantidade) é gravado na próxima linha livre da aba **Vendas**, na ordem de chegada. A equipe só marca **Pagamento conferido?** e **Ingresso emitido na Sympla?**.

## 1. Criar a planilha no Google (5 min)

1. Abra o [Google Drive](https://drive.google.com) da Emes e arraste para ele o arquivo `docs/controle-vendas-kids-fest-2026.xlsx`.
2. Clique com o botão direito no arquivo → **Abrir com → Planilhas Google**.
3. Menu **Arquivo → Salvar como Planilhas Google**. Use essa nova versão daqui em diante.
4. Menu **Arquivo → Configurações → Fuso horário: (GMT-03:00) São Paulo** → Salvar.

## 2. Instalar o script (5 min)

1. Na planilha, menu **Extensões → Apps Script**.
2. Apague o conteúdo e cole o arquivo `docs/google-apps-script.gs` inteiro.
3. Na linha `const TOKEN = 'TROQUE-ESTE-TOKEN';`, troque pelo texto combinado (por exemplo `kidsfest-2026-x7`).
4. Salve (ícone de disquete).
5. *(Opcional)* No seletor de funções, escolha `testarGravacao` → **Executar** → autorize com a conta da Emes. Uma linha de teste aparece na planilha. Apague essa linha depois.

## 3. Publicar como app da Web

1. **Implantar → Nova implantação** → engrenagem → **App da Web**.
2. **Executar como:** *Eu*. **Quem pode acessar:** *Qualquer pessoa*.
3. **Implantar** → autorize → copie a **URL do app da Web**. Ela termina em `/exec`.

## 4. Ligar no site

Cadastre na Vercel (Settings → Environment Variables) e faça um novo deploy:

```
NEXT_PUBLIC_SALES_SHEET_URL=<URL /exec copiada>
NEXT_PUBLIC_SALES_SHEET_TOKEN=<o mesmo token do passo 2>
```

## Observações

- **O registro acontece quando a pessoa envia o formulário.** Isso não significa pagamento confirmado: por isso a coluna H começa como "Não" e fica amarela até a conferência do PIX.
- **Se a planilha falhar,** o WhatsApp abre normalmente e a equipe continua recebendo os dados pela mensagem.
- **O token não é senha:** ele fica visível no site. Serve só para filtrar envios aleatórios.
- **LGPD:** compartilhe a planilha só com a equipe e apague os dados após o evento.

## Comprovante obrigatório

O formulário do site exige o comprovante do PIX (foto, print ou PDF, até 8 MB). O script salva o arquivo na pasta **"Kids Fest 2026 - Comprovantes"** do Google Drive da conta dona do script e coloca o link **"Ver comprovante"** na coluna **L** da aba Vendas. Se o Drive falhar, nada é gravado e o site oferece o WhatsApp como reserva.

Depois de colar o código, rode `prepararPastaDeComprovantes` uma vez pelo editor, para autorizar o acesso ao Drive, e publique uma **nova versão**. Para a equipe abrir os comprovantes, compartilhe a pasta com quem confere os pagamentos.

## 5. Integração com a Sympla (ingressos emitidos entram sozinhos)

A cada 15 minutos o script consulta os participantes do evento na Sympla. Para cada pedido da aba **Vendas** com o mesmo e-mail, ele marca **Ingresso emitido na Sympla? = Sim** e anota o(s) código(s) na coluna **K**. Se a pessoa pediu 3 e só 1 foi emitido, a coluna K mostra "(1 de 3)" e o status continua "Não".

A API pública da Sympla só permite **consultar**: a emissão continua sendo feita no painel da Sympla, com o **mesmo e-mail** que está na planilha.

1. **Token da Sympla:** na Sympla, em *Minha conta → Integrações* (ou *Configurações → API*), gere um token de acesso.
2. No Apps Script, vá em **⚙️ Configurações do projeto → Propriedades do script → Adicionar propriedade**:
   - `SYMPLA_TOKEN` = o token da Sympla (fica guardado aqui, fora do código)
3. No editor, selecione a função **`listarEventosSympla`** → **Executar** → autorize → em **Registro de execução**, copie o **ID** do Kids Fest.
4. Adicione a propriedade `SYMPLA_EVENT_ID` = esse ID.
5. Execute **`testarSympla`**: o registro mostra quantos participantes foram lidos (não altera a planilha).
6. Execute **`ativarSincronizacaoAutomatica`** uma única vez. Pronto: a cada 15 minutos a planilha é atualizada.

Para sincronizar na hora, execute `sincronizarSympla` pelo editor.
