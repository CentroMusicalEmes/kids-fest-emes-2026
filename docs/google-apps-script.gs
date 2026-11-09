/**
 * Kids Fest Emes 2026 — recebe os pedidos do formulário do site e grava
 * cada um na próxima linha livre da aba "Vendas", na ordem de chegada.
 *
 * Instalação: veja docs/planilha-google.md.
 */

const SHEET_NAME = 'Vendas';
const FIRST_ROW = 5; // primeira linha de dados (a linha 4 é o cabeçalho)
const TOKEN = 'TROQUE-ESTE-TOKEN'; // mesmo valor de NEXT_PUBLIC_SALES_SHEET_TOKEN no site

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

/** Rode uma vez pelo editor para testar: cria uma linha de teste (apague depois). */
function testarGravacao() {
  const res = doPost({ postData: { contents: JSON.stringify({
    token: TOKEN, fullName: 'Teste da Silva', email: 'teste@exemplo.com', studentName: 'Aluno Teste', quantity: 1,
  }) } });
  Logger.log(res.getContent());
}
