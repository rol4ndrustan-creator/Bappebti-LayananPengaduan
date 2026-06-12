import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const roles = {
  public: { label: 'Public User', eyebrow: 'PUBLIC PORTAL', desc: 'Submit, monitor, add evidence, respond clarification, and accept/reject resolution.', tabs: ['Dashboard','Pengaduan Saya','Buat Pengaduan','Notifikasi','Profil'] },
  platform: { label: 'Platform / Pialang', eyebrow: 'MEMBER PORTAL', desc: 'Only sees cases currently assigned to the platform/pialang.', tabs: ['Dashboard','Case Queue','Reporting'] },
  bursa: { label: 'Bursa', eyebrow: 'BURSA OVERSIGHT', desc: 'Higher-level queue for cases escalated from platform or involving bursa review.', tabs: ['Dashboard','Case Queue','Platform Performance'] },
  kliring: { label: 'Kliring', eyebrow: 'CLEARING PORTAL', desc: 'Settlement, clearing, withdrawal log, and reconciliation case review.', tabs: ['Dashboard','Settlement Queue','Evidence Review'] },
  regulator: { label: 'Bappebti Regulator', eyebrow: 'REGULATOR CONSOLE', desc: 'Monitor all complaints, Bappebti-owned cases, member-assigned cases, critical queue, and public feedback.', tabs: ['Executive Dashboard','Complaint Queue','Kritik / Masukan','Member Performance','Reporting'] },
  association: { label: 'Association', eyebrow: 'ASSOCIATION VIEW', desc: 'Aggregated industry insight and education topics without personal complaint details.', tabs: ['Dashboard','Trend Insight','Education Topics'] },
  admin: { label: 'Super Admin', eyebrow: 'SYSTEM ADMIN', desc: 'Master user, member mapping, SLA rules, workflow settings, and audit logs.', tabs: ['Dashboard','Master Data','SLA Config','Audit Logs'] }
};

const members = [
  { platform:'PT Bursa Digital Nusantara', type:'Platform/Pialang', bursa:'Bursa Berjangka Jakarta', kliring:'PT Kliring Berjangka Indonesia', risk:'High' },
  { platform:'PT Indodax Nasional Indonesia', type:'Pedagang Aset Kripto', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', risk:'Low' },
  { platform:'PT Crypto Indonesia Berkat', type:'Pedagang Aset Kripto', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', risk:'Medium' },
  { platform:'PT Pintu Kemana Saja', type:'Pedagang Aset Kripto', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', risk:'Medium' },
  { platform:'PT Monex Investindo Futures', type:'Pialang Berjangka', bursa:'Bursa Berjangka Jakarta', kliring:'PT Kliring Berjangka Indonesia', risk:'Low' }
];

const seedCases = [
  { id:'BPP-2026-000184', title:'Penarikan dana belum diterima', user:'Andi Pratama', platform:'PT Bursa Digital Nusantara', bursa:'Bursa Berjangka Jakarta', kliring:'PT Kliring Berjangka Indonesia', category:'Dana / Withdrawal', sub:'Withdrawal belum masuk rekening', status:'In Progress', ownerType:'platform', owner:'PT Bursa Digital Nusantara', severity:'High', queue:'Complaint', sla:'18 jam tersisa', submitted:'12 Jun 2026 09:18', updated:'12 Jun 2026 14:05', incident:'10 Jun 2026', ref:'WD-8839201', account:'ANDI-8821', amount:'Rp 27.500.000', expected:'Dana diterima atau terdapat bukti settlement resmi.', channel:'BAPPEBTI PORTAL', risk:'Nilai transaksi material. Perlu bukti settlement, withdrawal log, dan audit trail approval.', evidence:['Bukti transfer.pdf','Screenshot status withdrawal.png'], timeline:[['12 Jun 2026 09:18','Public User','Complaint submitted','Pengaduan dikirim melalui BAPPEBTI PORTAL.'],['12 Jun 2026 09:21','System','Validation completed','Data wajib dan bukti awal dinyatakan lengkap.'],['12 Jun 2026 09:24','System','Routed to Platform','Current owner menjadi PT Bursa Digital Nusantara.'],['12 Jun 2026 14:05','Platform','Investigation started','Platform memeriksa withdrawal log dan settlement status.']] },
  { id:'BPP-2026-000185', title:'Transaksi tidak dikenali pada akun', user:'Sari Wulandari', platform:'PT Crypto Indonesia Berkat', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', category:'Transaksi Tidak Dikenali', sub:'Unauthorized transaction', status:'Escalated to Bappebti', ownerType:'regulator', owner:'Direktorat Pengawasan PBK', severity:'Critical', queue:'Critical', sla:'Overdue 4 jam', submitted:'11 Jun 2026 16:45', updated:'12 Jun 2026 10:15', incident:'11 Jun 2026', ref:'TRX-22190888', account:'SARI-7712', amount:'Tidak diisi', expected:'Investigasi resmi atas transaksi tidak dikenali.', channel:'BAPPEBTI PORTAL', risk:'Indikasi fraud dan potensi pola berulang. Perlu review regulator.', evidence:['Log aktivitas akun.xlsx','Email notifikasi transaksi.pdf'], timeline:[['11 Jun 2026 16:45','Public User','Complaint submitted','Kasus masuk dengan indikasi transaksi tidak dikenali.'],['11 Jun 2026 17:00','System','High risk detected','Kategori dan kata kunci masuk risk trigger.'],['12 Jun 2026 08:40','Platform','Initial response disputed','Jawaban awal platform ditolak pelapor.'],['12 Jun 2026 10:15','Bappebti','Escalation accepted','Current owner berubah ke regulator.']] },
  { id:'BPP-2026-000186', title:'Saldo aset tidak sesuai setelah settlement', user:'Michael Tan', platform:'PT Pintu Kemana Saja', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', category:'Settlement / Kliring', sub:'Perbedaan saldo setelah settlement', status:'Waiting for Kliring', ownerType:'kliring', owner:'PT Kliring Komoditi Digital', severity:'Medium', queue:'Complaint', sla:'9 jam tersisa', submitted:'12 Jun 2026 10:22', updated:'12 Jun 2026 12:41', incident:'12 Jun 2026', ref:'SETTLE-66201', account:'MIKE-2020', amount:'Rp 8.200.000', expected:'Koreksi saldo sesuai hasil settlement.', channel:'BAPPEBTI PORTAL', risk:'Terkait batch settlement dan rekonsiliasi; current owner harus kliring.', evidence:['Riwayat transaksi.csv'], timeline:[['12 Jun 2026 10:22','Public User','Complaint submitted','Pelapor menyampaikan selisih saldo aset.'],['12 Jun 2026 10:28','System','Routed to Platform','Validasi awal selesai.'],['12 Jun 2026 12:10','Platform','Settlement dependency confirmed','Platform menyatakan perlu review kliring.'],['12 Jun 2026 12:41','System','Routed to Kliring','Current owner menjadi PT Kliring Komoditi Digital.']] },
  { id:'BPP-2026-000188', title:'Permintaan penutupan akun belum diproses', user:'Andi Pratama', platform:'PT Indodax Nasional Indonesia', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', category:'Akun / Penutupan Akun', sub:'Account closure request', status:'Resolution Proposed', ownerType:'public', owner:'Andi Pratama', severity:'Low', queue:'Complaint', sla:'24 jam tersisa', submitted:'10 Jun 2026 15:30', updated:'12 Jun 2026 11:00', incident:'09 Jun 2026', ref:'-', account:'ANDI-8821', amount:'Tidak relevan', expected:'Akun ditutup dan dikonfirmasi resmi.', channel:'BAPPEBTI PORTAL', risk:'Amount tidak relevan sehingga tidak perlu dipaksa diisi.', evidence:['Email permintaan penutupan.pdf'], timeline:[['10 Jun 2026 15:30','Public User','Complaint submitted','Permintaan penutupan akun dilaporkan.'],['10 Jun 2026 15:40','System','Routed to Platform','Current owner menjadi platform.'],['12 Jun 2026 11:00','Platform','Resolution proposed','Platform menyatakan akun sudah dijadwalkan untuk ditutup.'],['12 Jun 2026 11:05','System','Waiting user confirmation','Current owner kembali ke public user untuk accept/reject.']] }
];

const feedback = [
  { id:'FB-2026-0012', type:'Kritik', topic:'Alur registrasi', text:'Instruksi registrasi perlu dibuat lebih jelas untuk pengguna baru.', source:'Public Portal', status:'Open', date:'12 Jun 2026 13:20' },
  { id:'FB-2026-0013', type:'Masukan', topic:'Notifikasi', text:'Pengguna meminta notifikasi email saat status pengaduan berubah.', source:'Public Portal', status:'Reviewed', date:'12 Jun 2026 14:05' }
];

function App(){
  const [auth,setAuth] = useState(false);
  const [role,setRole] = useState('public');
  const [tab,setTab] = useState('Dashboard');
  const [selected,setSelected] = useState(null);
  const [step,setStep] = useState(1);
  const [success,setSuccess] = useState(null);
  const [filters,setFilters] = useState({ q:'', status:'All', severity:'All', owner:'All' });
  const meta = roles[role];
  const cases = useMemo(()=>visibleCases(role).filter(c=>{
    const q = filters.q.toLowerCase();
    return (!q || [c.id,c.title,c.platform,c.category,c.owner].join(' ').toLowerCase().includes(q)) &&
      (filters.status==='All'||c.status===filters.status) &&
      (filters.severity==='All'||c.severity===filters.severity) &&
      (filters.owner==='All'||c.ownerType===filters.owner);
  }),[role,filters]);

  function changeRole(r){ setRole(r); setTab(roles[r].tabs[0]); setSelected(null); setSuccess(null); }
  function openCase(c){ setSelected(c); setSuccess(null); }
  function submitComplaint(){
    setSuccess({ id:'BPP-2026-000201', title:'Pengaduan berhasil dikirim', owner:'PT Bursa Digital Nusantara', time:'12 Jun 2026 17:48', status:'Submitted' });
    setTab('Pengaduan Saya'); setStep(1); setSelected(null);
  }

  if(!auth) return <Auth onLogin={()=>{setAuth(true); setRole('public'); setTab('Dashboard');}} />;

  return <>
    <header className="topbar">
      <div className="brandMark"><div className="logoMock">B</div><div><p>{meta.eyebrow}</p><h1>{meta.label}</h1><span>{meta.desc}</span></div></div>
      <div className="tools"><button className="ghost">Help</button><button className="primary" onClick={()=>{setRole('public');setTab('Buat Pengaduan');setSelected(null);}}>+ Quick Action</button><select value={role} onChange={e=>changeRole(e.target.value)}>{Object.keys(roles).map(k=><option key={k} value={k}>{roles[k].label}</option>)}</select><button className="ghost square" onClick={()=>setAuth(false)}>↗</button></div>
    </header>
    <nav className="tabs">{meta.tabs.map(t=><button key={t} className={tab===t&&!selected?'active':''} onClick={()=>{setTab(t); setSelected(null); setSuccess(null);}}>{t}</button>)}</nav>
    <main>
      {success ? <Success data={success} onView={()=>openCase(seedCases[0])} onNew={()=>{setSuccess(null);setTab('Buat Pengaduan');}} /> :
       selected ? <CaseDetail c={selected} onBack={()=>setSelected(null)} role={role} /> :
       <Page role={role} tab={tab} cases={cases} filters={filters} setFilters={setFilters} openCase={openCase} step={step} setStep={setStep} submitComplaint={submitComplaint} />}
    </main>
  </>;
}

function Auth({onLogin}){
  const [mode,setMode] = useState('login');
  return <div className="authPage">
    <div className="authHead"><div className="logoMock">B</div><div><b>Layanan Pengaduan Bappebti</b><span>Complaint Ecosystem Portal</span></div></div>
    <section className="authGrid">
      <div className="hero"><p className="eyebrow">BAPPEBTI PORTAL</p><h2>Saluran pengaduan resmi yang transparan, terukur, dan dapat dipantau.</h2><p>Public user wajib register/login agar pengaduan valid, mengurangi spam, memiliki case ownership, dan dapat dimonitor sampai penyelesaian.</p><div className="flow"><span>Register / Login</span><b>›</b><span>Submit Complaint</span><b>›</b><span>Track Case</span><b>›</b><span>Resolution</span></div><div className="note"><b>Demo Scenario</b><p>Login sebagai Public User, submit pengaduan, lihat ticket success page, buka case detail, lalu gunakan role switcher di kanan atas untuk melihat Platform, Bursa, Kliring, Regulator, Association, dan Admin.</p></div></div>
      <div className="loginCard"><div className="switch"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Login</button><button className={mode==='register'?'active':''} onClick={()=>setMode('register')}>Register</button></div><h2>{mode==='login'?'Masuk ke Portal':'Registrasi Akun'}</h2><label>Email<input defaultValue="andi.pratama@email.id" /></label>{mode==='register'&&<><label>Nama Lengkap<input defaultValue="Andi Pratama" /></label><label>No. HP<input defaultValue="+62 812 0000 7711" /></label></>}<label>Password<input type="password" defaultValue="password" /></label><button className="primary full" onClick={onLogin}>{mode==='login'?'Login Demo':'Register Demo'}</button><button className="ghost full" onClick={onLogin}>Masuk Demo sebagai Regulator</button></div>
    </section>
  </div>
}

function Page(p){
  const {role,tab,cases,filters,setFilters,openCase,step,setStep,submitComplaint}=p;
  if(role==='public' && tab==='Buat Pengaduan') return <Wizard step={step} setStep={setStep} submit={submitComplaint}/>;
  if(role==='public' && tab==='Notifikasi') return <Notifications/>;
  if(role==='public' && tab==='Profil') return <Profile/>;
  if(role==='regulator' && tab==='Kritik / Masukan') return <FeedbackQueue/>;
  if(tab.includes('Reporting') || tab.includes('Performance') || tab.includes('Insight') || tab.includes('Education') || tab.includes('Audit') || tab.includes('Master') || tab.includes('SLA')) return <Reporting role={role} tab={tab}/>;
  if(tab.includes('Queue') || tab==='Pengaduan Saya' || tab==='Settlement Queue' || tab==='Evidence Review' || tab==='Complaint Queue') return <CaseQueue title={tab} cases={cases} filters={filters} setFilters={setFilters} openCase={openCase}/>;
  return <Dashboard role={role} openCase={openCase}/>;
}

function Dashboard({role,openCase}){
  if(role==='regulator') return <><Kpi items={[['Active Complaints','184','All open cases'],['Critical Queue','17','High-risk cases','danger'],['SLA Overdue','23','Need escalation','warn'],['Member Assigned','129','With platform/bursa/kliring'],['Bappebti-Owned','31','Direct regulator handling'],['Kritik / Masukan','42','Non-case feedback']]} /><div className="grid2"><Panel title="Regulatory Intelligence"><Bars rows={[['Withdrawal / Dana',62],['Fraud Indication',48],['Account Access',37],['Settlement / Kliring',28]]}/></Panel><Panel title="Critical Queue"><MiniTable rows={seedCases.filter(c=>c.queue==='Critical'||c.severity==='Critical')} onOpen={openCase}/></Panel></div></>;
  if(role==='association') return <><Kpi items={[['Industry Complaints','184','Aggregated view'],['Top Issue','Withdrawal','Public education topic'],['Risk Trend','Medium','No personal data'],['Education Topics','6','Suggested contents']]} /><Reporting role={role} tab="Trend Insight"/></>;
  if(role==='admin') return <><Kpi items={[['Active Users','1,248','All roles'],['Members','82','Platform, bursa, kliring'],['SLA Rules','16','By category/severity'],['Audit Logs','9,442','All system changes']]} /><Reporting role={role} tab="Dashboard"/></>;
  return <><Kpi items={role==='public' ? [['Total Pengaduan','4','Submitted by user'],['In Progress','1','Being handled'],['Action Required','1','Need response','warn'],['Resolved','1','Closed cases']] : [['Assigned Cases',role==='platform'?'18':'32','Current owner only'],['Due Soon','4','Less than 24h','warn'],['Overdue','2','Need escalation','danger'],['Resolved Month','27','Closed cases']]} /><Panel title={role==='public'?'Recent Complaints':'Compact Case Queue'}><MiniTable rows={visibleCases(role).slice(0,4)} onOpen={openCase}/></Panel></>;
}

function Wizard({step,setStep,submit}){
  const review = [['Complaint Title','Penarikan dana belum diterima'],['Platform','PT Bursa Digital Nusantara'],['Category / Sub','Dana / Withdrawal - Withdrawal belum masuk rekening'],['Platform User ID','ANDI-8821'],['Transaction Ref','WD-8839201'],['Incident Date','10 Jun 2026'],['Amount','Rp 27.500.000 (Optional)'],['Urgency','High'],['Expected Resolution','Dana diterima atau bukti settlement resmi'],['Channel','BAPPEBTI PORTAL'],['Evidence','2 files uploaded'],['Routing Preview','Platform → Bursa → Kliring']];
  return <Panel title="Buat Pengaduan Baru" eyebrow="PUBLIC USER SUBMISSION"><div className="steps">{[1,2,3,4].map(n=><span className={step===n?'active':''} key={n}>{n}</span>)}</div>{step===1&&<FormGrid fields={['Nama Pelapor','Email Terdaftar','No. HP','Platform User ID','Domisili','No Identitas / NIK']} />}{step===2&&<FormGrid fields={['Judul Pengaduan','Kategori','Sub-Kategori','Platform / Member','Tanggal Kejadian','Referensi Transaksi','Amount / Nilai Transaksi (Optional)','Urgensi','Ekspektasi Penyelesaian']} />}{step===3&&<><label className="textLabel">Kronologi<textarea defaultValue="Pada tanggal 10 Jun 2026 saya melakukan penarikan dana, namun sampai saat ini dana belum masuk ke rekening." /></label><div className="uploadBox">Upload evidence: bukti transfer, screenshot, email, chat, log transaksi</div></>}{step===4&&<><div className="reviewGrid">{review.map(([a,b])=><div className="mini" key={a}><span>{a}</span><b>{b}</b></div>)}</div><label className="check"><input type="checkbox" defaultChecked/> Saya menyatakan informasi dan bukti yang disampaikan benar.</label></>}<div className="navBtns"><button className="ghost" disabled={step===1} onClick={()=>setStep(step-1)}>Previous</button><button className="primary" onClick={()=>step===4?submit():setStep(step+1)}>{step===4?'Submit Complaint':'Next'}</button></div></Panel>
}

function CaseQueue({title,cases,filters,setFilters,openCase}){ return <Panel title={title}><div className="filters"><input placeholder="Search ticket, title, member" value={filters.q} onChange={e=>setFilters({...filters,q:e.target.value})}/><select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option>All</option><option>In Progress</option><option>Escalated to Bappebti</option><option>Waiting for Kliring</option><option>Resolution Proposed</option></select><select value={filters.severity} onChange={e=>setFilters({...filters,severity:e.target.value})}><option>All</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select><select value={filters.owner} onChange={e=>setFilters({...filters,owner:e.target.value})}><option>All</option><option value="public">Public</option><option value="platform">Platform</option><option value="bursa">Bursa</option><option value="kliring">Kliring</option><option value="regulator">Regulator</option></select><button className="ghost" onClick={()=>setFilters({q:'',status:'All',severity:'All',owner:'All'})}>Reset</button></div><MiniTable rows={cases} onOpen={openCase}/></Panel> }

function CaseDetail({c,onBack,role}){ return <><button className="ghost" onClick={onBack}>← Back</button><section className="detailHead"><div><p className="mono">{c.id}</p><h2>{c.title}</h2><span className="memberTag">{c.platform}</span></div><div><span className={'severity '+c.severity.toLowerCase()}>{c.severity}</span><span className="badge">{c.status}</span></div></section><div className="gridDetail"><Panel title="Case Information"><div className="compactGrid">{[['Platform',c.platform],['Category',c.category],['Sub Category',c.sub],['Platform User ID',c.account],['Transaction Ref',c.ref],['Incident Date',c.incident],['Amount',c.amount],['Channel',c.channel],['Submitted',c.submitted],['Expected Resolution',c.expected]].map(([a,b])=><div className="mini" key={a}><span>{a}</span><b>{b}</b></div>)}</div><div className="risk"><b>Risk Note</b><p>{c.risk}</p></div><h3>Vertical Case Timeline</h3><ul className="timeline">{c.timeline.map((t,i)=><li key={i}><i></i><div><time>{t[0]}</time><b>{t[2]}</b><span>{t[1]}</span><p>{t[3]}</p></div></li>)}</ul></Panel><aside><Panel title="Current Ownership"><div className="owner"><span>Current Owner</span><b>{c.owner}</b><small>{c.ownerType.toUpperCase()} only — not simultaneous</small></div><h3>Routing History</h3>{c.timeline.slice(0,3).map((t,i)=><p className="route" key={i}>{i+1}. {t[1]} — {t[2]}</p>)}<h3>Evidence</h3>{c.evidence.map(e=><p className="doc" key={e}>▣ {e}</p>)}<h3>Actions</h3><button className="ghost full">Request Clarification</button><button className="ghost full">Upload Evidence</button><button className="primary full">{role==='public'?'Accept / Reject Resolution':'Update Case'}</button></Panel></aside></div></> }

function Success({data,onView,onNew}){ return <Panel><div className="success"><div className="bigIcon">✓</div><h2>Pengaduan berhasil dikirim</h2><p>Ticket number telah dibuat dan dapat dipantau melalui dashboard pengguna.</p><div className="ticket"><span>Ticket Number</span><b>{data.id}</b></div><div className="reviewGrid">{[['Status',data.status],['Current Owner',data.owner],['Submitted Time',data.time],['Expected First Response','1 x 24 jam'],['Channel','BAPPEBTI PORTAL'],['Next Step','Validasi dan routing awal']].map(([a,b])=><div className="mini" key={a}><span>{a}</span><b>{b}</b></div>)}</div><div className="centerBtns"><button className="primary" onClick={onView}>View Case Detail</button><button className="ghost" onClick={onNew}>Create Another Complaint</button></div></div></Panel> }
function Notifications(){ return <Panel title="Notifikasi"><MiniTable rows={seedCases.map(c=>({...c,title:`${c.id} — ${c.status}`, category:c.owner, platform:c.actionRequired||'Case updated'}))} onOpen={()=>{}} /></Panel> }
function Profile(){ return <Panel title="Profil Saya"><div className="grid2"><div className="compactGrid"><div className="mini"><span>Nama</span><b>Andi Pratama</b></div><div className="mini"><span>NIK</span><b>3273********0001</b></div><div className="mini"><span>Email</span><b>andi.pratama@email.id</b></div><div className="mini"><span>No. HP</span><b>+62 812 **** 7711</b></div><div className="mini"><span>Domicile</span><b>Jakarta Selatan</b></div><div className="mini"><span>Registered</span><b>01 Jun 2026</b></div></div><div><h3>Security & Preferences</h3><p className="doc">✓ Email notification enabled</p><p className="doc">✓ WhatsApp notification enabled</p><p className="doc">✓ Password last changed 7 days ago</p></div></div></Panel> }
function FeedbackQueue(){ return <Panel title="Kritik / Masukan Queue"><table className="table"><thead><tr><th>ID</th><th>Type</th><th>Topic</th><th>Message</th><th>Status</th></tr></thead><tbody>{feedback.map(f=><tr key={f.id}><td className="mono">{f.id}</td><td>{f.type}</td><td><b>{f.topic}</b><span>{f.source}</span></td><td>{f.text}</td><td><span className="badge">{f.status}</span></td></tr>)}</tbody></table></Panel> }
function Reporting({role,tab}){ return <Panel title={tab}><div className="grid2"><div><h3>Dashboard / Reporting Features</h3><Bars rows={role==='regulator' ? [['SLA Compliance',76],['Member Response',68],['Critical Closed',43],['Public Satisfaction',82]] : [['Complaint Trend',62],['Resolved Cases',75],['Due Soon',35],['Education Need',58]]}/></div><div><h3>Sample Reports</h3>{['Executive Summary Report','SLA Compliance Report','Member Performance Report','Risk & Fraud Pattern Report','Public Feedback Report'].map(r=><p className="doc" key={r}>▣ {r}</p>)}</div></div></Panel> }
function Kpi({items}){ return <section className="kpis">{items.map(([a,b,c,type])=><div className={'kpi '+(type||'')} key={a}><span>{a}</span><b>{b}</b><p>{c}</p></div>)}</section> }
function Panel({title,eyebrow,children}){ return <section className="panel">{eyebrow&&<p className="eyebrow">{eyebrow}</p>}{title&&<h2>{title}</h2>}{children}</section> }
function MiniTable({rows,onOpen}){ return <table className="table"><thead><tr><th>Ticket</th><th>Complaint</th><th>Member</th><th>Status</th><th>Owner</th><th>SLA</th><th></th></tr></thead><tbody>{rows.map(c=><tr key={c.id}><td className="mono">{c.id}</td><td><b>{c.title}</b><span>{c.category}</span></td><td>{c.platform}</td><td><span className="badge">{c.status}</span></td><td>{c.owner}</td><td>{c.sla}</td><td><button className="ghost" onClick={()=>onOpen(c)}>View</button></td></tr>)}</tbody></table> }
function FormGrid({fields}){ return <div className="formGrid">{fields.map(f=><label key={f}>{f}<input defaultValue={sampleValue(f)} /></label>)}</div> }
function Bars({rows}){ return <div className="bars">{rows.map(([n,v])=><div key={n}><span>{n}</span><div><i style={{width:v+'%'}} /></div><b>{v}%</b></div>)}</div> }
function visibleCases(role){ if(role==='public') return seedCases.filter(c=>c.user==='Andi Pratama'); if(role==='platform') return seedCases.filter(c=>c.ownerType==='platform'); if(role==='bursa') return seedCases.filter(c=>c.ownerType==='bursa'||c.severity==='High'||c.severity==='Critical'); if(role==='kliring') return seedCases.filter(c=>c.ownerType==='kliring'||c.category.includes('Settlement')); if(role==='regulator') return seedCases; return seedCases; }
function sampleValue(f){ if(f.includes('Nama')) return 'Andi Pratama'; if(f.includes('Email')) return 'andi.pratama@email.id'; if(f.includes('HP')) return '+62 812 0000 7711'; if(f.includes('Platform User')) return 'ANDI-8821'; if(f.includes('Domisili')) return 'Jakarta Selatan'; if(f.includes('NIK')) return '3273********0001'; if(f.includes('Judul')) return 'Penarikan dana belum diterima'; if(f.includes('Kategori')) return 'Dana / Withdrawal'; if(f.includes('Sub')) return 'Withdrawal belum masuk rekening'; if(f.includes('Platform')) return 'PT Bursa Digital Nusantara'; if(f.includes('Tanggal')) return '10 Jun 2026'; if(f.includes('Referensi')) return 'WD-8839201'; if(f.includes('Amount')) return 'Rp 27.500.000'; if(f.includes('Urgensi')) return 'High'; return 'Dana diterima atau bukti settlement resmi'; }

createRoot(document.getElementById('root')).render(<App />);
