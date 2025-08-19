// ===== Knock Auto-Reply (Gmail + Supabase) — TEMPLATE =====
// Fill these before deploying to Apps Script:
const KNOCK_LINK = 'https://<your-gh-pages-domain>/Knock/';
const SUPABASE_URL = 'https://<your-project-ref>.supabase.co';
const SUPABASE_ANON_KEY = '<your-anon-public-key>';

function runKnockSweep(){ handleNewUnknown_(); releaseApproved_(); }

function label_(){ return GmailApp.getUserLabelByName('Knock Needed') || GmailApp.createLabel('Knock Needed'); }

function handleNewUnknown_(){
  const query='in:inbox -label:"Knock Needed" -from:me -is:chat -category:promotions -category:social newer_than:7d';
  const lab=label_(); GmailApp.search(query,0,50).forEach(t=>{ const m=t.getMessages()[0], from=parseEmail_(m.getFrom());
    if(!from||isWhitelisted_(from)) return;
    if(!hasOurReply_(t)) t.reply(`Thanks for reaching out.\n\nPlease request access here: ${KNOCK_LINK}\n\n— Owner`);
    t.addLabel(lab); t.moveToArchive();
  });
}
function releaseApproved_(){
  const lab=label_(); lab.getThreads(0,100).forEach(t=>{ const m=t.getMessages()[0], from=parseEmail_(m.getFrom());
    if(from && isWhitelisted_(from)){ t.removeLabel(lab); t.moveToInbox(); }
  });
}
function isWhitelisted_(email){
  const url=`${SUPABASE_URL}/rest/v1/whitelist?email=eq.${encodeURIComponent(email)}&select=email`;
  const r=UrlFetchApp.fetch(url,{headers:{apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`},muteHttpExceptions:true});
  if(r.getResponseCode()!==200) return false; const rows=JSON.parse(r.getContentText()||'[]'); return rows.length>0;
}
function hasOurReply_(thread){
  const me=Session.getActiveUser().getEmail(); const msgs=thread.getMessages();
  for(let i=msgs.length-1;i>=0;i--){ const m=msgs[i]; if(m.getFrom().includes(me)&&m.getBody().includes(KNOCK_LINK)) return true; }
  return false;
}
function parseEmail_(from){ const m=from.match(/<(.+?)>/); return (m?m[1]:from).trim().toLowerCase(); }
