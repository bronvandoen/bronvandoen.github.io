/**
 * Team budgets receiver for the Economic Cultures workshop tools.
 *
 * Lives in the Google Sheet "Expanding Practices: team links (host only) (Responses)"
 * (Extensions → Apps Script), deployed as a web app:
 * Execute as: Me · Who has access: Anyone.
 *
 * A team presses "Send to the live report" in the tool, reads what will be sent,
 * and confirms. The tool then posts its own link here. Each accepted link
 * becomes one row in the same tab the host form writes to:
 *   Timestamp · Team link · Round · Sent from
 * so the display reads one list, whichever way a team arrived.
 *
 * The script, not the tool, decides what is accepted:
 * - only during an edition's window (EDITIONS below), so nothing arrives after it;
 * - only links to that edition's tool, in the tool's own code alphabet;
 * - a link already in the sheet is not written twice.
 * The round comes from the clock. The host can still change any row by hand.
 * A change here only works after Minsung pastes it into the Sheet's Apps Script and chooses
 * Deploy > Manage deployments > edit > Version: New version, which keeps the address.
 * Not served by the site; kept here as the record.
 */

var SHEET_NAME = 'Form responses 1';

var EDITIONS = {
  'expanding-practices-2026-11-21': {
    opens:  '2026-11-20T08:00:00+01:00',   // open on the 20th for the phone test
    closes: '2026-11-21T23:59:59+01:00',
    round2: '2026-11-21T15:50:00+01:00',   // sends from here on count as round 2
    prefix: 'https://bronvandoen.github.io/tools/economic-cultures/expanding-practices/?card='
  }
};

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.website) return reply_({ ok: true });          // spam trap, as on the feedback page

  var ed = EDITIONS[String(p.edition || '')];
  if (!ed) return reply_({ ok: false, error: 'edition' });

  var now = new Date();
  if (now < new Date(ed.opens) || now > new Date(ed.closes)) return reply_({ ok: false, error: 'closed' });

  var link = String(p.link || '').trim();
  if (!valid_(link, ed.prefix)) return reply_({ ok: false, error: 'link' });

  var round = now >= new Date(ed.round2) ? 2 : 1;

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = sheet_();
    var last = sheet.getLastRow();
    if (last > 1) {
      var links = sheet.getRange(2, 2, last - 1, 1).getValues();
      for (var i = 0; i < links.length; i++) {
        if (String(links[i][0]).trim() === link) return reply_({ ok: true, round: round, duplicate: true });
      }
    }
    sheet.appendRow([now, link, round, 'tool']);
  } finally {
    lock.releaseLock();
  }
  return reply_({ ok: true, round: round });
}

// Opening the web app address in a browser shows that it is alive, and which editions are open.
function doGet() {
  var now = new Date(), open = [];
  for (var k in EDITIONS) {
    if (now >= new Date(EDITIONS[k].opens) && now <= new Date(EDITIONS[k].closes)) open.push(k);
  }
  return reply_({ ok: true, note: 'Team budgets receiver for a Situated Studio.', open: open });
}

// The tool's link: its address, a situation 1 to 5, then the code in the QR alphanumeric alphabet.
function valid_(link, prefix) {
  if (link.length > 3000 || link.indexOf(prefix) !== 0) return false;
  return /^[1-5]#s=[0-9A-Z $%*+\-.\/:]{20,}$/.test(link.slice(prefix.length));
}

function sheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  return book.getSheetByName(SHEET_NAME) || book.getSheets()[0];
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
