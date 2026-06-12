import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const ROLE_META = {
  public: { label: 'Public User', badge: 'Pelapor', icon: '👤', purpose: 'Submit and monitor personal complaints', tabs: ['Dashboard','Pengaduan Saya','Buat Pengaduan','Notifikasi','Profil'] },
  platform: { label: 'Platform / Pialang', badge: 'Member', icon: '🏢', purpose: 'Handle cases assigned to own platform only', tabs: ['Dashboard','Pengaduan Masuk','Klarifikasi','Resolusi','SLA'] },
  bursa: { label: 'Bursa', badge: 'Member Level 2', icon: '🏛️', purpose: 'Oversight cases from platforms and direct exchange cases', tabs: ['Dashboard','Platform Oversight','Direct Cases','Critical Queue','SLA'] },
  kliring: { label: 'Kliring', badge: 'Member Level 2', icon: '🧾', purpose: 'Settlement, clearing, and fund movement dispute handling', tabs: ['Dashboard','Settlement Cases','Direct Cases','Critical Queue','SLA'] },
  regulator: { label: 'Bappebti Regulator', badge: 'Regulator', icon: '🛡️', purpose: 'Monitor ecosystem, own cases, member assigned cases, and critical queues', tabs: ['Dashboard','All Cases','My Cases','Member Assigned','Critical Queue','Analytics'] },
  association: { label: 'Association', badge: 'Observer', icon: '🤝', purpose: 'Aggregated industry trends and education insight', tabs: ['Dashboard','Trends','Education Insight','Member Overview'] },
  admin: { label: 'Super Admin', badge: 'System Admin', icon: '⚙️', purpose: 'Master data, user role, SLA, workflow settings', tabs: ['Dashboard','User Management','Master Data','SLA Config','Audit Logs'] }
};

const platforms = [
  { name: 'PT Bursa Digital Nusantara', type: 'Platform/Pialang', bursa: 'Bursa Berjangka Jakarta', kliring: 'PT Kliring Berjangka Indonesia' },
  { name: 'PT Crypto Indonesia Berkat', type: 'Pedagang Aset Kripto', bursa: 'PT Bursa Komoditi Nusantara', kliring: 'PT Kliring Komoditi Digital' },
  { name: 'PT Pintu Kemana Saja', type: 'Pedagang Aset Kripto', bursa: 'PT Bursa Komoditi Nusantara', kliring: 'PT Kliring Komoditi Digital' },
  { name: 'PT Indodax Nasional Indonesia', type: 'Pedagang Aset Kripto', bursa: 'PT Bursa Komoditi Nusantara', kliring: 'PT Kliring Komoditi Digital' },
  { name: 'PT Monex Investindo Futures', type: 'Pialang Berjangka', bursa: 'Bursa Berjangka Jakarta', kliring: 'PT Kliring Berjangka Indonesia' },
  { name: 'PT Rifan Financindo Berjangka', type: 'Pialang Berjangka', bursa: 'Bursa Komoditi dan Derivatif Indonesia', kliring: 'PT Indonesia Clearing House' }
];

const seedCases = [
  {
    id:'BPP-2026-000184', title:'Penarikan dana belum diterima', complainant:'Andi Pratama', category:'Dana / Withdrawal', channel:'BAPPEBTI PORTAL', amount:'Rp 27.500.000', amountOptional:true, severity:'High', status:'In Progress', sla:18, queue:'complaint', assignedType:'platform', ownerUnit:'PT Bursa Digital Nusantara', platform:'PT Bursa Digital Nusantara', bursa:'Bursa Berjangka Jakarta', kliring:'PT Kliring Berjangka Indonesia', riskScore:72, submitted:'12 Jun 2026', actionFor:'platform', nextAction:'Platform perlu upload bukti settlement dan log withdrawal.', evidence:['Bukti transfer.pdf','Screenshot status withdrawal.png'], timeline:['Submitted by public user','Validated by system','Routed to Platform','Platform investigation in progress']
  },
  {
    id:'BPP-2026-000185', title:'Transaksi tidak dikenali pada akun', complainant:'Sari Wulandari', category:'Transaksi Tidak Dikenali', channel:'BAPPEBTI PORTAL', amount:'-', amountOptional:true, severity:'Critical', status:'Escalated to Bappebti', sla:-4, queue:'critical', assignedType:'regulator', ownerUnit:'Direktorat Pengawasan PBK', platform:'PT Crypto Indonesia Berkat', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', riskScore:91, submitted:'11 Jun 2026', actionFor:'regulator', nextAction:'Bappebti perlu review indikasi fraud dan pola pengaduan berulang.', evidence:['Log aktivitas akun.xlsx','Email notifikasi transaksi.pdf'], timeline:['Submitted','Verified','Platform response disputed','Escalated to Bappebti']
  },
  {
    id:'BPP-2026-000186', title:'Saldo aset tidak sesuai setelah settlement', complainant:'Michael Tan', category:'Settlement / Kliring', channel:'BAPPEBTI PORTAL', amount:'Rp 8.200.000', amountOptional:true, severity:'Medium', status:'Waiting for Kliring', sla:9, queue:'complaint', assignedType:'kliring', ownerUnit:'PT Kliring Komoditi Digital', platform:'PT Pintu Kemana Saja', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', riskScore:63, submitted:'12 Jun 2026', actionFor:'kliring', nextAction:'Kliring perlu konfirmasi settlement reference dan batch reconciliation.', evidence:['Riwayat transaksi.csv'], timeline:['Submitted','Routed to Platform','Platform confirms settlement dependency','Assigned to Kliring']
  },
  {
    id:'BPP-2026-000187', title:'Platform tidak memberikan respon setelah 3 hari', complainant:'Nur Aisyah', category:'Layanan / Respon', channel:'BAPPEBTI PORTAL', amount:'-', amountOptional:true, severity:'High', status:'Overdue', sla:-12, queue:'critical', assignedType:'bursa', ownerUnit:'Bursa Berjangka Jakarta', platform:'PT Monex Investindo Futures', bursa:'Bursa Berjangka Jakarta', kliring:'PT Kliring Berjangka Indonesia', riskScore:79, submitted:'10 Jun 2026', actionFor:'bursa', nextAction:'Bursa perlu melakukan supervisory follow-up ke platform.', evidence:['Chat customer service.png'], timeline:['Submitted','Routed to Platform','No response within SLA','Escalated to Bursa oversight']
  },
  {
    id:'BPP-2026-000188', title:'Permintaan penutupan akun belum diproses', complainant:'Budi Santoso', category:'Akun / Penutupan Akun', channel:'BAPPEBTI PORTAL', amount:'-', amountOptional:true, severity:'Low', status:'Resolution Proposed', sla:24, queue:'complaint', assignedType:'platform', ownerUnit:'PT Indodax Nasional Indonesia', platform:'PT Indodax Nasional Indonesia', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', riskScore:35, submitted:'12 Jun 2026', actionFor:'public', nextAction:'User perlu menerima atau menolak usulan resolusi.', evidence:['Form penutupan akun.pdf'], timeline:['Submitted','Handled by Platform','Resolution proposed']
  },
  {
    id:'BPP-2026-000189', title:'Dugaan penawaran investasi ilegal oleh oknum', complainant:'Rina Kartika', category:'Dugaan Penipuan / Fraud', channel:'BAPPEBTI PORTAL', amount:'Rp 150.000.000', amountOptional:true, severity:'Critical', status:'Under Regulator Review', sla:4, queue:'critical', assignedType:'regulator', ownerUnit:'Unit Penindakan', platform:'PT Rifan Financindo Berjangka', bursa:'Bursa Komoditi dan Derivatif Indonesia', kliring:'PT Indonesia Clearing House', riskScore:96, submitted:'12 Jun 2026', actionFor:'regulator', nextAction:'Pisahkan pengaduan operasional dan indikasi pelanggaran serius.', evidence:['Bukti transfer.pdf','Percakapan WhatsApp.zip'], timeline:['Submitted','Marked critical','Assigned to Bappebti enforcement queue']
  }
];

const statusOptions = ['All','Submitted','In Progress','Waiting for Kliring','Overdue','Escalated to Bappebti','Resolution Proposed','Under Regulator Review'];
const severityOptions = ['All','Low','Medium','High','Critical'];
const queueOptions = ['All','complaint','critical'];

function App(){
  const [role,setRole] = useState('regulator');
  const [tab,setTab] = useState('Dashboard');
  const [selected,setSelected] = useState(seedCases[0]);
  const [showDetail,setShowDetail] = useState(false);
  const [filters,setFilters] = useState({ search:'', status:'All', severity:'All', queue:'All', member:'All', assigned:'All' });
  const meta = ROLE_META[role];

  const visibleCases = useMemo(()=>seedCases.filter(c=>{
    if(role==='public' && c.complainant !== 'Andi Pratama' && c.id !== 'BPP-2026-000188') return false;
    if(role==='platform' && c.platform !== 'PT Bursa Digital Nusantara') return false;
    if(role==='bursa' && c.bursa !== 'Bursa Berjangka Jakarta') return false;
    if(role==='kliring' && c.kliring !== 'PT Kliring Komoditi Digital') return false;
    if(role==='association') return true;
    return true;
  }),[role]);

  const filtered = useMemo(()=>visibleCases.filter(c=>{
    const q = filters.search.toLowerCase();
    const text = [c.id,c.title,c.complainant,c.category,c.platform,c.bursa,c.kliring,c.ownerUnit,c.status].join(' ').toLowerCase();
    if(q && !text.includes(q)) return false;
    if(filters.status !== 'All' && c.status !== filters.status) return false;
    if(filters.severity !== 'All' && c.severity !== filters.severity) return false;
    if(filters.queue !== 'All' && c.queue !== filters.queue) return false;
    if(filters.member !== 'All' && ![c.platform,c.bursa,c.kliring].includes(filters.member)) return false;
    if(filters.assigned !== 'All' && c.assignedType !== filters.assigned) return false;
    if(tab==='My Cases' && c.assignedType !== 'regulator') return false;
    if(tab==='Member Assigned' && c.assignedType === 'regulator') return false;
    if(tab==='Critical Queue' && c.queue !== 'critical') return false;
    if(tab==='Pengaduan Saya' && role==='public') return true;
    if(tab==='Klarifikasi' && role==='platform' && c.actionFor !== 'platform') return false;
    if(tab==='Settlement Cases' && role==='kliring' && c.category !== 'Settlement / Kliring') return false;
    if(tab==='Direct Cases' && ['bursa','kliring'].includes(role) && c.assignedType !== role) return false;
    if(tab==='Platform Oversight' && role==='bursa' && c.assignedType === 'bursa') return false;
    return true;
  }),[visibleCases,filters,tab,role]);

  function goRole(nextRole){ setRole(nextRole); setTab(ROLE_META[nextRole].tabs[0]); setShowDetail(false); setFilters({ search:'', status:'All', severity:'All', queue:'All', member:'All', assigned:'All' }); }
  function openCase(c){ setSelected(c); setShowDetail(true); }

  return <div className="app">
    <aside className="side">
      <div className="brand"><img src="/assets/bappebti-logo.png"/><div><strong>Layanan Pengaduan</strong><span>Complaint Ecosystem Demo</span></div></div>
      <div className="roleLabel">Role Simulation</div>
      {Object.entries(ROLE_META).map(([key,val])=><button key={key} onClick={()=>goRole(key)} className={role===key?'role active':'role'}><span>{val.icon}</span><div><b>{val.label}</b><small>{val.badge}</small></div></button>)}
      <div className="sideNote"><b>Demo logic</b><br/>Cases move from Public → Platform/Pialang → Bursa/Kliring → Bappebti when high-risk, overdue, disputed, or cross-member.</div>
    </aside>
    <main className="main">
      <header className="topbar">
        <div><div className="eyebrow">{meta.badge}</div><h1>{meta.icon} {meta.label}</h1><p>{meta.purpose}</p></div>
        <div className="topActions"><button className="ghost">Help</button><button className="primary">+ Quick Action</button></div>
      </header>
      <nav className="tabs">{meta.tabs.map(t=><button key={t} onClick={()=>{setTab(t);setShowDetail(false)}} className={tab===t?'active':''}>{t}</button>)}</nav>
      <section className="page fade">
        {showDetail ? <CaseDetail role={role} c={selected} back={()=>setShowDetail(false)} /> : <RolePage role={role} tab={tab} cases={filtered} allCases={visibleCases} filters={filters} setFilters={setFilters} openCase={openCase}/>} 
      </section>
    </main>
  </div>
}

function RolePage({role,tab,cases,allCases,filters,setFilters,openCase}){
  if(role==='public' && tab==='Buat Pengaduan') return <ComplaintWizard />;
  if(role==='public' && tab==='Notifikasi') return <Notifications cases={allCases} openCase={openCase}/>;
  if(role==='public' && tab==='Profil') return <Profile />;
  if(role==='association') return <AssociationPage tab={tab} cases={cases} filters={filters} setFilters={setFilters}/>;
  if(role==='admin') return <AdminPage tab={tab} cases={cases} filters={filters} setFilters={setFilters}/>;
  return <>
    <DashboardCards role={role} cases={allCases}/>
    {tab==='Dashboard' && <RoleInsights role={role} cases={allCases}/>} 
    {tab!=='Dashboard' && <CaseWorkspace role={role} tab={tab} cases={cases} filters={filters} setFilters={setFilters} openCase={openCase}/>} 
  </>
}

function DashboardCards({role,cases}){
  const count = cases.length, critical = cases.filter(c=>c.queue==='critical').length, overdue = cases.filter(c=>c.sla<0).length, action = cases.filter(c=>c.actionFor===role || (role==='regulator' && c.assignedType==='regulator')).length;
  const label = role==='regulator'?'Cases requiring Bappebti': role==='bursa'?'Bursa action': role==='kliring'?'Kliring action': role==='platform'?'Platform action':'Action required';
  return <div className="cards"><Metric title="Visible Cases" value={count} hint="Filtered by role access"/><Metric title="Critical Queue" value={critical} tone="danger" hint="Separate from normal complaints"/><Metric title="SLA Overdue" value={overdue} tone="warn" hint="Needs escalation or follow-up"/><Metric title={label} value={action} tone="blue" hint="Pending responsible party"/></div>
}
function Metric({title,value,hint,tone=''}){return <div className={`metric ${tone}`}><span>{title}</span><b>{value}</b><small>{hint}</small></div>}

function RoleInsights({role,cases}){
  if(role==='public') return <PublicDashboard cases={cases}/>;
  if(role==='platform') return <InsightGrid title="Platform / Pialang operating view" items={['Only own platform cases are visible','Can ask user clarification','Can propose resolution but user must accept/reject','Can escalate complex cases to Bursa/Kliring/Bappebti']}/>
  if(role==='bursa') return <InsightGrid title="Bursa oversight view" items={['Sees platform cases under selected Bursa','Handles direct Bursa-level complaints','Critical queue separated from normal complaints','Can supervise platform SLA and route to regulator']}/>
  if(role==='kliring') return <InsightGrid title="Kliring settlement view" items={['Focus on fund movement, settlement, reconciliation issues','Cases can come directly or via Platform/Bursa','Needs settlement reference, batch, and log validation','Critical queue separated for material or repeated settlement gaps']}/>
  if(role==='regulator') return <RegulatorDashboard cases={cases}/>;
  return null;
}
function InsightGrid({title,items}){return <div className="panel"><h2>{title}</h2><div className="insightGrid">{items.map((it,i)=><div className="insight" key={i}><b>0{i+1}</b><p>{it}</p></div>)}</div></div>}

function PublicDashboard({cases}){return <div className="split"><div className="panel"><h2>Personal Case Control Center</h2><p className="muted">Public user sees complaint ownership, status, responsible party, expected response, and next required action.</p><div className="timelinePreview">{cases.map(c=><div key={c.id}><b>{c.id}</b><span>{c.status}</span><small>{c.nextAction}</small></div>)}</div></div><div className="panel accent"><h2>Why login is required</h2><p>Registration improves report validity, reduces spam/fake complaints, enables case ownership, and creates a transparent history for the user.</p></div></div>}
function RegulatorDashboard({cases}){return <div className="split"><div className="panel"><h2>Bappebti Regulator Overview</h2><div className="stack">{['My Cases: cases owned by Bappebti units','Member Assigned: cases currently handled by Platform/Bursa/Kliring','Critical Queue: high-risk, overdue, fraud, repeated, disputed','Complaint Queue: normal complaint operations separated from critical supervision'].map(x=><div className="rowNote" key={x}>{x}</div>)}</div></div><div className="panel"><h2>Risk Heatmap</h2>{cases.map(c=><div className="heat" key={c.id}><span>{c.platform}</span><b>{c.riskScore}</b><i style={{width:`${c.riskScore}%`}} /></div>)}</div></div>}

function CaseWorkspace({role,tab,cases,filters,setFilters,openCase}){return <div className="workspace"><FilterBar role={role} filters={filters} setFilters={setFilters}/><div className="sectionTitle"><div><h2>{tab}</h2><p>All filters on this page are functional: search, status, severity, queue, member, and assigned owner.</p></div><span>{cases.length} result(s)</span></div><div className="caseGrid">{cases.map(c=><CaseCard key={c.id} c={c} role={role} onClick={()=>openCase(c)}/>)}</div>{cases.length===0 && <div className="empty">No cases match the active filters.</div>}</div>}

function FilterBar({role,filters,setFilters}){
  const members = ['All',...new Set(seedCases.flatMap(c=>[c.platform,c.bursa,c.kliring]))];
  const assign = ['All','platform','bursa','kliring','regulator'];
  const update=(k,v)=>setFilters({...filters,[k]:v});
  return <div className="filters"><input placeholder="Search case, user, member, category..." value={filters.search} onChange={e=>update('search',e.target.value)}/><select value={filters.status} onChange={e=>update('status',e.target.value)}>{statusOptions.map(x=><option key={x}>{x}</option>)}</select><select value={filters.severity} onChange={e=>update('severity',e.target.value)}>{severityOptions.map(x=><option key={x}>{x}</option>)}</select><select value={filters.queue} onChange={e=>update('queue',e.target.value)}>{queueOptions.map(x=><option key={x}>{x}</option>)}</select>{role==='regulator' && <select value={filters.assigned} onChange={e=>update('assigned',e.target.value)}>{assign.map(x=><option key={x}>{x}</option>)}</select>}<select value={filters.member} onChange={e=>update('member',e.target.value)}>{members.map(x=><option key={x}>{x}</option>)}</select><button className="ghost" onClick={()=>setFilters({ search:'', status:'All', severity:'All', queue:'All', member:'All', assigned:'All' })}>Reset</button></div>
}
function CaseCard({c,onClick,role}){return <button className="caseCard" onClick={onClick}><div className="cardTop"><span className="mono">{c.id}</span><Severity s={c.severity}/></div><h3>{c.title}</h3><p>{c.platform}</p><div className="caseMeta"><span>Channel: <b>{c.channel}</b></span><span>Category: <b>{c.category}</b></span><span>Owner: <b>{c.ownerUnit}</b></span><span>SLA: <b className={c.sla<0?'red':''}>{c.sla<0?`${Math.abs(c.sla)} jam overdue`:`${c.sla} jam tersisa`}</b></span></div><div className="statusLine"><Status s={c.status}/><small>{role==='association'?'Anonymized trend detail available':'Open case detail →'}</small></div></button>}
function Severity({s}){return <span className={`sev ${s.toLowerCase()}`}>{s}</span>}
function Status({s}){return <span className="status">{s}</span>}

function CaseDetail({role,c,back}){
  const actions = role==='public' ? ['Upload Evidence','Respond Clarification','Request Escalation','Accept Resolution','Reject Resolution'] : role==='platform' ? ['Request Clarification','Upload Investigation Proof','Propose Resolution','Escalate to Bursa/Kliring'] : role==='bursa' ? ['Supervise Platform','Re-route to Kliring','Escalate to Bappebti','Add Bursa Note'] : role==='kliring' ? ['Upload Settlement Proof','Confirm Reconciliation','Return to Platform','Escalate to Bappebti'] : role==='regulator' ? ['Assign to Unit','Intervene','Issue Regulatory Note','Close / Reopen Case'] : ['View Aggregated Detail'];
  return <div className="detail"><button className="back" onClick={back}>← Back to list</button><div className="detailHero"><div><div className="mono">{c.id}</div><h2>{c.title}</h2><p>{c.platform}</p></div><Severity s={c.severity}/></div><div className="detailCards"><Metric title="Channel of Complaint" value={c.channel} hint="Replaces amount as primary routing field"/><Metric title="Category" value={c.category} hint="Used for routing and SLA"/><Metric title="Assigned Owner" value={c.ownerUnit} hint={`Type: ${c.assignedType}`}/><Metric title="SLA" value={c.sla<0?`${Math.abs(c.sla)}h overdue`:`${c.sla}h left`} tone={c.sla<0?'danger':'blue'} hint="Operational accountability"/></div><div className="split"><div className="panel"><h2>Case Timeline</h2><ol className="timeline">{c.timeline.map((t,i)=><li key={i}><b>{t}</b><span>{i===c.timeline.length-1?'Current stage':'Completed'}</span></li>)}</ol></div><div className="panel"><h2>Responsibility Chain</h2><div className="chain"><div>Public User<br/><b>{c.complainant}</b></div><span>→</span><div>Platform<br/><b>{c.platform}</b></div><span>→</span><div>Bursa<br/><b>{c.bursa}</b></div><span>→</span><div>Kliring<br/><b>{c.kliring}</b></div><span>→</span><div>Bappebti<br/><b>{c.ownerUnit}</b></div></div></div></div><div className="split"><div className="panel"><h2>Evidence & Documents</h2>{c.evidence.map(e=><div className="doc" key={e}>📎 {e}</div>)}<div className="doc subtle">+ Add document / evidence</div></div><div className="panel"><h2>Available Actions</h2><div className="actionGrid">{actions.map(a=><button key={a} className="actionBtn">{a}</button>)}</div><p className="muted">Demo buttons are UI-ready placeholders. They show the intended workflow action per role.</p></div></div><div className="panel note"><h2>Next Action</h2><p>{c.nextAction}</p></div></div>
}

function ComplaintWizard(){
  const [step,setStep]=useState(1); const [form,setForm]=useState({ platform:'', category:'Dana / Withdrawal', amount:'', title:'' });
  return <div className="wizard"><div className="wizardHead"><div><h2>Buat Pengaduan Baru</h2><p>Amount is optional. The main routing field is Channel of Complaint: <b>BAPPEBTI PORTAL</b>.</p></div><div className="steps">{[1,2,3,4,5].map(n=><span className={step>=n?'done':''} key={n}>{n}</span>)}</div></div>{step===1&&<WizardPanel title="1. Select Platform / Member"><select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}><option value="">Pilih platform / pialang / pedagang aset kripto</option>{platforms.map(p=><option key={p.name}>{p.name}</option>)}</select><p className="muted">In production this list should come from Bappebti master data, including platform, bursa, and kliring relationship.</p></WizardPanel>}{step===2&&<WizardPanel title="2. Complaint Category"><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['Dana / Withdrawal','Transaksi Tidak Dikenali','Settlement / Kliring','Dugaan Penipuan / Fraud','Akun / Penutupan Akun','Layanan / Respon','Lainnya'].map(x=><option key={x}>{x}</option>)}</select><input placeholder="Judul pengaduan" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></WizardPanel>}{step===3&&<WizardPanel title="3. Complaint Detail"><textarea placeholder="Tuliskan kronologi secara singkat dan jelas..."/><input placeholder="Nominal terkait, optional. Contoh: Rp 10.000.000" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></WizardPanel>}{step===4&&<WizardPanel title="4. Upload Evidence"><div className="upload">Drag & drop evidence here<br/><small>Screenshot, mutasi, email, chat, transaction log</small></div></WizardPanel>}{step===5&&<WizardPanel title="5. Review & Submit"><div className="review"><b>Channel of Complaint</b><span>BAPPEBTI PORTAL</span><b>Platform</b><span>{form.platform||'Not selected'}</span><b>Category</b><span>{form.category}</span><b>Amount</b><span>{form.amount||'Not provided / optional'}</span></div><button className="primary wide">Submit Complaint</button></WizardPanel>}<div className="wizardNav"><button className="ghost" disabled={step===1} onClick={()=>setStep(step-1)}>Previous</button><button className="primary" disabled={step===5} onClick={()=>setStep(step+1)}>Next</button></div></div>
}
function WizardPanel({title,children}){return <div className="panel wizardPanel"><h3>{title}</h3>{children}</div>}
function Notifications({cases,openCase}){return <div className="panel"><h2>Notifications</h2>{cases.map(c=><button className="notif" onClick={()=>openCase(c)} key={c.id}><b>{c.status}</b><span>{c.id} — {c.nextAction}</span></button>)}</div>}
function Profile(){return <div className="panel"><h2>Profil Akun</h2><div className="profile"><div><b>Andi Pratama</b><span>andi.pratama@email.com</span></div><div><b>Verified Contact</b><span>Email and phone verified for official case ownership.</span></div></div></div>}

function AssociationPage({tab,cases,filters,setFilters}){return <><DashboardCards role="association" cases={cases}/><FilterBar role="association" filters={filters} setFilters={setFilters}/><div className="panel"><h2>{tab}</h2><p className="muted">Association portal shows aggregated and anonymized ecosystem insights, not sensitive personal case detail.</p><div className="insightGrid"><div className="insight"><b>Top Complaint</b><p>Dana / Withdrawal</p></div><div className="insight"><b>Education Need</b><p>Withdrawal SLA, fraud prevention, account security</p></div><div className="insight"><b>Industry Signal</b><p>Repeated delays on settlement-related cases</p></div></div><div className="caseGrid">{cases.map(c=><div className="caseCard" key={c.id}><div className="cardTop"><span>{c.category}</span><Severity s={c.severity}/></div><h3>{maskName(c.platform)}</h3><p>Risk Score {c.riskScore} • {c.status}</p></div>)}</div></div></>}
function maskName(name){return name.replace(/PT |Indonesia|Nusantara|Berjangka|Digital/g,'***')}
function AdminPage({tab,cases,filters,setFilters}){return <><DashboardCards role="admin" cases={cases}/><FilterBar role="admin" filters={filters} setFilters={setFilters}/><div className="panel"><h2>{tab}</h2><div className="adminGrid"><div><b>Role Matrix</b><p>Public, Platform, Bursa, Kliring, Regulator, Association, Super Admin.</p></div><div><b>Master Member Relationship</b><p>Platform mapped to Bursa and Kliring for auto-routing.</p></div><div><b>SLA Configuration</b><p>Different SLA by severity, category, and owner type.</p></div><div><b>Audit Logs</b><p>Every status change, upload, decision, escalation, and close/reopen is logged.</p></div></div></div></>}

createRoot(document.getElementById('root')).render(<App />);
