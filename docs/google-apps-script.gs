/**
 * Kids Fest Emes 2026 — recebe os pedidos do formulário do site e grava
 * cada um na próxima linha livre da aba "Vendas", na ordem de chegada.
 *
 * Instalação: veja docs/planilha-google.md.
 */

const SHEET_NAME = 'Vendas';
const FIRST_ROW = 5; // primeira linha de dados (a linha 4 é o cabeçalho)
const TOKEN = 'TROQUE-ESTE-TOKEN'; // mesmo valor de NEXT_PUBLIC_SALES_SHEET_TOKEN no site
const SYMPLA_COL = 11; // coluna K: código(s) dos ingressos emitidos na Sympla

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // evita que dois pedidos simultâneos usem a mesma linha
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.token !== TOKEN) return json_({ ok: false, error: 'token' });

    const fullName = clean_(data.fullName, 120);
    const email = clean_(data.email, 254).toLowerCase();
    const studentName = clean_(data.studentName, 120);
    const quantity = Math.max(0, Math.min(50, parseInt(data.quantity, 10) || 0));
    if (!fullName || email.indexOf('@') < 1 || !studentName || !quantity) {
      return json_({ ok: false, error: 'dados' });
    }

    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    const lastRow = sheet.getMaxRows();
    const names = sheet.getRange(FIRST_ROW, 3, lastRow - FIRST_ROW + 1, 1).getValues();
    let index = names.findIndex(function (r) { return r[0] === ''; });
    if (index === -1) {
      sheet.insertRowsAfter(lastRow, 200);
      index = names.length;
    }
    const row = FIRST_ROW + index;

    // B: data/hora · C: nome · D: e-mail · E: aluno(a) · F: quantidade
    sheet.getRange(row, 2, 1, 5).setValues([[new Date(), fullName, email, studentName, quantity]]);
    // H: pagamento conferido? · I: ingresso emitido na Sympla?
    sheet.getRange(row, 8, 1, 2).setValues([['Não', 'Não']]);

    return json_({ ok: true, row: row });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Remove quebras de linha, limita o tamanho e impede fórmulas maliciosas. */
function clean_(value, max) {
  let text = String(value || '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ========================================================================== */
/* Sincronização com a Sympla                                                 */
/* ========================================================================== */
/*
 * Consulta os participantes do evento na Sympla e, para cada pedido da aba
 * Vendas com o mesmo e-mail, marca "Ingresso emitido na Sympla?" = Sim e
 * anota os códigos na coluna K. A API pública da Sympla só permite CONSULTAR;
 * a emissão continua sendo feita pela equipe no painel da Sympla.
 *
 * Configuração (Configurações do projeto ⚙️ → Propriedades do script):
 *   SYMPLA_TOKEN     → token gerado na Sympla (Minha conta → Integrações)
 *   SYMPLA_EVENT_ID  → ID do evento (rode listarEventosSympla para descobrir)
 * O token fica guardado nas propriedades, nunca no código.
 */

const SYMPLA_BASES = [
  'https://api.sympla.com.br/public/v3',
  'https://api.sympla.com.br/public/v1.6.0',
  'https://api.sympla.com.br/public/v1.5.1',
];

function symplaProps_() {
  const props = PropertiesService.getScriptProperties();
  const token = (props.getProperty('SYMPLA_TOKEN') || '').trim();
  const eventId = (props.getProperty('SYMPLA_EVENT_ID') || '').trim();
  if (!token) throw new Error('Falta a propriedade SYMPLA_TOKEN.');
  return { token: token, eventId: eventId, base: props.getProperty('SYMPLA_BASE') || '' };
}

function symplaGet_(base, path, token) {
  const res = UrlFetchApp.fetch(base + path, {
    method: 'get',
    headers: { s_token: token, Accept: 'application/json' },
    muteHttpExceptions: true,
  });
  return { code: res.getResponseCode(), body: res.getContentText() };
}

/** Descobre qual versão da API responde para este token e guarda a escolha. */
function symplaBase_(cfg) {
  if (cfg.base) return cfg.base;
  for (let i = 0; i < SYMPLA_BASES.length; i++) {
    const r = symplaGet_(SYMPLA_BASES[i], '/events?page_size=1', cfg.token);
    if (r.code === 200) {
      PropertiesService.getScriptProperties().setProperty('SYMPLA_BASE', SYMPLA_BASES[i]);
      return SYMPLA_BASES[i];
    }
  }
  throw new Error('A API da Sympla não aceitou o token (confira SYMPLA_TOKEN).');
}

/** Rode pelo editor para ver seus eventos e copiar o ID do Kids Fest. */
function listarEventosSympla() {
  const cfg = symplaProps_();
  const base = symplaBase_(cfg);
  const r = symplaGet_(base, '/events?page_size=100', cfg.token);
  const data = (JSON.parse(r.body).data) || [];
  Logger.log('API: ' + base + ' · ' + data.length + ' evento(s)');
  data.forEach(function (ev) {
    Logger.log('ID: ' + ev.id + ' | ' + ev.name + ' | ' + (ev.start_date || ''));
  });
}

/** Lê todos os participantes do evento, página por página. */
function participantesSympla_(cfg, base) {
  if (!cfg.eventId) throw new Error('Falta a propriedade SYMPLA_EVENT_ID.');
  const all = [];
  for (let page = 1; page <= 100; page++) {
    const r = symplaGet_(base, '/events/' + encodeURIComponent(cfg.eventId) +
      '/participants?page_size=200&page=' + page, cfg.token);
    if (r.code !== 200) throw new Error('Sympla respondeu ' + r.code + ': ' + r.body.slice(0, 200));
    const json = JSON.parse(r.body);
    const data = json.data || [];
    data.forEach(function (p) { all.push(p); });
    const pag = json.pagination || {};
    if (!data.length || pag.has_next === false || data.length < 200) break;
  }
  return all;
}

/** Rode pelo editor para conferir se a leitura funciona (não altera a planilha). */
function testarSympla() {
  const cfg = symplaProps_();
  const base = symplaBase_(cfg);
  const lista = participantesSympla_(cfg, base);
  Logger.log('API: ' + base + ' · participantes: ' + lista.length);
  if (lista.length) {
    const p = lista[0];
    Logger.log('Campos do 1º participante: ' + Object.keys(p).join(', '));
    Logger.log('E-mail: ' + emailDe_(p) + ' · Código: ' + codigoDe_(p));
  }
}

function emailDe_(p) {
  return String(p.email || p.participant_email || (p.buyer && p.buyer.email) || '').trim().toLowerCase();
}

function codigoDe_(p) {
  return String(p.ticket_number || p.ticket_num_qr_code || p.ticket_code || p.id || '');
}

/** Cruza a Sympla com a aba Vendas. Executado automaticamente a cada 15 min. */
function sincronizarSympla() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const cfg = symplaProps_();
    const base = symplaBase_(cfg);
    const lista = participantesSympla_(cfg, base);

    // e-mail → códigos dos ingressos emitidos (fila por e-mail)
    const porEmail = {};
    lista.forEach(function (p) {
      const email = emailDe_(p);
      if (!email) return;
      (porEmail[email] = porEmail[email] || []).push(codigoDe_(p));
    });

    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (!sheet.getRange(4, SYMPLA_COL).getValue()) {
      sheet.getRange(4, SYMPLA_COL).setValue('Código(s) Sympla')
        .setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#30145C')
        .setHorizontalAlignment('center').setWrap(true);
      sheet.setColumnWidth(SYMPLA_COL, 220);
    }

    const n = sheet.getMaxRows() - FIRST_ROW + 1;
    const dados = sheet.getRange(FIRST_ROW, 1, n, SYMPLA_COL).getValues();
    let atualizados = 0;

    // Percorre os pedidos em ordem; se a mesma pessoa fez dois pedidos, os
    // ingressos são distribuídos primeiro para o pedido mais antigo.
    for (let i = 0; i < dados.length; i++) {
      const linha = dados[i];
      const email = String(linha[3] || '').trim().toLowerCase();
      const qtd = parseInt(linha[5], 10) || 0;
      if (!email || !qtd) continue;
      const fila = porEmail[email] || [];
      const codigos = fila.splice(0, qtd);
      if (!codigos.length) continue;

      const texto = codigos.join(', ') + (codigos.length < qtd ? ' (' + codigos.length + ' de ' + qtd + ')' : '');
      const row = FIRST_ROW + i;
      if (linha[SYMPLA_COL - 1] !== texto) {
        sheet.getRange(row, SYMPLA_COL).setValue(texto);
        atualizados++;
      }
      if (codigos.length >= qtd && linha[8] !== 'Sim') {
        sheet.getRange(row, 9).setValue('Sim');
        atualizados++;
      }
    }
    Logger.log('Sympla: ' + lista.length + ' participante(s) · ' + atualizados + ' célula(s) atualizada(s).');
  } finally {
    lock.releaseLock();
  }
}

/** Rode UMA vez: agenda a sincronização a cada 15 minutos. */
function ativarSincronizacaoAutomatica() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'sincronizarSympla') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('sincronizarSympla').timeBased().everyMinutes(15).create();
  Logger.log('Sincronização com a Sympla ativada: a cada 15 minutos.');
}

/** Rode uma vez pelo editor para testar: cria uma linha de teste (apague depois). */
function testarGravacao() {
  const res = doPost({ postData: { contents: JSON.stringify({
    token: TOKEN, fullName: 'Teste da Silva', email: 'teste@exemplo.com', studentName: 'Aluno Teste', quantity: 1,
  }) } });
  Logger.log(res.getContent());
}
