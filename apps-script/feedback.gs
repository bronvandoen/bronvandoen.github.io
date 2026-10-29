/**
 * Workshop feedback receiver for https://bronvandoen.github.io/feedback/
 *
 * Lives in a Google Sheet (Extensions → Apps Script), deployed as a web app:
 * Execute as: Me · Who has access: Anyone.
 * Each message from the feedback page becomes one row:
 *   Received · Workshop · Name · Message
 * The workshop label comes from the QR link (?w=...), so this script never
 * changes between workshops. Not served by the site; kept here as the record.
 */

var SHEET_NAME = 'Messages';
var HEADERS = ['Received', 'Workshop', 'Name', 'Message'];

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Spam trap: people never see the "website" field, bots fill it in.
  // Answer as if all went well, write nothing.
  if (p.website) return reply_({ ok: true });

  var message = clean_(p.message, 4000);
  if (!message) return reply_({ ok: false, error: 'empty' });

  var workshop = String(p.w || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 60) || 'none';
  var name = clean_(p.name, 100);

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = sheet_();
    sheet.appendRow([new Date(), workshop, name, message]);
  } finally {
    lock.releaseLock();
  }
  return reply_({ ok: true });
}

// Opening the web app address in a browser shows that it is alive.
function doGet() {
  return reply_({ ok: true, note: 'Feedback receiver for a Situated Studio.' });
}

function sheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setColumnWidth(4, 480);
  }
  return sheet;
}

// Trim, cap the length, and stop a message from running as a formula.
function clean_(value, max) {
  var s = String(value || '').replace(/\r\n?/g, '\n').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
