import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle, ArrowLeft, Bell, CheckCircle2, ChevronRight, Clock3, FileText,
  FolderOpen, Home, LockKeyhole, LogOut, MessageSquare, Paperclip, Search,
  ShieldCheck, UploadCloud, UserRound, XCircle, Zap
} from 'lucide-react';
import './styles.css';

const platforms = [
  { name: 'PT Aset Digital Berkat', brand: 'Tokocrypto', type: 'Pedagang Fisik Aset Kripto' },
  { name: 'PT Kagum Teknologi Indonesia', brand: 'Ajaib Kripto', type: 'Pedagang Fisik Aset Kripto' },
  { name: 'PT Bumi Santosa Cemerlang', brand: 'Pluang Crypto', type: 'Pedagang Fisik Aset Kripto' },
  { name: 'PT Tumbuh Bersama Nano', brand: 'Nanovest', type: 'Pedagang Fisik Aset Kripto' },
  { name: 'Ajaib Futures Asia', brand: 'Ajaib Futures', type: 'Pialang Berjangka' },
  { name: 'Alpha Centauri Berjangka', brand: 'Alpha Futures', type: 'Pialang Berjangka' },
  { name: 'Genesis Gemilang Futures', brand: 'GGF', type: 'Pialang Berjangka' },
  { name: 'Glori Investama Berjangka', brand: 'Glori Futures', type: 'Pialang Berjangka' },
  { name: 'Indoforex Nasional Futures', brand: 'Indoforex', type: 'Pialang Berjangka' },
  { name: 'Lainnya / belum ditemukan', brand: 'Perlu verifikasi Bappebti', type: 'Manual Review' }
];

const categories = [
  'Dana / Withdrawal', 'Deposit belum masuk', 'Transaksi tidak dikenali',
  'Akun dibekukan / tidak dapat akses', 'Dugaan penipuan', 'Platform tidak merespon',
  'Saldo / aset tidak sesuai', 'Masalah kontrak / order', 'Lainnya'
];

const statusMeta = {
  Draft: ['neutral', 'Belum dikirim'],
  Submitted: ['blue', 'Pengaduan telah diterima'],
  'Under Verification': ['blue', 'Pemeriksaan kelengkapan awal'],
  'Sent to Platform': ['purple', 'Diteruskan ke pihak terkait'],
  'In Progress': ['orange', 'Sedang ditangani'],
  'Waiting for User': ['red', 'Butuh tindakan dari Anda'],
  'Resolution Proposed': ['green', 'Solusi menunggu konfirmasi'],
  'Escalated to Bappebti': ['red', 'Dalam supervisi regulator'],
  Closed: ['green', 'Selesai'],
  'Rejected / Invalid': ['neutral', 'Tidak dapat diproses']
};

const initialCases = [
  {
    id: 'BPP-2026-000184',
    title: 'Penarikan dana belum diterima',
    platform: 'PT Aset Digital Berkat',
    brand: 'Tokocrypto',
    category: 'Dana / Withdrawal',
    status: 'Waiting for User',
    priority: 'High',
    channel: 'BAPPEBTI PORTAL',
    sla: '18 jam tersisa',
    updatedAt: '12 Jun 2026, 09:20',
    createdAt: '11 Jun 2026, 15:42',
    amount: '',
    userAction: 'Platform meminta bukti mutasi rekening dan log withdrawal.',
    summary: 'Pengguna melaporkan withdrawal yang sudah berhasil di aplikasi, tetapi dana belum diterima di rekening tujuan.',
    riskNote: 'Butuh bukti settlement, mutasi rekening, dan log withdrawal dari platform.',
    evidence: ['screenshot-withdrawal.png', 'mutasi-rekening.pdf'],
    timeline: [
      ['Submitted', 'Pengaduan dikirim melalui Bappebti Portal', '11 Jun 2026, 15:42'],
      ['Under Verification', 'Kelengkapan data awal diverifikasi', '11 Jun 2026, 16:08'],
      ['Sent to Platform', 'Pengaduan diteruskan ke PT Aset Digital Berkat', '11 Jun 2026, 16:20'],
      ['Waiting for User', 'Platform meminta klarifikasi tambahan', '12 Jun 2026, 09:20']
    ]
  },
  {
    id: 'BPP-2026-000176',
    title: 'Platform tidak merespon tiket bantuan',
    platform: 'Alpha Centauri Berjangka',
    brand: 'Alpha Futures',
    category: 'Platform tidak merespon',
    status: 'In Progress',
    priority: 'Medium',
    channel: 'BAPPEBTI PORTAL',
    sla: '1 hari 6 jam tersisa',
    updatedAt: '12 Jun 2026, 08:40',
    createdAt: '10 Jun 2026, 10:30',
    amount: '',
    userAction: '',
    summary: 'Pengguna melaporkan belum ada jawaban atas tiket bantuan yang dibuat di platform.',
    riskNote: 'Perlu validasi nomor tiket dan riwayat komunikasi platform.',
    evidence: ['email-ticket.pdf'],
    timeline: [
      ['Submitted', 'Pengaduan diterima', '10 Jun 2026, 10:30'],
      ['Sent to Platform', 'Pengaduan diteruskan ke Alpha Centauri Berjangka', '10 Jun 2026, 11:00'],
      ['In Progress', 'Platform sedang melakukan investigasi', '12 Jun 2026, 08:40']
    ]
  },
  {
    id: 'BPP-2026-000155',
    title: 'Solusi pengembalian biaya administrasi',
    platform: 'PT Bumi Santosa Cemerlang',
    brand: 'Pluang Crypto',
    category: 'Saldo / aset tidak sesuai',
    status: 'Resolution Proposed',
    priority: 'Low',
    channel: 'BAPPEBTI PORTAL',
    sla: 'Menunggu konfirmasi Anda',
    updatedAt: '11 Jun 2026, 14:12',
    createdAt: '08 Jun 2026, 09:10',
    amount: '',
    userAction: 'Mohon tinjau solusi yang diajukan platform.',
    summary: 'Platform menawarkan koreksi biaya administrasi dan penyesuaian saldo.',
    riskNote: 'Menunggu konfirmasi pengguna sebelum case ditutup.',
    evidence: ['proposal-resolusi.pdf'],
    timeline: [
      ['Submitted', 'Pengaduan dikirim', '08 Jun 2026, 09:10'],
      ['In Progress', 'Platform melakukan pengecekan', '09 Jun 2026, 11:35'],
      ['Resolution Proposed', 'Solusi diajukan ke pengguna', '11 Jun 2026, 14:12']
    ]
  }
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState('login');
  const [cases, setCases] = useState(initialCases);
  const [selectedId, setSelectedId] = useState(initialCases[0].id);
  const selectedCase = cases.find(c => c.id === selectedId) || cases[0];

  function navigate(next) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function login() {
    setIsLoggedIn(true);
    navigate('dashboard');
  }

  function logout() {
    setIsLoggedIn(false);
    navigate('login');
  }

  function openCase(id) {
    setSelectedId(id);
    navigate('detail');
  }

  function addCase(payload) {
    const selectedPlatform = platforms.find(p => p.name === payload.platform) || platforms[0];
    const newCase = {
      id: `BPP-2026-${String(200 + cases.length).padStart(6, '0')}`,
      title: payload.title,
      platform: selectedPlatform.name,
      brand: selectedPlatform.brand,
      category: payload.category,
      status: 'Submitted',
      priority: payload.priority,
      channel: 'BAPPEBTI PORTAL',
      sla: '2 hari kerja estimasi respon awal',
      updatedAt: 'Baru saja',
      createdAt: 'Baru saja',
      amount: payload.amount,
      userAction: '',
      summary: payload.description,
      riskNote: payload.amount ? 'Nilai transaksi diisi oleh pelapor dan akan diverifikasi bersama bukti pendukung.' : 'Nominal tidak diisi. Case tetap dapat diproses berdasarkan kronologi dan bukti.',
      evidence: payload.files ? ['dokumen-pendukung.zip'] : [],
      timeline: [['Submitted', 'Pengaduan berhasil dikirim melalui Bappebti Portal', 'Baru saja']]
    };
    setCases([newCase, ...cases]);
    setSelectedId(newCase.id);
    navigate('detail');
  }

  if (!isLoggedIn) return <AuthScreen onLogin={login} />;

  return (
    <div className="appShell">
      <Sidebar page={page} navigate={navigate} logout={logout} />
      <main className="mainArea">
        <Topbar />
        {page === 'dashboard' && <Dashboard cases={cases} openCase={openCase} navigate={navigate} />}
        {page === 'cases' && <CaseList cases={cases} openCase={openCase} />}
        {page === 'new' && <ComplaintWizard onSubmit={addCase} />}
        {page === 'detail' && <CaseDetail data={selectedCase} navigate={navigate} />}
        {page === 'notifications' && <Notifications cases={cases} openCase={openCase} />}
        {page === 'profile' && <Profile />}
      </main>
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  return (
    <div className="authPage">
      <div className="authHero">
        <img src="/assets/bappebti-logo.svg" alt="Bappebti" className="heroLogo" />
        <span className="pill"><ShieldCheck size={16}/> Kanal Pengaduan Resmi</span>
        <h1>Layanan Pengaduan Bappebti</h1>
        <p>Kelola pengaduan Anda secara transparan: kirim laporan, pantau status, lengkapi bukti, dan konfirmasi penyelesaian dalam satu portal.</p>
        <div className="heroGrid">
          <div><CheckCircle2/> Validasi identitas pelapor</div>
          <div><Clock3/> Status & SLA transparan</div>
          <div><FolderOpen/> Bukti tersimpan per case</div>
          <div><Zap/> Eskalasi bila diperlukan</div>
        </div>
      </div>
      <div className="authCard">
        <div className="switcher">
          <button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Masuk</button>
          <button className={mode==='register'?'active':''} onClick={()=>setMode('register')}>Daftar</button>
        </div>
        <h2>{mode === 'login' ? 'Masuk ke akun Anda' : 'Buat akun pelapor'}</h2>
        <p className="muted">Akun diperlukan agar laporan dapat diverifikasi, dimiliki oleh pelapor yang sah, dan dipantau sampai selesai.</p>
        {mode === 'register' && <Input label="Nama lengkap" placeholder="Contoh: Andi Pratama" />}
        <Input label="Email / Nomor HP" placeholder="andi@email.com" />
        {mode === 'register' && <Input label="NIK / Identitas" placeholder="Digunakan untuk validasi, tidak ditampilkan publik" />}
        <Input label="Kata sandi" placeholder="••••••••" type="password" />
        {mode === 'register' && <Input label="Ulangi kata sandi" placeholder="••••••••" type="password" />}
        <button className="primary full" onClick={onLogin}>{mode === 'login' ? 'Masuk ke Dashboard' : 'Daftar & Masuk'}</button>
        <div className="securityNote"><LockKeyhole size={16}/> Data Anda digunakan hanya untuk proses validasi dan penanganan pengaduan.</div>
      </div>
    </div>
  );
}

function Sidebar({ page, navigate, logout }) {
  const items = [
    ['dashboard', Home, 'Dashboard'], ['cases', FileText, 'Pengaduan Saya'], ['new', UploadCloud, 'Buat Pengaduan'],
    ['notifications', Bell, 'Notifikasi'], ['profile', UserRound, 'Profil Akun']
  ];
  return <aside className="sidebar">
    <img src="/assets/bappebti-logo.svg" alt="Bappebti" className="sideLogo" />
    <nav>{items.map(([key, Icon, label]) => <button key={key} onClick={()=>navigate(key)} className={page===key?'active':''}><Icon size={18}/>{label}</button>)}</nav>
    <button className="logout" onClick={logout}><LogOut size={18}/> Keluar</button>
  </aside>;
}

function Topbar() {
  return <header className="topbar">
    <div>
      <h2>Portal Publik Pengaduan</h2>
      <p>Transparansi proses, kepemilikan case, dan tindak lanjut terukur.</p>
    </div>
    <div className="topActions"><span className="pill soft"><Bell size={15}/> 3 update</span><span className="avatar">AP</span></div>
  </header>;
}

function Dashboard({ cases, openCase, navigate }) {
  const stats = useMemo(() => ({
    total: cases.length,
    progress: cases.filter(c => ['In Progress', 'Sent to Platform', 'Under Verification'].includes(c.status)).length,
    action: cases.filter(c => ['Waiting for User', 'Resolution Proposed'].includes(c.status)).length,
    closed: cases.filter(c => c.status === 'Closed').length
  }), [cases]);
  return <section className="page">
    <div className="welcomeCard">
      <div><span className="pill"><ShieldCheck size={16}/> Akun Terverifikasi</span><h1>Selamat datang, Andi</h1><p>Pantau seluruh pengaduan Anda dan lihat tindakan yang diperlukan dari satu dashboard.</p></div>
      <button className="primary" onClick={()=>navigate('new')}>Buat Pengaduan Baru</button>
    </div>
    <div className="statGrid">
      <Stat title="Total Pengaduan" value={stats.total} icon={FileText}/>
      <Stat title="Sedang Diproses" value={stats.progress} icon={Clock3}/>
      <Stat title="Butuh Tindakan Anda" value={stats.action} icon={AlertTriangle}/>
      <Stat title="Selesai" value={stats.closed} icon={CheckCircle2}/>
    </div>
    <div className="twoCol">
      <div className="panel wide"><PanelTitle title="Pengaduan Terbaru" action="Lihat Semua" onClick={()=>navigate('cases')} />
        <div className="caseRows">{cases.map(c => <CaseRow key={c.id} c={c} onClick={()=>openCase(c.id)} />)}</div>
      </div>
      <div className="panel"><h3>Action Required</h3>{cases.filter(c=>c.userAction).map(c => <div className="actionBox" key={c.id} onClick={()=>openCase(c.id)}><AlertTriangle size={18}/><div><b>{c.id}</b><p>{c.userAction}</p></div></div>)}</div>
    </div>
  </section>;
}

function Stat({ title, value, icon: Icon }) { return <div className="stat"><Icon size={22}/><span>{title}</span><strong>{value}</strong></div>; }
function PanelTitle({ title, action, onClick }) { return <div className="panelTitle"><h3>{title}</h3><button onClick={onClick}>{action}<ChevronRight size={16}/></button></div>; }
function Badge({ status }) { const meta = statusMeta[status] || ['neutral', status]; return <span className={`badge ${meta[0]}`}>{status}</span>; }

function CaseRow({ c, onClick }) {
  return <button className="caseRow" onClick={onClick}>
    <div><b>{c.title}</b><span>{c.id} • {c.platform}</span></div>
    <div><small>Channel of Complaint</small><strong>{c.channel}</strong></div>
    <div><small>Kategori</small><strong>{c.category}</strong></div>
    <div><small>SLA</small><strong>{c.sla}</strong></div>
    <Badge status={c.status}/>
  </button>;
}

function CaseList({ cases, openCase }) {
  const [q, setQ] = useState('');
  const filtered = cases.filter(c => JSON.stringify(c).toLowerCase().includes(q.toLowerCase()));
  return <section className="page"><div className="pageHeader"><h1>Pengaduan Saya</h1><p>Seluruh pengaduan yang pernah Anda kirim melalui Bappebti Portal.</p></div>
    <div className="searchBox"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari nomor case, platform, kategori, atau status..." /></div>
    <div className="panel"><div className="caseRows spacious">{filtered.map(c => <CaseRow key={c.id} c={c} onClick={()=>openCase(c.id)} />)}</div></div>
  </section>;
}

function ComplaintWizard({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ category: categories[0], platform: platforms[0].name, priority: 'Medium', title: '', description: '', amount: '', files: false });
  const update = (k,v) => setForm({ ...form, [k]: v });
  return <section className="page"><div className="pageHeader"><h1>Buat Pengaduan Baru</h1><p>Ikuti langkah sederhana agar laporan Anda lengkap dan mudah diverifikasi.</p></div>
    <div className="wizard"><div className="steps">{['Kategori','Platform','Kronologi','Bukti','Review'].map((s,i)=><div className={step>=i+1?'done':''} key={s}><span>{i+1}</span>{s}</div>)}</div>
      <div className="wizardCard">
        {step===1 && <><h2>Jenis pengaduan</h2><Select label="Kategori" value={form.category} onChange={v=>update('category',v)} options={categories}/><Select label="Tingkat urgensi" value={form.priority} onChange={v=>update('priority',v)} options={['Low','Medium','High']}/><Input label="Judul singkat" value={form.title} onChange={v=>update('title',v)} placeholder="Contoh: Penarikan dana belum diterima" /></>}
        {step===2 && <><h2>Platform / member terkait</h2><Select label="Pilih platform" value={form.platform} onChange={v=>update('platform',v)} options={platforms.map(p=>p.name)} /><div className="platformHint">Daftar ini menggunakan contoh dari pelaku usaha terdaftar/berizin. Pada versi produksi, dropdown sebaiknya tersambung ke master data Bappebti.</div></>}
        {step===3 && <><h2>Kronologi dan detail</h2><Input label="Channel of Complaint" value="BAPPEBTI PORTAL" readOnly/><Input label="Nominal transaksi (opsional)" value={form.amount} onChange={v=>update('amount',v)} placeholder="Contoh: 27500000 - boleh dikosongkan"/><TextArea label="Kronologi" value={form.description} onChange={v=>update('description',v)} placeholder="Jelaskan tanggal kejadian, nomor transaksi/tiket, respon platform, dan dampak yang Anda alami." /></>}
        {step===4 && <><h2>Upload bukti pendukung</h2><div className="uploadBox" onClick={()=>update('files',true)}><Paperclip/><b>{form.files ? 'dokumen-pendukung.zip siap diunggah' : 'Klik untuk upload dokumen'}</b><p>Screenshot transaksi, mutasi rekening, email, chat, nomor tiket, atau bukti lainnya.</p></div></>}
        {step===5 && <Review form={form}/>}        
        <div className="wizardActions"><button className="secondary" disabled={step===1} onClick={()=>setStep(step-1)}>Kembali</button>{step<5 ? <button className="primary" onClick={()=>setStep(step+1)}>Lanjut</button> : <button className="primary" onClick={()=>onSubmit(form)}>Kirim Pengaduan</button>}</div>
      </div>
    </div>
  </section>;
}

function Review({ form }) { return <div><h2>Review pengaduan</h2><div className="reviewGrid">{Object.entries({Judul:form.title||'-',Kategori:form.category,Platform:form.platform,'Channel of Complaint':'BAPPEBTI PORTAL','Nominal Opsional':form.amount||'Tidak diisi',Urgensi:form.priority,Kronologi:form.description||'-'}).map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b></div>)}</div><div className="securityNote"><ShieldCheck size={16}/> Dengan mengirim pengaduan, Anda menyatakan informasi yang diberikan benar dan dapat diverifikasi.</div></div>; }

function CaseDetail({ data, navigate }) {
  return <section className="page"><button className="backBtn" onClick={()=>navigate('cases')}><ArrowLeft size={17}/> Kembali ke daftar</button>
    <div className="caseHero"><div><span className="caseId">{data.id}</span><h1>{data.title}</h1><p>{data.platform} <span>({data.brand})</span></p></div><div className={`priority ${data.priority.toLowerCase()}`}>{data.priority}</div></div>
    <div className="detailGrid">
      <div className="detailMain">
        <div className="panel"><div className="detailStats">
          <Info label="Customer" value="Andi Pratama"/><Info label="Category" value={data.category}/><Info label="Channel of Complaint" value={data.channel}/><Info label="SLA" value={data.sla}/>
        </div><div className="riskNote"><b>Risk Note</b><p>{data.riskNote}</p></div></div>
        <div className="panel"><h3>Timeline Status</h3><div className="timeline">{data.timeline.map((t,i)=><div key={i} className="timelineItem"><span></span><div><b>{t[0]}</b><p>{t[1]}</p><small>{t[2]}</small></div></div>)}</div></div>
        <div className="panel"><h3>Ringkasan Pengaduan</h3><p className="bodyText">{data.summary}</p></div>
      </div>
      <aside className="detailSide"><div className="panel"><h3>Status Saat Ini</h3><Badge status={data.status}/><p className="muted small">{statusMeta[data.status]?.[1]}</p>{data.userAction && <div className="actionBox"><AlertTriangle size={18}/><div><b>Tindakan diperlukan</b><p>{data.userAction}</p></div></div>}<button className="primary full"><MessageSquare size={17}/> Berikan Klarifikasi</button><button className="secondary full"><UploadCloud size={17}/> Tambah Bukti</button><button className="secondary full"><Zap size={17}/> Ajukan Eskalasi</button></div>
      <div className="panel"><h3>Resolusi</h3><p className="muted small">Jika solusi sudah diajukan, Anda dapat menerima atau menolak dengan alasan.</p><div className="split"><button className="accept"><CheckCircle2 size={16}/> Terima</button><button className="reject"><XCircle size={16}/> Tolak</button></div></div>
      <div className="panel"><h3>Dokumen</h3>{data.evidence.map(e=><div className="doc" key={e}><FileText size={16}/>{e}</div>)}</div></aside>
    </div>
  </section>;
}

function Info({ label, value }) { return <div className="infoCard"><span>{label}</span><b>{value}</b></div>; }

function Notifications({ cases, openCase }) { return <section className="page"><div className="pageHeader"><h1>Notifikasi</h1><p>Update penting dan tindakan yang perlu Anda lakukan.</p></div><div className="panel notifList">{cases.map(c=><button key={c.id} onClick={()=>openCase(c.id)} className="notif"><Bell size={18}/><div><b>{c.title}</b><p>{c.userAction || `Status terbaru: ${c.status}`}</p><small>{c.updatedAt}</small></div></button>)}</div></section>; }
function Profile() { return <section className="page"><div className="pageHeader"><h1>Profil Akun</h1><p>Data ini digunakan untuk validasi kepemilikan pengaduan.</p></div><div className="panel profileGrid"><Input label="Nama Lengkap" value="Andi Pratama" readOnly/><Input label="Email" value="andi.pratama@email.com" readOnly/><Input label="Nomor HP" value="0812-0000-0000" readOnly/><Input label="Status Verifikasi" value="Terverifikasi" readOnly/></div></section>; }

function Input({ label, placeholder, type='text', value, onChange, readOnly }) { return <label className="field"><span>{label}</span><input type={type} placeholder={placeholder} value={value} readOnly={readOnly} onChange={e=>onChange?.(e.target.value)} /></label>; }
function Select({ label, value, onChange, options }) { return <label className="field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></label>; }
function TextArea({ label, value, onChange, placeholder }) { return <label className="field"><span>{label}</span><textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>; }

createRoot(document.getElementById('root')).render(<App />);
