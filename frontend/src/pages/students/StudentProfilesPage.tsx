import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Search, Plus, ChevronRight, ChevronLeft, ChevronDown, Pencil, Building2,
  Mail, Phone, ExternalLink, X, BriefcaseBusiness, FileCheck2, Clock3,
  CheckCircle2, CircleAlert, ArrowUpRight,
} from "lucide-react";
import "./StudentProfilesPage.css";

type Student = {
  id: string; name: string; program: string; section: string; status: string;
  hoursDone: number; requiredHours: number; email: string; phone: string;
  degree: string; yearSection: string; term: string; course: string;
  adviser: string; adviserEmail: string; emergencyName: string; emergencyPhone: string;
  organization: string; organizationType: string; department: string; position: string;
  arrangement: string; supervisor: string; supervisorEmail: string; address: string;
  startDate: string; expectedCompletion: string; verifiedDocuments: number; totalDocuments: number;
};

const initialStudents: Student[] = [
  {
    id:"2023-0147",name:"Aljon Tambaoan",program:"BSIT",section:"4A",status:"Interning",hoursDone:320,requiredHours:480,
    email:"aljon.tambaoan@example.edu",phone:"+63 917 204 0147",degree:"BS Information Technology (BSIT)",yearSection:"4th year · BSIT 4A",
    term:"1st semester, AY 2026–2027",course:"IT 401 · Internship / Practicum",adviser:"Dr. Marco Lim",adviserEmail:"m.lim@example.edu",
    emergencyName:"Maria Reyes",emergencyPhone:"+63 917 204 0108",organization:"BrightPath Technologies, Inc.",organizationType:"College-maintained",
    department:"Information technology · Software development",position:"Software Development Intern · Engineering",
    arrangement:"On-site · Monday–Friday, 8:00 AM–5:00 PM",supervisor:"Andrea Velasco · Engineering Manager",
    supervisorEmail:"a.velasco@brightpath.example",address:"8F One Meridian Center, Bonifacio Global City, Taguig",
    startDate:"17 Aug 2026",expectedCompletion:"06 Nov 2026",verifiedDocuments:7,totalDocuments:8
  },
  {
    id:"2023-0307",name:"Marciano Salazar",program:"BSIT",section:"4B",status:"Accepted",hoursDone:0,requiredHours:480,
    email:"marciano.salazar@example.edu",phone:"+63 917 203 0307",degree:"BS Information Technology (BSIT)",yearSection:"4th year · BSIT 4B",
    term:"1st semester, AY 2026–2027",course:"IT 401 · Internship / Practicum",adviser:"Prof. Liza Santos",adviserEmail:"l.santos@example.edu",
    emergencyName:"Ramon Salazar",emergencyPhone:"+63 917 203 0308",organization:"Nexa Digital Studio",organizationType:"College-maintained",
    department:"Digital products · Frontend engineering",position:"Frontend Development Intern",arrangement:"Hybrid · Monday–Friday",
    supervisor:"Paolo Cruz · Team Lead",supervisorEmail:"p.cruz@nexa.example",address:"Santa Cruz, Laguna",
    startDate:"02 Nov 2026",expectedCompletion:"19 Feb 2027",verifiedDocuments:5,totalDocuments:8
  },
  {
    id:"2023-0214",name:"Janell Tagayun",program:"BSBA",section:"4A",status:"Interning",hoursDone:216,requiredHours:400,
    email:"janell.tagayun@example.edu",phone:"+63 917 202 0214",degree:"Bachelor of Science in Business Administration (BSBA)",yearSection:"4th year · BSBA 4A",
    term:"1st semester, AY 2026–2027",course:"BA 401 · Internship / Practicum",adviser:"Dr. Marco Lim",adviserEmail:"m.lim@example.edu",
    emergencyName:"Lorna Tagayun",emergencyPhone:"+63 917 202 0215",organization:"Nexa Digital Studio",organizationType:"College-maintained",
    department:"Business operations",position:"Operations Intern",arrangement:"On-site · Monday–Friday",
    supervisor:"Paolo Cruz · Team Lead",supervisorEmail:"p.cruz@nexa.example",address:"Santa Cruz, Laguna",
    startDate:"01 Sep 2026",expectedCompletion:"20 Nov 2026",verifiedDocuments:8,totalDocuments:8
  },
  {
    id:"2023-0253",name:"Rolan Sotomayor",program:"BSBA",section:"4A",status:"Accepted",hoursDone:0,requiredHours:400,
    email:"rolan.sotomayor@example.edu",phone:"+63 917 202 0253",degree:"Bachelor of Science in Business Administration (BSBA)",yearSection:"4th year · BSBA 4A",
    term:"1st semester, AY 2026–2027",course:"BA 401 · Internship / Practicum",adviser:"Prof. Liza Santos",adviserEmail:"l.santos@example.edu",
    emergencyName:"Rita Sotomayor",emergencyPhone:"+63 917 202 0254",organization:"Orbit Solutions",organizationType:"Student-sourced",
    department:"Quality assurance",position:"Quality Assurance Intern",arrangement:"Hybrid · Monday–Friday",
    supervisor:"Christian Dela Cruz · QA Lead",supervisorEmail:"c.delacruz@orbit.example",address:"Calamba, Laguna",
    startDate:"09 Nov 2026",expectedCompletion:"12 Feb 2027",verifiedDocuments:4,totalDocuments:8
  },
  {
    id:"2023-0308",name:"Paolo Villanueva",program:"BSHM",section:"4B",status:"Not applied",hoursDone:0,requiredHours:600,
    email:"karl.cuerdo@example.edu",phone:"+63 917 203 0308",degree:"Bachelor of Science in Hospitality Management (BSHM)",yearSection:"4th year · BSHM 4B",
    term:"1st semester, AY 2026–2027",course:"HM 401 · Internship / Practicum",adviser:"Ms. Ana Flores",adviserEmail:"a.flores@example.edu",
    emergencyName:"Jose Cuerdo",emergencyPhone:"+63 917 203 0309",organization:"Unassigned",organizationType:"Not yet placed",
    department:"—",position:"—",arrangement:"—",supervisor:"—",supervisorEmail:"—",address:"—",
    startDate:"—",expectedCompletion:"—",verifiedDocuments:2,totalDocuments:8
  },
  {
    id:"2023-0182",name:"Agapito Banda Jr.",program:"BSBA",section:"4B",status:"Interning",hoursDone:240,requiredHours:400,
    email:"agapito.banda@example.edu",phone:"+63 917 201 0182",degree:"Bachelor of Science in Business Administration (BSBA)",yearSection:"4th year · BSBA 4B",
    term:"1st semester, AY 2026–2027",course:"BA 401 · Internship / Practicum",adviser:"Dr. Marco Lim",adviserEmail:"m.lim@example.edu",
    emergencyName:"Lydia Banda",emergencyPhone:"+63 917 201 0183",organization:"Vertex Systems",organizationType:"College-maintained",
    department:"IT support services",position:"IT Support Intern",arrangement:"On-site · Monday–Friday",
    supervisor:"Miguel Ramos · IT Supervisor",supervisorEmail:"m.ramos@vertex.example",address:"Calamba, Laguna",
    startDate:"24 Aug 2026",expectedCompletion:"27 Nov 2026",verifiedDocuments:6,totalDocuments:8
  },
  {
    id:"2023-0138",name:"Jeremy Reyes",program:"BSIT",section:"4A",status:"Completed",hoursDone:480,requiredHours:480,
    email:"jeremy.reyes@example.edu",phone:"+63 917 204 0138",degree:"BS Information Technology (BSIT)",yearSection:"4th year · BSIT 4A",
    term:"1st semester, AY 2026–2027",course:"IT 401 · Internship / Practicum",adviser:"Dr. Marco Lim",adviserEmail:"m.lim@example.edu",
    emergencyName:"Maria Reyes",emergencyPhone:"+63 917 204 0108",organization:"BrightPath Technologies, Inc.",organizationType:"College-maintained",
    department:"Information technology · Software development",position:"Software Development Intern · Engineering",
    arrangement:"On-site · Monday–Friday, 8:00 AM–5:00 PM",supervisor:"Andrea Velasco · Engineering Manager",
    supervisorEmail:"a.velasco@brightpath.example",address:"8F One Meridian Center, Bonifacio Global City, Taguig",
    startDate:"17 Aug 2026",expectedCompletion:"06 Nov 2026",verifiedDocuments:7,totalDocuments:8
  }
];

const emptyStudent: Student = {
  id:"",name:"",program:"BSIT",section:"4A",status:"Not applied",hoursDone:0,requiredHours:480,
  email:"",phone:"",degree:"BS Information Technology (BSIT)",yearSection:"4th year · BSIT 4A",
  term:"1st semester, AY 2026–2027",course:"IT 401 · Internship / Practicum",adviser:"",adviserEmail:"",
  emergencyName:"",emergencyPhone:"",organization:"Unassigned",organizationType:"Not yet placed",department:"—",
  position:"—",arrangement:"—",supervisor:"—",supervisorEmail:"—",address:"—",startDate:"—",expectedCompletion:"—",
  verifiedDocuments:0,totalDocuments:8
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0,2).map(part => part[0]).join("").toUpperCase() || "ST";
}
function StatusBadge({status}:{status:string}) {
  return <span className={`student-status status-${status.toLowerCase().replace(/\s+/g,"-")}`}>{status}</span>;
}
function InfoField({label,children}:{label:string;children:ReactNode}) {
  return <div className="student-info-field"><span>{label}</span><strong>{children}</strong></div>;
}

export default function StudentProfilesPage() {
  const [students,setStudents] = useState<Student[]>(initialStudents);
  const [selectedId,setSelectedId] = useState("2023-0138");
  const [profileAnimating,setProfileAnimating] = useState(false);
  const animationTimer = useRef<number | undefined>(undefined);

  function selectStudent(studentId: string) {
    // Remove the animation class first, then reapply it after a short pause
    // so the browser reliably starts the animation on every click.
    if (animationTimer.current !== undefined) {
      window.clearTimeout(animationTimer.current);
    }
    setProfileAnimating(false);
    setSelectedId(studentId);
    setTab("Profile overview");
    animationTimer.current = window.setTimeout(() => {
      setProfileAnimating(true);
      animationTimer.current = window.setTimeout(() => {
        setProfileAnimating(false);
        animationTimer.current = undefined;
      }, 850);
    }, 25);
  }
  const [query,setQuery] = useState("");
  const [program,setProgram] = useState("All programs");
  const [section,setSection] = useState("All sections");
  const [status,setStatus] = useState("All internship statuses");
  const [page,setPage] = useState(1);
  const [tab,setTab] = useState("Profile overview");
  const [modal,setModal] = useState<"add"|"edit"|null>(null);
  const [form,setForm] = useState<Student>(emptyStudent);
  const [notice,setNotice] = useState("");

  const filtered = useMemo(() => students.filter(student => {
    const q = query.trim().toLowerCase();
    return (!q || `${student.name} ${student.id} ${student.organization}`.toLowerCase().includes(q))
      && (program === "All programs" || student.program === program)
      && (section === "All sections" || `${student.program} ${student.section}` === section)
      && (status === "All internship statuses" || student.status === status);
  }),[students,query,program,section,status]);

  const pageSize = 7;
  const pageCount = Math.max(1,Math.ceil(filtered.length/pageSize));
  const visible = filtered.slice((page-1)*pageSize,page*pageSize);
  const selected = students.find(student => student.id === selectedId) ?? filtered[0] ?? students[0] ?? emptyStudent;
  const progress = Math.min(100,Math.round(selected.hoursDone/Math.max(1,selected.requiredHours)*100));

  function notify(message:string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""),2600);
  }
  function openAdd() {
    setForm({...emptyStudent,id:`2026-${String(1000+students.length).slice(-4)}`});
    setModal("add");
  }
  function openEdit() {
    setForm({...selected});
    setModal("edit");
  }
  function update<K extends keyof Student>(key:K,value:Student[K]) {
    setForm(current => ({...current,[key]:value}));
  }
  function save(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.id.trim()) return;
    if (modal === "add") {
      if (students.some(student => student.id === form.id)) { notify("That student ID already exists."); return; }
      setStudents(current => [form,...current]);
      setSelectedId(form.id);
      setQuery(""); setProgram("All programs"); setSection("All sections"); setStatus("All internship statuses"); setPage(1);
      notify("Demo student added.");
    } else {
      setStudents(current => current.map(student => student.id === selectedId ? form : student));
      setSelectedId(form.id);
      notify("Demo profile updated.");
    }
    setModal(null);
  }
  function filterChange(setter:(value:string)=>void,value:string) {
    setter(value); setPage(1);
  }

  return (
    <section className="student-profile-page">
      <div className="student-page-heading">
        <div><h1>Student internship profiles</h1><p>Keep student details, adviser assignments and placement information connected.</p></div>
        <button className="student-primary-button" type="button" onClick={openAdd}><Plus size={15}/> Add student</button>
      </div>

      <div className="student-filter-bar">
        <label className="student-search-box"><Search size={15}/><input value={query} onChange={e=>filterChange(setQuery,e.target.value)} placeholder="Search name or student ID" aria-label="Search name or student ID"/>{query && <button type="button" aria-label="Clear search" onClick={()=>setQuery("")}><X size={14}/></button>}</label>
        <label className="student-select-wrap"><select value={program} onChange={e=>filterChange(setProgram,e.target.value)} aria-label="Filter by program"><option>All programs</option><option>BSIT</option><option>BSBA</option><option>BSHM</option></select><ChevronDown size={13}/></label>
        <label className="student-select-wrap"><select value={section} onChange={e=>filterChange(setSection,e.target.value)} aria-label="Filter by section"><option>All sections</option>{["BSIT 4A","BSIT 4B","BSBA 4A","BSBA 4B","BSHM 4B"].map(item=><option key={item}>{item}</option>)}</select><ChevronDown size={13}/></label>
        <label className="student-select-wrap student-status-filter"><select value={status} onChange={e=>filterChange(setStatus,e.target.value)} aria-label="Filter by internship status"><option>All internship statuses</option>{["Not applied","Applying","Accepted","Interning","Completed"].map(item=><option key={item}>{item}</option>)}</select><ChevronDown size={13}/></label>
        <span className="student-record-count">{filtered.length} sample records</span>
      </div>

      <div className="student-workspace">
        <aside className="student-directory-panel">
          <div className="student-directory-heading"><strong>Students</strong><span>Recently updated</span></div>
          <div className="student-directory-list">
            {visible.map(student=>{
              const isSelected=student.id===selected.id;
              return <button key={student.id} type="button" className={`student-directory-item ${isSelected?"is-selected":""}`} onClick={()=>selectStudent(student.id)}>
                <span className="student-avatar">{initials(student.name)}</span>
                <span className="student-directory-main"><strong>{student.name}</strong><small>{student.id} · {student.program} {student.section}</small></span>
                <ChevronRight className="student-directory-chevron" size={14}/>
                <span className="student-directory-meta"><StatusBadge status={student.status}/><small>{student.hoursDone} / {student.requiredHours} h</small></span>
              </button>;
            })}
            {visible.length===0 && <div className="student-empty-state">No students match your search. Try changing the filters.</div>}
          </div>
          <div className="student-pagination"><span>Showing {visible.length?(page-1)*pageSize+1:0}–{Math.min(page*pageSize,filtered.length)} of {filtered.length}</span><div><button type="button" disabled={page<=1} onClick={()=>setPage(v=>v-1)} aria-label="Previous page"><ChevronLeft size={14}/></button><span>{page}/{pageCount}</span><button type="button" disabled={page>=pageCount} onClick={()=>setPage(v=>v+1)} aria-label="Next page"><ChevronRight size={14}/></button></div></div>
        </aside>

        <div key={selected.id} className={`student-profile-details ${profileAnimating ? "is-switching" : ""}`}>
          <section className="student-detail-card student-identity-card">
            <div className="student-identity-top"><span className="student-avatar student-avatar-large">{initials(selected.name)}</span><div className="student-identity-copy"><div className="student-name-line"><h2>{selected.name||"Select a student"}</h2><StatusBadge status={selected.status}/></div><p>{selected.id} · {selected.degree} · Section {selected.section}</p><div className="student-contact-line"><span><Mail size={12}/>{selected.email||"No email recorded"}</span><span><Phone size={12}/>{selected.phone||"No phone recorded"}</span></div></div><button className="student-outline-button" type="button" onClick={openEdit}><Pencil size={13}/> Edit profile</button></div>
            <div className="student-tabs" role="tablist" aria-label="Student profile sections">{["Profile overview","Applications · 3","Documents · 8","Progress & hours"].map(item=>{const value=item.split(" ·")[0];return <button key={item} type="button" role="tab" aria-selected={tab===value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{item}</button>;})}</div>
            {tab==="Profile overview" && <div className="student-identity-summary"><InfoField label="Faculty adviser">{selected.adviser||"Not assigned"}</InfoField><InfoField label="Required hours">{selected.requiredHours} hours</InfoField><InfoField label="Current placement">{selected.organization}</InfoField></div>}
            {tab==="Applications" && <div className="student-tab-placeholder"><BriefcaseBusiness size={18}/><div><strong>Application history</strong><p>Application records for this student will appear here when connected to the backend.</p></div><span>Demo preview</span></div>}
            {tab==="Documents" && <div className="student-tab-placeholder"><FileCheck2 size={18}/><div><strong>Document checklist</strong><p>{selected.verifiedDocuments} of {selected.totalDocuments} requirements are marked verified in this sample profile.</p></div><span>Demo preview</span></div>}
            {tab==="Progress & hours" && <div className="student-tab-placeholder"><Clock3 size={18}/><div><strong>{selected.hoursDone} of {selected.requiredHours} hours rendered</strong><p>{Math.max(0,selected.requiredHours-selected.hoursDone)} hours remaining based on this sample record.</p></div><span>{progress}%</span></div>}
          </section>

          <section className="student-detail-card"><div className="student-card-heading"><h3>Student information</h3><button type="button" onClick={()=>notify("Academic record preview is not connected yet.")}>View academic record <ExternalLink size={12}/></button></div><div className="student-info-grid">
            <InfoField label="Degree program">{selected.degree}</InfoField><InfoField label="Year level and section">{selected.yearSection}</InfoField><InfoField label="Academic term">{selected.term}</InfoField><InfoField label="Practicum course">{selected.course}</InfoField><InfoField label="Assigned faculty adviser">{selected.adviser} · {selected.adviserEmail}</InfoField><InfoField label="Emergency contact">{selected.emergencyName} · {selected.emergencyPhone}</InfoField>
          </div></section>

          <section className="student-detail-card"><div className="student-card-heading"><h3>Internship organization</h3><button type="button" onClick={openEdit}>Edit organization</button></div><div className="student-organization-heading"><span className="student-organization-icon"><Building2 size={17}/></span><div><strong>{selected.organization}</strong><small>{selected.department}</small></div><span className="student-organization-type">{selected.organizationType}</span></div><div className="student-info-grid">
            <InfoField label="Position / department">{selected.position}</InfoField><InfoField label="Work arrangement">{selected.arrangement}</InfoField><InfoField label="Host supervisor">{selected.supervisor}</InfoField><InfoField label="Contact information">{selected.supervisorEmail}</InfoField><InfoField label="Office address">{selected.address}</InfoField>
          </div><p className="student-card-footnote">Organization details are sample data and can be updated by college users.</p></section>

          <section className="student-detail-card student-progress-card"><div className="student-card-heading"><h3>Placement readiness & progress</h3><button type="button" onClick={()=>setTab("Progress & hours")}>Open monitoring <ArrowUpRight size={12}/></button></div><div className="student-info-grid student-progress-metrics"><InfoField label="Start date">{selected.startDate}</InfoField><InfoField label="Expected completion">{selected.expectedCompletion}</InfoField><InfoField label="Verified hours">{selected.hoursDone} h · {Math.max(0,selected.requiredHours-selected.hoursDone)} remaining</InfoField></div><div className="student-progress-track" aria-label={`${progress}% internship hours completed`}><span style={{width:`${progress}%`}}/></div><div className="student-progress-footer"><span className={`student-docs-pill ${selected.verifiedDocuments===selected.totalDocuments?"all-verified":""}`}>{selected.verifiedDocuments===selected.totalDocuments?<CheckCircle2 size={12}/>:<CircleAlert size={12}/>} {selected.verifiedDocuments} of {selected.totalDocuments} documents verified</span><span>{progress}% of required hours</span></div></section>
        </div>
      </div>

      {modal && <div className="student-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(null);}}><section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="student-modal-title"><div className="student-modal-heading"><div><span>STUDENT MANAGEMENT</span><h2 id="student-modal-title">{modal==="add"?"Add student":"Edit student profile"}</h2><p>Enter details for this demo student record.</p></div><button type="button" onClick={()=>setModal(null)} aria-label="Close dialog"><X size={18}/></button></div><form onSubmit={save}><div className="student-form-grid">
        <label className="student-form-field student-form-wide"><span>Full name *</span><input required value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Enter student's full name"/></label>
        <label className="student-form-field"><span>Student ID *</span><input required value={form.id} onChange={e=>update("id",e.target.value)} placeholder="e.g. 2026-0101"/></label>
        <label className="student-form-field"><span>Email address</span><input type="email" value={form.email} onChange={e=>update("email",e.target.value)}/></label>
        <label className="student-form-field"><span>Program</span><select value={form.program} onChange={e=>update("program",e.target.value)}><option>BSIT</option><option>BSBA</option><option>BSHM</option></select></label>
        <label className="student-form-field"><span>Section</span><input value={form.section} onChange={e=>update("section",e.target.value)}/></label>
        <label className="student-form-field"><span>Internship status</span><select value={form.status} onChange={e=>update("status",e.target.value)}>{["Not applied","Applying","Accepted","Interning","Completed"].map(item=><option key={item}>{item}</option>)}</select></label>
        <label className="student-form-field"><span>Required hours</span><input type="number" min="0" value={form.requiredHours} onChange={e=>update("requiredHours",Number(e.target.value))}/></label>
        <label className="student-form-field"><span>Rendered hours</span><input type="number" min="0" value={form.hoursDone} onChange={e=>update("hoursDone",Number(e.target.value))}/></label>
        <label className="student-form-field student-form-wide"><span>Organization</span><input value={form.organization} onChange={e=>update("organization",e.target.value)}/></label>
      </div><div className="student-modal-actions"><button className="student-cancel-button" type="button" onClick={()=>setModal(null)}>Cancel</button><button className="student-primary-button" type="submit">{modal==="add"?"Add student":"Save changes"}</button></div><p className="student-form-note">Demo only: changes are held in page state and are not saved to a database.</p></form></section></div>}
      {notice && <div className="student-toast"><CheckCircle2 size={15}/>{notice}</div>}
    </section>
  );
}
