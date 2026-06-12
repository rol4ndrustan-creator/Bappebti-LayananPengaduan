import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const ROLE_META = {
  public: {
    label: 'Public User', badge: 'Pelapor', unit: 'Portal Publik',
    focus: 'Pengajuan, monitoring, klarifikasi, upload bukti, eskalasi, dan konfirmasi resolusi.',
    tabs: ['Dashboard','Pengaduan Saya','Buat Pengaduan','Notifikasi','Profil']
  },
  platform: {
    label: 'Platform / Pialang', badge: 'Member Operasional', unit: 'PT Bursa Digital Nusantara',
    focus: 'Menangani pengaduan yang masuk ke platform, memberi klarifikasi, dan mengusulkan resolusi.',
    tabs: ['Dashboard','Pengaduan Masuk','Butuh Klarifikasi','Resolusi','SLA']
  },
  bursa: {
    label: 'Bursa', badge: 'Member Level Atas', unit: 'Bursa Berjangka Jakarta',
    focus: 'Oversight terhadap platform/pialang, direct cases bursa, dan queue kritis yang naik level.',
    tabs: ['Dashboard','Platform Oversight','Direct Cases','Critical Queue','SLA']
  },
  kliring: {
    label: 'Kliring', badge: 'Member Level Atas', unit: 'PT Kliring Komoditi Digital',
    focus: 'Menangani isu settlement, rekonsiliasi, clearing reference, dan dispute pergerakan dana/aset.',
    tabs: ['Dashboard','Settlement Cases','Direct Cases','Critical Queue','SLA']
  },
  regulator: {
    label: 'Bappebti / Regulator', badge: 'Regulator', unit: 'Direktorat Pengawasan & Pengaduan',
    focus: 'Melihat seluruh ekosistem, kasus Bappebti sendiri, kasus assigned ke member, critical queue, dan analytics.',
    tabs: ['Dashboard','All Cases','My Cases','Member Assigned','Critical Queue','Analytics']
  },
  association: {
    label: 'Association', badge: 'Observer', unit: 'Asosiasi Ekosistem',
    focus: 'Melihat tren agregat, insight edukasi, dan overview industri tanpa membuka data pribadi sensitif.',
    tabs: ['Dashboard','Trends','Education Insight','Member Overview']
  },
  admin: {
    label: 'Super Admin', badge: 'System Admin', unit: 'System Management',
    focus: 'Mengelola user, role, master data member, SLA, workflow, dan audit log.',
    tabs: ['Dashboard','User Management','Master Data','SLA Config','Audit Logs']
  }
};

const roleOrder = ['public','platform','bursa','kliring','regulator','association','admin'];

const members = [
  { name:'PT Bursa Digital Nusantara', type:'Platform/Pialang', bursa:'Bursa Berjangka Jakarta', kliring:'PT Kliring Berjangka Indonesia', license:'PLT-001/BPP/2026' },
  { name:'PT Crypto Indonesia Berkat', type:'Pedagang Aset Kripto', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', license:'PFK-002/BPP/2026' },
  { name:'PT Pintu Kemana Saja', type:'Pedagang Aset Kripto', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', license:'PFK-003/BPP/2026' },
  { name:'PT Indodax Nasional Indonesia', type:'Pedagang Aset Kripto', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', license:'PFK-004/BPP/2026' },
  { name:'PT Monex Investindo Futures', type:'Pialang Berjangka', bursa:'Bursa Berjangka Jakarta', kliring:'PT Kliring Berjangka Indonesia', license:'PBK-011/BPP/2026' },
  { name:'PT Rifan Financindo Berjangka', type:'Pialang Berjangka', bursa:'Bursa Komoditi dan Derivatif Indonesia', kliring:'PT Indonesia Clearing House', license:'PBK-020/BPP/2026' }
];

const cases = [
  { id:'BPP-2026-000184', title:'Penarikan dana belum diterima', complainant:'Andi Pratama', nik:'3273********0001', contact:'andi.pratama@email.id', category:'Dana / Withdrawal', channel:'BAPPEBTI PORTAL', submitted:'12 Jun 2026 09:18', incidentDate:'10 Jun 2026', trxRef:'WD-8839201', platformUserId:'ANDI-8821', amount:'Rp 27.500.000', amountFilled:true, severity:'High', status:'In Progress', sla:18, queue:'complaint', ownerType:'platform', owner:'PT Bursa Digital Nusantara', platform:'PT Bursa Digital Nusantara', bursa:'Bursa Berjangka Jakarta', kliring:'PT Kliring Berjangka Indonesia', riskScore:72, actionFor:'platform', nextAction:'Platform perlu upload bukti settlement dan log withdrawal.', expected:'Dana diterima atau penjelasan resmi dengan bukti settlement.', note:'Nilai transaksi material. Perlu bukti settlement, withdrawal log, dan audit trail approval.', evidence:['Bukti transfer.pdf','Screenshot status withdrawal.png'], timeline:['Submitted by public user','System completeness check passed','Routed to platform','Platform investigation in progress'] },
  { id:'BPP-2026-000185', title:'Transaksi tidak dikenali pada akun', complainant:'Sari Wulandari', nik:'3174********0211', contact:'sari.w@email.id', category:'Transaksi Tidak Dikenali', channel:'BAPPEBTI PORTAL', submitted:'11 Jun 2026 16:45', incidentDate:'11 Jun 2026', trxRef:'TRX-22190888', platformUserId:'SARI-7712', amount:'Optional - not filled', amountFilled:false, severity:'Critical', status:'Escalated to Bappebti', sla:-4, queue:'critical', ownerType:'regulator', owner:'Direktorat Pengawasan PBK', platform:'PT Crypto Indonesia Berkat', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', riskScore:91, actionFor:'regulator', nextAction:'Bappebti perlu review indikasi fraud dan pola pengaduan berulang.', expected:'Investigasi resmi atas transaksi tidak dikenali.', note:'Indikasi risiko fraud. Perlu pisahkan case operasional dan potensi pelanggaran.', evidence:['Log aktivitas akun.xlsx','Email notifikasi transaksi.pdf'], timeline:['Submitted','Verified','Platform response disputed','Escalated to Bappebti'] },
  { id:'BPP-2026-000186', title:'Saldo aset tidak sesuai setelah settlement', complainant:'Michael Tan', nik:'3171********8802', contact:'michael.t@email.id', category:'Settlement / Kliring', channel:'BAPPEBTI PORTAL', submitted:'12 Jun 2026 10:22', incidentDate:'12 Jun 2026', trxRef:'SETTLE-66201', platformUserId:'MIKE-2020', amount:'Rp 8.200.000', amountFilled:true, severity:'Medium', status:'Waiting for Kliring', sla:9, queue:'complaint', ownerType:'kliring', owner:'PT Kliring Komoditi Digital', platform:'PT Pintu Kemana Saja', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', riskScore:63, actionFor:'kliring', nextAction:'Kliring perlu konfirmasi settlement reference dan batch reconciliation.', expected:'Koreksi saldo aset sesuai hasil settlement.', note:'Case harus diproses di level kliring karena terkait batch settlement dan rekonsiliasi.', evidence:['Riwayat transaksi.csv'], timeline:['Submitted','Routed to platform','Platform confirms settlement dependency','Assigned to Kliring'] },
  { id:'BPP-2026-000187', title:'Platform tidak memberikan respon setelah 3 hari', complainant:'Nur Aisyah', nik:'7371********0199', contact:'nur.aisyah@email.id', category:'Layanan / Respon', channel:'BAPPEBTI PORTAL', submitted:'10 Jun 2026 13:10', incidentDate:'07 Jun 2026', trxRef:'CS-091122', platformUserId:'NUR-1900', amount:'Optional - not filled', amountFilled:false, severity:'High', status:'Overdue', sla:-12, queue:'critical', ownerType:'bursa', owner:'Bursa Berjangka Jakarta', platform:'PT Monex Investindo Futures', bursa:'Bursa Berjangka Jakarta', kliring:'PT Kliring Berjangka Indonesia', riskScore:79, actionFor:'bursa', nextAction:'Bursa perlu supervisory follow-up ke platform.', expected:'Platform memberikan jawaban resmi dan rencana penyelesaian.', note:'SLA terlewat. Queue berbeda dari complaint normal karena membutuhkan supervisi bursa.', evidence:['Chat customer service.png'], timeline:['Submitted','Routed to Platform','No response within SLA','Escalated to Bursa oversight'] },
  { id:'BPP-2026-000188', title:'Permintaan penutupan akun belum diproses', complainant:'Andi Pratama', nik:'3273********0001', contact:'andi.pratama@email.id', category:'Akun / Penutupan Akun', channel:'BAPPEBTI PORTAL', submitted:'12 Jun 2026 11:05', incidentDate:'09 Jun 2026', trxRef:'ACC-CLOSE-1198', platformUserId:'ANDI-8821', amount:'Optional - not filled', amountFilled:false, severity:'Low', status:'Resolution Proposed', sla:24, queue:'complaint', ownerType:'platform', owner:'PT Indodax Nasional Indonesia', platform:'PT Indodax Nasional Indonesia', bursa:'PT Bursa Komoditi Nusantara', kliring:'PT Kliring Komoditi Digital', riskScore:35, actionFor:'public', nextAction:'User perlu menerima atau menolak usulan resolusi.', expected:'Akun ditutup dan data diproses sesuai ketentuan.', note:'Amount tidak relevan sehingga tidak perlu dipaksa diisi.', evidence:['Form penutupan akun.pdf'], timeline:['Submitted','Handled by Platform','Resolution proposed'] },
  { id:'BPP-2026-000189', title:'Dugaan penawaran investasi ilegal oleh oknum', complainant:'Rina Kartika', nik:'3175********7891', contact:'rina.k@email.id', category:'Dugaan Penipuan / Fraud', channel:'BAPPEBTI PORTAL', submitted:'12 Jun 2026 14:40', incidentDate:'01 Jun 2026', trxRef:'BANK-TRF-650881', platformUserId:'RINA-3321', amount:'Rp 150.000.000', amountFilled:true, severity:'Critical', status:'Under Regulator Review', sla:4, queue:'critical', ownerType:'regulator', owner:'Unit Penindakan', platform:'PT Rifan Financindo Berjangka', bursa:'Bursa Komoditi dan Derivatif Indonesia', kliring:'PT Indonesia Clearing House', riskScore:96, actionFor:'regulator', nextAction:'Pisahkan pengaduan operasional dan indikasi pelanggaran serius.', expected:'Tindak lanjut regulator atas dugaan pelanggaran.', note:'Critical queue berbeda dari complaint biasa. Perlu penanganan penindakan dan monitoring pola.', evidence:['Bukti transfer.pdf','Percakapan WhatsApp.zip'], timeline:['Submitted','Marked critical','Assigned to Bappebti enforcement queue'] }
];

const categories = ['Dana / Withdrawal','Deposit belum masuk','Transaksi Tidak Dikenali','Settlement / Kliring','Layanan / Respon','Akun / Penutupan Akun','Dugaan Penipuan / Fraud','Perbedaan saldo/aset','Lainnya'];
const severityOptions = ['All','Low','Medium','High','Critical'];
const statusOptions = ['All','Submitted','In Progress','Waiting for Kliring','Overdue','Escalated to Bappebti','Resolution Proposed','Under Regulator Review'];
const queueOptions = ['All','complaint','critical'];
const ownerTypes = ['All','platform','bursa','kliring','regulator'];

function App(){
  const [role,setRole] = useState('regulator');
  const [tab,setTab] = useState(ROLE_META.regulator.tabs[0]);
  const [selected,setSelected] = useState(cases[0]);
  const [detail,setDetail] = useState(false);
  const [filters,setFilters] = useState({search:'',status:'All',severity:'All',queue:'All',member:'All',ownerType:'All'});
  const [wizard,setWizard] = useState(1);
  const meta = ROLE_META[role];

  const visible = useMemo(()=>cases.filter(c=>{
    if(role==='public') return c.complainant==='Andi Pratama';
    if(role==='platform') return c.platform==='PT Bursa Digital Nusantara';
    if(role==='bursa') return c.bursa==='Bursa Berjangka Jakarta';
    if(role==='kliring') return c.kliring==='PT Kliring Komoditi Digital';
    return true;
  }),[role]);

  const filtered = useMemo(()=>visible.filter(c=>{
    const q=filters.search.toLowerCase();
    const hay=[c.id,c.title,c.complainant,c.category,c.owner,c.platform,c.bursa,c.kliring,c.status,c.trxRef].join(' ').toLowerCase();
    if(q&&!hay.includes(q)) return false;
    if(filters.status!=='All'&&c.status!==filters.status) return false;
    if(filters.severity!=='All'&&c.severity!==filters.severity) return false;
    if(filters.queue!=='All'&&c.queue!==filters.queue) return false;
    if(filters.member!=='All'&&![c.platform,c.bursa,c.kliring,c.owner].includes(filters.member)) return false;
    if(filters.ownerType!=='All'&&c.ownerType!==filters.ownerType) return false;
    if(tab==='My Cases'&&c.ownerType!=='regulator') return false;
    if(tab==='Member Assigned'&&c.ownerType==='regulator') return false;
    if(tab==='Critical Queue'&&c.queue!=='critical') return false;
    if(tab==='Butuh Klarifikasi'&&c.actionFor!=='platform') return false;
    if(tab==='Settlement Cases'&&c.category!=='Settlement / Kliring') return false;
    if(tab==='Direct Cases'&&c.ownerType!==role) return false;
    if(tab==='Platform Oversight'&&c.ownerType==='bursa') return false;
    return true;
  }),[visible,filters,tab,role]);

  function changeRole(next){ setRole(next); setTab(ROLE_META[next].tabs[0]); setDetail(false); setFilters({search:'',status:'All',severity:'All',queue:'All',member:'All',ownerType:'All'}); }
  function openCase(c){ setSelected(c); setDetail(true); }
  function changeTab(t){ setTab(t); setDetail(false); }

  return <div className="shell">
    <Header meta={meta} role={role} changeRole={changeRole} tab={tab} changeTab={changeTab} />
    <main className="content fade" key={role+tab+(detail?'detail':'list')}>
      {detail ? <CaseDetail c={selected} role={role} onBack={()=>setDetail(false)} /> : renderPage()}
    </main>
  </div>;

  function renderPage(){
    if(role==='public' && tab==='Buat Pengaduan') return <ComplaintWizard wizard={wizard} setWizard={setWizard} />;
    if(role==='public' && tab==='Notifikasi') return <Notifications openCase={openCase}/>;
    if(role==='public' && tab==='Profil') return <Profile />;
    if(role==='association') return <AssociationPage tab={tab} />;
    if(role==='admin') return <AdminPage tab={tab} />;
    if(tab==='Analytics') return <Analytics />;
    if(tab==='SLA') return <SlaPage data={filtered} />;
    return <><Dashboard role={role} meta={meta} data={visible} filtered={filtered} openCase={openCase}/>{tab!=='Dashboard' && <CaseWorkspace title={tab} data={filtered} filters={filters} setFilters={setFilters} openCase={openCase}/>}</>;
  }
}

function Header({meta,role,changeRole,tab,changeTab}){
  return <header className="header">
    <div className="brandRow">
      <div className="brandMark"><img src="/assets/bappebti-logo.png" /></div>
      <div>
        <div className="kicker">Layanan Pengaduan Bappebti</div>
        <h1>{meta.label}</h1>
        <p>{meta.focus}</p>
      </div>
      <div className="headerRight">
        <label className="selectLabel">Role Preview</label>
        <select value={role} onChange={e=>changeRole(e.target.value)} className="roleSelect">
          {roleOrder.map(r=><option key={r} value={r}>{ROLE_META[r].label}</option>)}
        </select>
        <div className="unitPill"><b>{meta.badge}</b><span>{meta.unit}</span></div>
      </div>
    </div>
    <div className="navLine">
      <div className="systemNote">Channel of Complaint: <b>BAPPEBTI PORTAL</b></div>
      <nav className="topTabs">{meta.tabs.map(t=><button key={t} className={tab===t?'active':''} onClick={()=>changeTab(t)}>{t}</button>)}</nav>
    </div>
  </header>
}

function Dashboard({role,meta,data,filtered,openCase}){
  const total=data.length, critical=data.filter(c=>c.queue==='critical').length, overdue=data.filter(c=>c.sla<0).length, waiting=data.filter(c=>c.actionFor===role || (role==='public'&&c.actionFor==='public')).length;
  return <section>
    <div className="metricGrid">
      <Metric label="Total cases in view" value={total} note="Sesuai akses role saat ini" />
      <Metric label="Critical queue" value={critical} note="Dipisah dari complaint normal" tone="danger" />
      <Metric label="Overdue SLA" value={overdue} note="Butuh perhatian segera" tone="warn" />
      <Metric label="Action required" value={waiting} note="Menunggu aksi role ini" tone="blue" />
    </div>
    <div className="overviewGrid">
      <div className="panel heroPanel">
        <div className="kicker">Role Operating Model</div>
        <h2>{meta.unit}</h2>
        <p>{role==='regulator'?'Regulator dapat melihat semua kasus, memisahkan kasus milik Bappebti, kasus yang masih assigned ke member, dan critical queue.':role==='platform'?'Platform hanya melihat kasus yang ditugaskan kepada platform sendiri dan tidak dapat melihat seluruh ekosistem.':role==='bursa'?'Bursa menjadi satu level di atas platform untuk oversight, direct cases, dan supervisi platform yang overdue/kritis.':role==='kliring'?'Kliring dipisahkan karena isu settlement/clearing membutuhkan bukti dan workflow yang berbeda dari platform.':role==='public'?'Public user memiliki personal dashboard untuk semua pengaduan miliknya, status, bukti tambahan, dan resolusi.':'Association hanya melihat insight agregat untuk edukasi dan perbaikan ekosistem.'}</p>
        <div className="processChain"><span>Public User</span><i/> <span>Platform/Pialang</span><i/> <span>Bursa / Kliring</span><i/> <span>Bappebti</span></div>
      </div>
      <div className="panel slimPanel">
        <h3>Queue Separation</h3>
        <QueueRow label="Normal Complaint" value={data.filter(c=>c.queue==='complaint').length}/>
        <QueueRow label="Critical / Fraud / Overdue" value={critical}/>
        <QueueRow label="Bappebti-owned" value={data.filter(c=>c.ownerType==='regulator').length}/>
        <QueueRow label="Member-assigned" value={data.filter(c=>c.ownerType!=='regulator').length}/>
      </div>
    </div>
    <CaseWorkspace title="Recent Cases" data={filtered.slice(0,4)} filters={{search:'',status:'All',severity:'All',queue:'All',member:'All',ownerType:'All'}} setFilters={()=>{}} openCase={openCase} compact />
  </section>
}
function Metric({label,value,note,tone=''}){return <div className={'metric '+tone}><span>{label}</span><b>{value}</b><small>{note}</small></div>}
function QueueRow({label,value}){return <div className="queueRow"><span>{label}</span><b>{value}</b></div>}

function CaseWorkspace({title,data,filters,setFilters,openCase,compact=false}){
  const memberNames=['All',...new Set(members.flatMap(m=>[m.name,m.bursa,m.kliring]))];
  return <section className="workspace">
    <div className="sectionHead"><div><h2>{title}</h2><p>{compact?'Snapshot kasus terbaru.':'Filter bekerja di halaman ini untuk status, severity, queue, owner, dan member terkait.'}</p></div><span>{data.length} cases</span></div>
    {!compact && <div className="filters">
      <input placeholder="Search case ID, customer, member, transaction ref..." value={filters.search} onChange={e=>setFilters({...filters,search:e.target.value})}/>
      <select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}>{statusOptions.map(x=><option key={x}>{x}</option>)}</select>
      <select value={filters.severity} onChange={e=>setFilters({...filters,severity:e.target.value})}>{severityOptions.map(x=><option key={x}>{x}</option>)}</select>
      <select value={filters.queue} onChange={e=>setFilters({...filters,queue:e.target.value})}>{queueOptions.map(x=><option key={x}>{x}</option>)}</select>
      <select value={filters.ownerType} onChange={e=>setFilters({...filters,ownerType:e.target.value})}>{ownerTypes.map(x=><option key={x}>{x}</option>)}</select>
      <select value={filters.member} onChange={e=>setFilters({...filters,member:e.target.value})}>{memberNames.map(x=><option key={x}>{x}</option>)}</select>
    </div>}
    <div className="caseList">{data.map(c=><CaseCard key={c.id} c={c} openCase={openCase}/>)}</div>
    {data.length===0 && <div className="empty">No case found based on the selected filter.</div>}
  </section>
}
function CaseCard({c,openCase}){return <button className="caseCard" onClick={()=>openCase(c)}>
  <div className="cardTop"><span className="mono">{c.id}</span><Severity s={c.severity}/></div>
  <h3>{c.title}</h3>
  <div className="memberName">{c.platform}</div>
  <div className="caseFields">
    <Field label="Customer" value={c.complainant}/><Field label="Category" value={c.category}/><Field label="Channel" value={c.channel}/><Field label="SLA" value={c.sla<0?`${Math.abs(c.sla)} jam overdue`:`${c.sla} jam tersisa`} danger={c.sla<0}/>
  </div>
  <div className="riskBox"><b>Risk Note</b><p>{c.note}</p></div>
  <div className="statusRow"><span>{c.status}</span><b>Owner: {c.owner}</b></div>
</button>}
function Field({label,value,danger}){return <div className="miniField"><span>{label}</span><b className={danger?'dangerText':''}>{value}</b></div>}
function Severity({s}){return <span className={'severity '+s.toLowerCase()}>{s}</span>}

function CaseDetail({c,role,onBack}){return <section className="detail">
  <button className="backBtn" onClick={onBack}>← Back to list</button>
  <div className="detailHero">
    <div><span className="mono">{c.id}</span><h2>{c.title}</h2><p>{c.platform}</p></div>
    <Severity s={c.severity}/>
  </div>
  <div className="detailGrid">
    <div className="panel large">
      <h3>Case Information</h3>
      <div className="infoGrid">
        <Field label="Complainant" value={c.complainant}/><Field label="Masked NIK" value={c.nik}/><Field label="Contact" value={c.contact}/><Field label="Category" value={c.category}/>
        <Field label="Channel" value={c.channel}/><Field label="Submitted" value={c.submitted}/><Field label="Incident Date" value={c.incidentDate}/><Field label="Transaction Ref" value={c.trxRef}/>
        <Field label="Platform User ID" value={c.platformUserId}/><Field label="Amount" value={c.amount}/><Field label="Status" value={c.status}/><Field label="SLA" value={c.sla<0?`${Math.abs(c.sla)} jam overdue`:`${c.sla} jam tersisa`} danger={c.sla<0}/>
      </div>
      <div className="riskBox detailRisk"><b>Risk Note</b><p>{c.note}</p></div>
      <h3>Current Required Action</h3><p className="bodyText">{c.nextAction}</p>
      <h3>Expected Resolution</h3><p className="bodyText">{c.expected}</p>
    </div>
    <div className="panel">
      <h3>Assignment Chain</h3>
      <div className="chain"><b>Platform / Pialang</b><span>{c.platform}</span><i/> <b>Bursa</b><span>{c.bursa}</span><i/> <b>Kliring</b><span>{c.kliring}</span><i/> <b>Current Owner</b><span>{c.owner}</span></div>
      <h3>Documents</h3>{c.evidence.map(e=><div className="doc" key={e}>{e}</div>)}<div className="doc add">+ Upload additional evidence</div>
      <h3>Actions</h3><div className="actionGrid"><button>Request Clarification</button><button>Upload Evidence</button><button>Propose Resolution</button><button>{role==='public'?'Accept / Reject':'Escalate / Re-route'}</button></div>
    </div>
  </div>
  <div className="panel"><h3>Case Timeline</h3><ol className="timeline">{c.timeline.map((t,i)=><li key={t}><b>{t}</b><span>{i===0?c.submitted:'System event'}</span></li>)}</ol></div>
</section>}

function ComplaintWizard({wizard,setWizard}){const sample=members[0];return <section className="panel wizard">
  <div className="wizardTop"><div><div className="kicker">Public Complaint Submission</div><h2>Buat Pengaduan Baru</h2><p>Amount bersifat optional. Field lebih lengkap agar complaint valid dan mudah dirouting.</p></div><div className="steps">{[1,2,3,4,5].map(n=><span className={wizard>=n?'active':''} key={n}>{n}</span>)}</div></div>
  {wizard===1&&<FormBlock title="1. Identity & Contact"><div className="formGrid"><Input label="Nama Pelapor" value="Andi Pratama"/><Input label="NIK / Passport" value="3273********0001"/><Input label="Email" value="andi.pratama@email.id"/><Input label="No. HP / WhatsApp" value="+62 812-0000-1188"/><Input label="Preferred Contact" value="Email + In-app Notification"/><Input label="Domisili" value="Jakarta Selatan"/></div></FormBlock>}
  {wizard===2&&<FormBlock title="2. Complaint Classification"><div className="formGrid"><Select label="Kategori Pengaduan" options={categories}/><Select label="Platform / Pialang Terkait" options={members.map(m=>m.name)}/><Input label="Bursa Terkait" value={sample.bursa}/><Input label="Kliring Terkait" value={sample.kliring}/><Input label="Channel of Complaint" value="BAPPEBTI PORTAL"/><Select label="Urgency" options={['Normal','High','Critical - fraud indication']}/></div></FormBlock>}
  {wizard===3&&<FormBlock title="3. Transaction / Account Detail"><div className="formGrid"><Input label="Platform User ID" value="ANDI-8821"/><Input label="Transaction / Withdrawal Ref" value="WD-8839201"/><Input label="Tanggal Kejadian" value="10 Jun 2026"/><Input label="Amount (Optional)" value="Rp 27.500.000"/><Input label="Produk / Aset / Kontrak" value="Withdrawal IDR"/><Input label="Status di Platform" value="Withdrawal diproses, dana belum diterima"/></div></FormBlock>}
  {wizard===4&&<FormBlock title="4. Chronology & Evidence"><textarea defaultValue="Pada tanggal 10 Jun 2026 saya mengajukan withdrawal. Status di platform sudah berhasil, namun dana belum diterima di rekening. Saya sudah menghubungi customer service tetapi belum mendapatkan bukti settlement."/><div className="uploadBox">Drag & drop evidence: screenshot, email, chat, transaction proof, statement, log export</div></FormBlock>}
  {wizard===5&&<FormBlock title="5. Review & Submit"><div className="reviewGrid"><Field label="Category" value="Dana / Withdrawal"/><Field label="Platform" value="PT Bursa Digital Nusantara"/><Field label="Amount" value="Optional, filled by user"/><Field label="Routing" value="Platform first, Bappebti monitors"/><Field label="SLA" value="2 x 24 jam initial response"/><Field label="Case Number" value="Generated after submit"/></div><label className="check"><input type="checkbox" defaultChecked/> Data yang saya berikan benar dan dapat diverifikasi.</label></FormBlock>}
  <div className="wizardNav"><button onClick={()=>setWizard(Math.max(1,wizard-1))} disabled={wizard===1}>Back</button><button onClick={()=>setWizard(Math.min(5,wizard+1))}>{wizard===5?'Submit Demo':'Continue'}</button></div>
</section>}
function FormBlock({title,children}){return <div className="formBlock"><h3>{title}</h3>{children}</div>}
function Input({label,value}){return <label className="inputGroup"><span>{label}</span><input defaultValue={value}/></label>}
function Select({label,options}){return <label className="inputGroup"><span>{label}</span><select>{options.map(o=><option key={o}>{o}</option>)}</select></label>}

function Notifications({openCase}){return <section className="panel"><h2>Notifikasi</h2>{cases.filter(c=>c.complainant==='Andi Pratama').map(c=><button className="notif" onClick={()=>openCase(c)} key={c.id}><b>{c.id} — {c.status}</b><span>{c.nextAction}</span></button>)}</section>}
function Profile(){return <section className="panel"><h2>Profil Akun</h2><div className="reviewGrid"><Field label="Nama" value="Andi Pratama"/><Field label="Email" value="andi.pratama@email.id"/><Field label="Phone" value="+62 812-0000-1188"/><Field label="Verified" value="Email verified, identity pending"/></div></section>}
function Analytics(){return <section className="panel"><h2>Regulatory Analytics</h2><div className="insightGrid"><Insight n="38%" t="Withdrawal-related complaints"/><Insight n="4" t="Members with repeated SLA breach"/><Insight n="2" t="Fraud clusters requiring review"/><Insight n="91" t="Highest risk score today"/></div></section>}
function SlaPage({data}){return <section className="panel"><h2>SLA Monitoring</h2>{data.map(c=><div className="slaRow" key={c.id}><span>{c.id}</span><b>{c.title}</b><i className={c.sla<0?'bad':''}>{c.sla<0?`${Math.abs(c.sla)}h overdue`:`${c.sla}h left`}</i></div>)}</section>}
function AssociationPage({tab}){return <section className="panel"><h2>{tab}</h2><p className="bodyText">Association view menampilkan data agregat, tren kategori, edukasi publik, dan overview member tanpa membuka identitas pelapor atau dokumen sensitif.</p><div className="insightGrid"><Insight n="Dana" t="Top complaint category"/><Insight n="2.4d" t="Average resolution time"/><Insight n="Fraud literacy" t="Recommended education topic"/><Insight n="Read-only" t="Access model"/></div></section>}
function AdminPage({tab}){return <section className="panel"><h2>{tab}</h2><div className="adminGrid"><div><b>Role & Permission</b><p>Public, Platform, Bursa, Kliring, Regulator, Association, Super Admin.</p></div><div><b>Master Data Member</b><p>Platform, bursa, kliring, license, routing rule, SLA profile.</p></div><div><b>Workflow Setting</b><p>Status, critical trigger, escalation rule, resolution acceptance.</p></div><div><b>Audit Log</b><p>All changes, owner transfer, evidence upload, and case decision history.</p></div></div></section>}
function Insight({n,t}){return <div className="insight"><b>{n}</b><span>{t}</span></div>}

createRoot(document.getElementById('root')).render(<App/>);
