import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";
import "./ApplicationsPage.css";

type ApplicationStatus = "Closed" | "Interview set" | "Withdrawn" | "Under review";
type Decision = "Accepted" | "Rejected" | "Pending" | "No decision";

type Application = {
  id: number;
  student: string;
  studentId: string;
  program: string;
  section: string;
  organization: string;
  position: string;
  dateApplied: string;
  interviewDate: string;
  applicationStatus: ApplicationStatus;
  decision: Decision;
};

type ApplicationForm = Omit<Application, "id">;

type TimelineItem = {
  title: string;
  detail: string;
  date: string;
  kind: "success" | "interview" | "submitted" | "closed";
};

type ToastMessage = {
  title: string;
  detail?: string;
  kind?: "success" | "info";
};

const PAGE_SIZE = 6;
const DAY = 86_400_000;
const REFERENCE_DATE = new Date(2026, 9, 9).getTime();
const SEMESTER_START = new Date(2026, 6, 1).getTime();
const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const seededApplications: Application[] = [
  {
    id: 1,
    student: "Paolo Villanueva",
    studentId: "2023-0147",
    program: "BSIT",
    section: "4A",
    organization: "BrightPath Technologies",
    position: "Software Dev. Intern",
    dateApplied: "28 Jul 2026",
    interviewDate: "03 Aug 2026",
    applicationStatus: "Closed",
    decision: "Accepted",
  },
  {
    id: 2,
    student: "Janell Tagayun",
    studentId: "2023-0214",
    program: "BSIT",
    section: "4A",
    organization: "Nexa Digital Studio",
    position: "Frontend Intern",
    dateApplied: "13 Jul 2026",
    interviewDate: "20 Jul 2026",
    applicationStatus: "Closed",
    decision: "Rejected",
  },
  {
    id: 3,
    student: "Marciano Salazar",
    studentId: "2023-0307",
    program: "BSIT",
    section: "4B",
    organization: "Orbit Solutions",
    position: "QA Intern",
    dateApplied: "16 Jul 2026",
    interviewDate: "27 Jul 2026",
    applicationStatus: "Withdrawn",
    decision: "No decision",
  },
  {
    id: 4,
    student: "Agapito Banda Jr.",
    studentId: "2023-0182",
    program: "BSIT",
    section: "4B",
    organization: "Vertex Systems",
    position: "IT Support Intern",
    dateApplied: "18 Sep 2026",
    interviewDate: "25 Sep 2026",
    applicationStatus: "Closed",
    decision: "Accepted",
  },
  {
    id: 5,
    student: "Aljon Tamboaan",
    studentId: "2023-0253",
    program: "BSBA",
    section: "4A",
    organization: "Meridian Bank",
    position: "Finance Intern",
    dateApplied: "28 Sep 2026",
    interviewDate: "06 Oct 2026",
    applicationStatus: "Closed",
    decision: "Accepted",
  },
  {
    id: 6,
    student: "Christian Mer Cuala",
    studentId: "2023-0147",
    program: "BSIT",
    section: "4A",
    organization: "Harborview Hotel",
    position: "Guest Services Intern",
    dateApplied: "02 Oct 2026",
    interviewDate: "12 Oct 2026",
    applicationStatus: "Interview set",
    decision: "Pending",
  },
];

const firstNames = [
  "Sofia", "Maristela", "Jillian", "Jeremy", "Rolan", "Patricia", "Lorenzo",
  "Camille", "Gabriel", "Bea", "Miguel", "Andrea", "Nico", "Isabel", "Paolo",
  "Katrina", "Rafael", "Mikaela", "Joshua", "Clarisse",
];
const lastNames = [
  "Reyes", "Moises", "Formezala", "Sotomayor", "Manalo", "Bautista",
  "Delos Santos", "Navarro", "Villanueva", "Mercado", "Aquino", "Ramos",
  "Garcia", "Tan", "Lim", "Cruz", "Flores", "Santos", "Domingo", "Velasco",
];
const organizations = [
  "BrightPath Technologies", "Nexa Digital Studio", "Orbit Solutions",
  "Vertex Systems", "Meridian Bank", "Harborview Hotel", "Summit Retail Group",
  "CivicWorks Laguna", "Pacific Ridge Logistics", "Bluewave Analytics",
  "Northstar Media", "Greenfield Foods", "Pinnacle Software Labs",
  "Laguna Community Hospital",
];
const positions = [
  "Software Dev. Intern", "Frontend Intern", "QA Intern", "IT Support Intern",
  "Finance Intern", "Guest Services Intern", "Operations Intern", "Admin Intern",
  "Marketing Intern", "HR Intern", "Data Analyst Intern", "UI/UX Intern",
];
const programs = ["BSIT", "BSBA", "BSHM"];

function formatDate(value: Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(value.getDate()).padStart(2, "0")} ${months[value.getMonth()]} ${value.getFullYear()}`;
}

function buildApplications() {
  const applications: Application[] = [...seededApplications];
  const total = 312 - applications.length;
  const start = new Date(2026, 6, 1).getTime();

  for (let index = 0; index < total; index += 1) {
    const appliedDate = new Date(start + ((index * 37 + 3) % 100) * DAY);
    const interviewDate = new Date(appliedDate.getTime() + (4 + ((index * 5) % 11)) * DAY);
    const applicationStatus: ApplicationStatus =
      index % 8 === 0 ? "Withdrawn" : index % 4 === 0 ? "Interview set" : "Closed";
    const decision: Decision =
      applicationStatus === "Withdrawn"
        ? "No decision"
        : applicationStatus === "Interview set"
        ? "Pending"
        : index % 5 === 0
        ? "Rejected"
        : "Accepted";

    applications.push({
      id: 7 + index,
      student: `${firstNames[(index * 5) % firstNames.length]} ${lastNames[(index * 11) % lastNames.length]}`,
      studentId: `2023-${String(1000 + ((index * 31) % 9000)).padStart(4, "0")}`,
      program: programs[index % programs.length],
      section: index % 2 === 0 ? "4A" : "4B",
      organization: organizations[(index * 3) % organizations.length],
      position: positions[(index * 7) % positions.length],
      dateApplied: formatDate(appliedDate),
      interviewDate: formatDate(interviewDate),
      applicationStatus,
      decision,
    });
  }

  return applications;
}

const sofiaHistory: TimelineItem[] = [
  {
    title: "BrightPath offer accepted",
    detail: "Sofia confirmed the offer; placement recorded by Elena Villanueva.",
    date: "07 Aug 2026",
    kind: "success",
  },
  {
    title: "Technical interview completed",
    detail: "BrightPath Technologies · Software Development Intern",
    date: "03 Aug 2026",
    kind: "interview",
  },
  {
    title: "Application submitted to BrightPath",
    detail: "Resume and endorsement sent to the host supervisor.",
    date: "28 Jul 2026",
    kind: "submitted",
  },
  {
    title: "Earlier applications closed",
    detail: "Nexa · rejected 24 Jul · Orbit · withdrawn 07 Aug after acceptance.",
    date: "24 Jul–07 Aug",
    kind: "closed",
  },
];

function parseApplicationDate(value: string) {
  const [day, month, year] = value.trim().split(/\s+/);
  if (!day || !month || !year || MONTH_INDEX[month] === undefined) return Number.NaN;
  return new Date(Number(year), MONTH_INDEX[month], Number(day)).getTime();
}

function statusTone(status: ApplicationStatus) {
  if (status === "Closed") return "closed";
  if (status === "Withdrawn") return "withdrawn";
  if (status === "Interview set") return "interview";
  return "review";
}

function decisionTone(decision: Decision) {
  if (decision === "Accepted") return "accepted";
  if (decision === "Rejected") return "rejected";
  if (decision === "Pending") return "pending";
  return "none";
}

function historyFor(application: Application, applications: Application[]): TimelineItem[] {
  const related = applications.filter((item) => item.student === application.student);
  const items: TimelineItem[] = [];
  const firstName = application.student.split(/\s+/)[0] || "The student";

  if (application.decision === "Accepted") {
    items.push({
      title: `${application.organization} offer accepted`,
      detail: `${firstName} confirmed the offer; placement recorded by the college.`,
      date: application.interviewDate,
      kind: "success",
    });
  } else if (application.decision === "Rejected") {
    items.push({
      title: `${application.organization} application closed`,
      detail: "The host organization recorded a final decision for this application.",
      date: application.interviewDate,
      kind: "closed",
    });
  } else if (application.decision === "Pending") {
    items.push({
      title: "Application awaiting decision",
      detail: `${application.organization} · ${application.position}`,
      date: application.interviewDate,
      kind: "interview",
    });
  } else {
    items.push({
      title: `${application.organization} application withdrawn`,
      detail: "The student withdrew before a final decision was recorded.",
      date: application.interviewDate,
      kind: "closed",
    });
  }

  items.push({
    title: "Technical interview completed",
    detail: `${application.organization} · ${application.position}`,
    date: application.interviewDate,
    kind: "interview",
  });
  items.push({
    title: `Application submitted to ${application.organization}`,
    detail: "Resume and endorsement sent to the host supervisor.",
    date: application.dateApplied,
    kind: "submitted",
  });
  items.push({
    title: "Earlier applications closed",
    detail:
      related.length > 1
        ? `${related.length - 1} other application${related.length - 1 === 1 ? "" : "s"} on record this semester.`
        : "No other applications recorded for this student this semester.",
    date: application.dateApplied,
    kind: "closed",
  });

  return items;
}

const emptyForm: ApplicationForm = {
  student: "",
  studentId: "",
  program: "BSIT",
  section: "4A",
  organization: "",
  position: "",
  dateApplied: "09 Oct 2026",
  interviewDate: "",
  applicationStatus: "Interview set",
  decision: "Pending",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(buildApplications);
  const [query, setQuery] = useState("");
  const [program, setProgram] = useState("All programs");
  const [section, setSection] = useState("All sections");
  const [status, setStatus] = useState("All statuses");
  const [dateFilter, setDateFilter] = useState("Applied: all dates");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(seededApplications[0].id);
  const [historyApp, setHistoryApp] = useState<Application | null>(null);
  const [historyAnimating, setHistoryAnimating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ApplicationForm>(emptyForm);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const historyTimer = useRef<number | undefined>(undefined);
  const toastTimer = useRef<number | undefined>(undefined);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return applications.filter((application) => {
      if (
        normalizedQuery &&
        !`${application.student} ${application.studentId} ${application.organization}`
          .toLowerCase()
          .includes(normalizedQuery)
      ) {
        return false;
      }
      if (program !== "All programs" && application.program !== program) return false;
      if (
        section !== "All sections" &&
        `${application.program} ${application.section}` !== section
      ) {
        return false;
      }
      if (status !== "All statuses" && application.applicationStatus !== status) return false;

      const appliedAt = parseApplicationDate(application.dateApplied);
      if (dateFilter === "Applied: last 7 days") {
        return appliedAt >= REFERENCE_DATE - 6 * DAY && appliedAt <= REFERENCE_DATE;
      }
      if (dateFilter === "Applied: last 30 days") {
        return appliedAt >= REFERENCE_DATE - 29 * DAY && appliedAt <= REFERENCE_DATE;
      }
      if (dateFilter === "Applied: this semester") {
        return appliedAt >= SEMESTER_START && appliedAt <= REFERENCE_DATE;
      }
      return true;
    });
  }, [applications, query, program, section, status, dateFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const pageStart = Math.min(
    Math.max(1, safePage - 1),
    Math.max(1, pageCount - 2)
  );
  const pageNumbers = Array.from(
    { length: Math.min(3, pageCount) },
    (_, index) => pageStart + index
  );

  const historyItems = historyApp ? historyFor(historyApp, applications) : sofiaHistory;
  const historyName = historyApp?.student ?? "Sofia Reyes";
  const historyCount = historyApp
    ? applications.filter((application) => application.student === historyApp.student).length
    : 3;

  function resetPage() {
    setPage(1);
  }

  function notify(title: string, detail?: string, kind: "success" | "info" = "info") {
    if (toastTimer.current !== undefined) window.clearTimeout(toastTimer.current);
    setToast({ title, detail, kind });
    toastTimer.current = window.setTimeout(() => setToast(null), 3400);
  }

  function selectApplication(application: Application) {
    if (historyTimer.current !== undefined) window.clearTimeout(historyTimer.current);
    setSelectedId(application.id);
    setHistoryApp(application);
    setHistoryAnimating(false);
    historyTimer.current = window.setTimeout(() => {
      setHistoryAnimating(true);
      historyTimer.current = window.setTimeout(() => {
        setHistoryAnimating(false);
        historyTimer.current = undefined;
      }, 850);
    }, 25);
  }

  function openRecordModal() {
    setForm({
      ...emptyForm,
      studentId: `2026-${String(1000 + applications.length).slice(-4)}`,
    });
    setModalOpen(true);
  }

  function updateForm<K extends keyof ApplicationForm>(key: K, value: ApplicationForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function saveApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.student.trim() || !form.organization.trim() || !form.position.trim()) return;

    const nextApplication: Application = {
      id: Math.max(0, ...applications.map((application) => application.id)) + 1,
      ...form,
      student: form.student.trim(),
      organization: form.organization.trim(),
      position: form.position.trim(),
      interviewDate: form.interviewDate.trim() || "—",
    };

    setApplications((current) => [nextApplication, ...current]);
    setSelectedId(nextApplication.id);
    setHistoryApp(nextApplication);
    setQuery("");
    setProgram("All programs");
    setSection("All sections");
    setStatus("All statuses");
    setDateFilter("Applied: all dates");
    setPage(1);
    setModalOpen(false);
    notify(
      "Application recorded",
      `${nextApplication.student} · ${nextApplication.organization}`,
      "success"
    );
  }

  function exportCSV() {
    const rows = filtered.map((application) => [
      application.student,
      application.studentId,
      `${application.program} ${application.section}`,
      application.organization,
      application.position,
      application.dateApplied,
      application.interviewDate,
      application.applicationStatus,
      application.decision,
    ]);
    const csv = [
      [
        "Student",
        "Student ID",
        "Program",
        "Organization",
        "Position",
        "Date applied",
        "Interview date",
        "Application status",
        "Decision",
      ],
      ...rows,
    ]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "internship-application-tracking.csv";
    link.click();
    URL.revokeObjectURL(url);
    notify(
      "Register exported",
      `${filtered.length} application records included in the CSV.`,
      "success"
    );
  }

  return (
    <section className="application-page">
      <header className="application-page-heading">
        <div>
          <h1>Internship application tracking</h1>
          <p>Follow every application from first submission to a confirmed placement.</p>
        </div>
        <button
          className="report-button application-record-button"
          type="button"
          onClick={openRecordModal}
        >
          <Plus size={15} />
          Record application
        </button>
      </header>

      <section className="stat-grid application-stat-grid" aria-label="Application summary">
        <article className="stat-card">
          <div className="stat-card-top">
            <span>Students applying</span>
            <span className="stat-icon purple"><Send size={14} /></span>
          </div>
          <strong>42</strong>
          <p>Awaiting interviews or decisions</p>
        </article>
        <article className="stat-card">
          <div className="stat-card-top">
            <span>Accepted students</span>
            <span className="stat-icon mint"><CheckCircle2 size={14} /></span>
          </div>
          <strong>18</strong>
          <p>Preparing to start their internship</p>
        </article>
        <article className="stat-card">
          <div className="stat-card-top">
            <span>Interviews this week</span>
            <span className="stat-icon app-tint-blue"><CalendarDays size={14} /></span>
          </div>
          <strong>8</strong>
          <p>09–11 October · 3 still upcoming</p>
        </article>
        <article className="stat-card">
          <div className="stat-card-top">
            <span>Not yet applied</span>
            <span className="stat-icon amber"><Clock3 size={14} /></span>
          </div>
          <strong>24</strong>
          <p>Follow-up needed with advisers</p>
        </article>
      </section>

      <section className="panel application-register-panel">
        <div className="panel-heading application-register-heading">
          <div>
            <h2>Application register</h2>
            <p>
              {applications.length} applications recorded · students may have more than one
              application
            </p>
          </div>
          <button className="text-action application-export" type="button" onClick={exportCSV}>
            Export register <Download size={12} />
          </button>
        </div>

        <div className="application-filters">
          <label className="search-field application-search">
            <Search size={14} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetPage();
              }}
              placeholder="Search student or organization"
              aria-label="Search student or organization"
            />
          </label>
          <label className="application-select">
            <select
              value={program}
              onChange={(event) => {
                setProgram(event.target.value);
                resetPage();
              }}
              aria-label="Filter by program"
            >
              <option>All programs</option>
              <option>BSIT</option>
              <option>BSBA</option>
              <option>BSHM</option>
            </select>
            <ChevronDown size={12} />
          </label>
          <label className="application-select">
            <select
              value={section}
              onChange={(event) => {
                setSection(event.target.value);
                resetPage();
              }}
              aria-label="Filter by section"
            >
              <option>All sections</option>
              <option>BSIT 4A</option>
              <option>BSIT 4B</option>
              <option>BSBA 4A</option>
              <option>BSBA 4B</option>
              <option>BSHM 4B</option>
            </select>
            <ChevronDown size={12} />
          </label>
          <label className="application-select">
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                resetPage();
              }}
              aria-label="Filter by application status"
            >
              <option>All statuses</option>
              <option>Closed</option>
              <option>Interview set</option>
              <option>Withdrawn</option>
              <option>Under review</option>
            </select>
            <ChevronDown size={12} />
          </label>
          <label className="application-select">
            <select
              value={dateFilter}
              onChange={(event) => {
                setDateFilter(event.target.value);
                resetPage();
              }}
              aria-label="Filter by application date"
            >
              <option>Applied: all dates</option>
              <option>Applied: last 7 days</option>
              <option>Applied: last 30 days</option>
              <option>Applied: this semester</option>
            </select>
            <ChevronDown size={12} />
          </label>
        </div>

        <div className="application-table-wrap">
          <table className="register-table application-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Organization</th>
                <th>Position</th>
                <th>Date applied</th>
                <th>Interview date</th>
                <th>Application status</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((application) => (
                <tr
                  key={application.id}
                  className={selectedId === application.id ? "is-selected" : ""}
                  tabIndex={0}
                  onClick={() => selectApplication(application)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectApplication(application);
                    }
                  }}
                >
                  <td>
                    <strong>{application.student}</strong>
                    <small>
                      {application.studentId} · {application.program} {application.section}
                    </small>
                  </td>
                  <td>{application.organization}</td>
                  <td>{application.position}</td>
                  <td className="application-date-cell">{application.dateApplied}</td>
                  <td className="application-date-cell">{application.interviewDate}</td>
                  <td>
                    <span
                      className={`application-pill app-status-${statusTone(
                        application.applicationStatus
                      )}`}
                    >
                      {application.applicationStatus}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`application-pill app-decision-${decisionTone(
                        application.decision
                      )}`}
                    >
                      {application.decision}
                    </span>
                  </td>
                </tr>
              ))}
              {!visible.length && (
                <tr>
                  <td colSpan={7} className="application-empty-state">
                    No applications match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="register-pagination application-pagination">
          <span>
            Showing {filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0}–
            {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} applications
          </span>
          <div>
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft size={13} /> Previous
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                type="button"
                className={`application-page-number ${number === safePage ? "is-current" : ""}`}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}
            <button
              type="button"
              disabled={safePage >= pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>

      <div className="application-history-wrap">
        <section
          className={`panel application-history-panel ${historyAnimating ? "is-switching" : ""}`}
        >
          <div className="application-history-heading">
            <div>
              <h2>Application history</h2>
              <p className="application-history-sub">
                <strong>{historyName}</strong> · {historyCount} application
                {historyCount === 1 ? "" : "s"} this semester
              </p>
            </div>
            <button
              className="text-action"
              type="button"
              onClick={() =>
                notify(
                  "Application history",
                  `Full history for ${historyName} is ready to connect to the student records API.`,
                  "info"
                )
              }
            >
              Full history <ArrowUpRight size={12} />
            </button>
          </div>
          <ol className="application-timeline">
            {historyItems.map((item) => (
              <li className="application-timeline-item" key={`${item.title}-${item.date}`}>
                <span className={`application-timeline-icon ${item.kind}`}>
                  {item.kind === "success" && <CheckCircle2 size={12} />}
                  {item.kind === "interview" && <Clock3 size={12} />}
                  {item.kind === "submitted" && <Send size={12} />}
                  {item.kind === "closed" && <BriefcaseBusiness size={12} />}
                </span>
                <div className="application-timeline-copy">
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <span className="application-timeline-date">{item.date}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <p className="application-footnote">
        Application decisions are recorded by students and college staff. Organization contacts do
        not need platform accounts.
      </p>

      {modalOpen && (
        <div
          className="application-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <section
            className="application-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-modal-title"
          >
            <div className="application-modal-heading">
              <div>
                <span>PLACEMENT MANAGEMENT</span>
                <h2 id="application-modal-title">Record application</h2>
                <p>Log a new internship application for a student.</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveApplication}>
              <div className="application-form-grid">
                <label className="application-form-field application-form-wide">
                  <span>Student name *</span>
                  <input
                    required
                    value={form.student}
                    onChange={(event) => updateForm("student", event.target.value)}
                    placeholder="Enter student's full name"
                  />
                </label>
                <label className="application-form-field">
                  <span>Student ID *</span>
                  <input
                    required
                    value={form.studentId}
                    onChange={(event) => updateForm("studentId", event.target.value)}
                    placeholder="e.g. 2026-0101"
                  />
                </label>
                <label className="application-form-field">
                  <span>Program</span>
                  <select
                    value={form.program}
                    onChange={(event) => updateForm("program", event.target.value)}
                  >
                    <option>BSIT</option>
                    <option>BSBA</option>
                    <option>BSHM</option>
                  </select>
                </label>
                <label className="application-form-field">
                  <span>Section</span>
                  <input
                    value={form.section}
                    onChange={(event) => updateForm("section", event.target.value)}
                  />
                </label>
                <label className="application-form-field">
                  <span>Date applied</span>
                  <input
                    value={form.dateApplied}
                    onChange={(event) => updateForm("dateApplied", event.target.value)}
                    placeholder="e.g. 09 Oct 2026"
                  />
                </label>
                <label className="application-form-field application-form-wide">
                  <span>Organization *</span>
                  <input
                    required
                    value={form.organization}
                    onChange={(event) => updateForm("organization", event.target.value)}
                    placeholder="Host organization"
                  />
                </label>
                <label className="application-form-field application-form-wide">
                  <span>Position *</span>
                  <input
                    required
                    value={form.position}
                    onChange={(event) => updateForm("position", event.target.value)}
                    placeholder="e.g. Software Dev. Intern"
                  />
                </label>
                <label className="application-form-field">
                  <span>Interview date</span>
                  <input
                    value={form.interviewDate}
                    onChange={(event) => updateForm("interviewDate", event.target.value)}
                    placeholder="Optional"
                  />
                </label>
                <label className="application-form-field">
                  <span>Application status</span>
                  <select
                    value={form.applicationStatus}
                    onChange={(event) =>
                      updateForm("applicationStatus", event.target.value as ApplicationStatus)
                    }
                  >
                    <option>Closed</option>
                    <option>Interview set</option>
                    <option>Withdrawn</option>
                    <option>Under review</option>
                  </select>
                </label>
                <label className="application-form-field">
                  <span>Decision</span>
                  <select
                    value={form.decision}
                    onChange={(event) => updateForm("decision", event.target.value as Decision)}
                  >
                    <option>Accepted</option>
                    <option>Rejected</option>
                    <option>Pending</option>
                    <option>No decision</option>
                  </select>
                </label>
              </div>
              <div className="application-modal-actions">
                <button
                  className="application-cancel-button"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="application-primary-button" type="submit">
                  Save application
                </button>
              </div>
              <p className="application-form-note">
                Demo only: changes are held in page state and are not saved to a database.
              </p>
            </form>
          </section>
        </div>
      )}

      {toast && (
        <div
          className={`interaction-toast ${toast.kind === "success" ? "toast-success" : "toast-info"}`}
          role="status"
        >
          <span className="toast-icon">
            {toast.kind === "success" ? <CheckCircle2 size={16} /> : <Activity size={16} />}
          </span>
          <span className="toast-copy">
            <strong>{toast.title}</strong>
            {toast.detail && <small>{toast.detail}</small>}
          </span>
          <button aria-label="Dismiss notification" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}
    </section>
  );
}
