import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Plus,
  Search,
  X,
} from "lucide-react";
import "./ProgressMonitoringPage.css";

type AttendanceState = "Present" | "Late" | "Absent";
type ReviewState = "Approved" | "Pending" | "Rejected";
type ProgressFlag = "On task" | "Behind plan" | "Ahead of schedule";

type AttendanceDay = {
  date: string;
  timeIn: string;
  timeOut: string;
  hours: string;
  attendance: AttendanceState;
  review: ReviewState;
};

type WeekOption = {
  id: string;
  label: string;
  heading: string;
  days: AttendanceDay[];
};

type Accomplishment = {
  id: string;
  weekId: string;
  heading: string;
  approvedHours: number;
  summary: string;
  outcome?: string;
  fileName?: string;
  attachments?: number;
};

type AdviserRemark = {
  author: string;
  initials: string;
  lastEdited: string;
  text: string;
  followUp?: string;
};

type ProgressStudent = {
  id: string;
  name: string;
  initials: string;
  program: string;
  section: string;
  status: string;
  flag: ProgressFlag;
  role: string;
  organization: string;
  requiredHours: number;
  completedHours: number;
  startDate: string;
  expectedCompletion: string;
  weeklyTarget: number;
  adviser: string;
  adviserInitials: string;
  remarks: AdviserRemark;
  accomplishments: Accomplishment[];
};

type ToastMessage = {
  title: string;
  detail?: string;
  kind?: "success" | "info";
};

type EntryForm = {
  studentId: string;
  weekId: string;
  date: string;
  hours: string;
  outcome: string;
};

const weeks: WeekOption[] = [
  {
    id: "week-8",
    label: "Week 8 · 05–08 Oct",
    heading: "Week 8 · 05–08 October",
    days: [
      { date: "05 Oct · Mon", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "06 Oct · Tue", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "07 Oct · Wed", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "08 Oct · Thu", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "09 Oct · Fri", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
    ],
  },
  {
    id: "week-7",
    label: "Week 7 · 28 Sep–02 Oct",
    heading: "Week 7 · 28 September–02 October",
    days: [
      { date: "28 Sep · Mon", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "29 Sep · Tue", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "30 Sep · Wed", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "01 Oct · Thu", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "02 Oct · Fri", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
    ],
  },
  {
    id: "week-6",
    label: "Week 6 · 21–25 Sep",
    heading: "Week 6 · 21–25 September",
    days: [
      { date: "21 Sep · Mon", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "22 Sep · Tue", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "23 Sep · Wed", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "24 Sep · Thu", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
      { date: "25 Sep · Fri", timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "8.0 h", attendance: "Present", review: "Approved" },
    ],
  },
];

const initialStudents: ProgressStudent[] = [
  {
    id: "2023-0147",
    name: "Sofia Reyes",
    initials: "SR",
    program: "BSIT",
    section: "4A",
    status: "Interning",
    flag: "On task",
    role: "Software Development Intern",
    organization: "BrightPath Technologies",
    requiredHours: 480,
    completedHours: 320,
    startDate: "17 Aug 2026",
    expectedCompletion: "06 Nov 2026",
    weeklyTarget: 40,
    adviser: "Dr. Marco Lim",
    adviserInitials: "ML",
    remarks: {
      author: "Dr. Marco Lim",
      initials: "ML",
      lastEdited: "08 Oct 2026",
      text: "Sofia is progressing well and meets the weekly hour target. Her testing work is becoming more independent. Continue documenting outcomes, not just tasks.",
      followUp: "Finalize the internship learning plan verification before the midterm review on 16 October.",
    },
    accomplishments: [
      {
        id: "sofia-week-8",
        weekId: "week-8",
        heading: "Week 8 · 08 Oct",
        approvedHours: 40,
        summary:
          "Implemented login assignment in the support portal, wrote 12 integration tests and resolved 4 QA issues with the engineering team.",
        fileName: "week08_report.pdf",
        attachments: 2,
        outcome: "API validation and defect triage",
      },
      {
        id: "sofia-week-7",
        weekId: "week-7",
        heading: "Week 7 · 28 Sep–02 Oct",
        approvedHours: 40,
        summary:
          "Built REST endpoints for the knowledge base and documented request validation. Presented a feature demo to the host supervisor.",
        fileName: "week07_report.pdf",
        attachments: 1,
        outcome: "Endpoint implementation and request validation",
      },
      {
        id: "sofia-week-6",
        weekId: "week-6",
        heading: "Week 6 · 24 Sep",
        approvedHours: 40,
        summary:
          "Completed the onboarding checklist, joined the release planning session and audited the support portal component library.",
        fileName: "week06_report.pdf",
        attachments: 1,
        outcome: "Component audit and release planning",
      },
    ],
  },
  {
    id: "2023-0307",
    name: "Marciano Salazar",
    initials: "MS",
    program: "BSIT",
    section: "4B",
    status: "Interning",
    flag: "Behind plan",
    role: "Quality Assurance Intern",
    organization: "Orbit Solutions",
    requiredHours: 480,
    completedHours: 246,
    startDate: "24 Aug 2026",
    expectedCompletion: "13 Nov 2026",
    weeklyTarget: 40,
    adviser: "Prof. Liza Santos",
    adviserInitials: "LS",
    remarks: {
      author: "Prof. Liza Santos",
      initials: "LS",
      lastEdited: "07 Oct 2026",
      text: "Marciano is completing meaningful QA work, but his approved hours are behind the weekly target. Coordinate with the host supervisor so attendance entries are reviewed daily.",
      followUp: "Recover at least 8 approved hours this week and upload the supervisor evaluation for week 8.",
    },
    accomplishments: [
      {
        id: "marciano-week-8",
        weekId: "week-8",
        heading: "Week 8 · 08 Oct",
        approvedHours: 32,
        summary:
          "Documented 18 regression test cases for the client dashboard and reproduced three defects reported by the support team.",
        fileName: "week08_report.pdf",
        attachments: 1,
        outcome: "Regression testing and defect reproduction",
      },
      {
        id: "marciano-week-7",
        weekId: "week-7",
        heading: "Week 7 · 02 Oct",
        approvedHours: 36,
        summary:
          "Prepared test data for the billing module and reviewed the accessibility checklist with the QA lead.",
        fileName: "week07_report.pdf",
        attachments: 1,
        outcome: "Test data preparation and accessibility review",
      },
    ],
  },
  {
    id: "2023-0214",
    name: "Janell Tagayun",
    initials: "JT",
    program: "BSBA",
    section: "4A",
    status: "Interning",
    flag: "On task",
    role: "Operations Intern",
    organization: "Nexa Digital Studio",
    requiredHours: 400,
    completedHours: 216,
    startDate: "01 Sep 2026",
    expectedCompletion: "20 Nov 2026",
    weeklyTarget: 40,
    adviser: "Dr. Marco Lim",
    adviserInitials: "ML",
    remarks: {
      author: "Dr. Marco Lim",
      initials: "ML",
      lastEdited: "08 Oct 2026",
      text: "Janell is meeting the weekly target and has taken ownership of the operations tracker. Encourage her to document process improvements alongside completed tasks.",
      followUp: "Ask Janell to upload the updated operations tracker for the week 9 review.",
    },
    accomplishments: [
      {
        id: "janell-week-8",
        weekId: "week-8",
        heading: "Week 8 · 08 Oct",
        approvedHours: 40,
        summary:
          "Updated the operations tracker for three client projects and coordinated the weekly resource allocation meeting.",
        fileName: "week08_report.pdf",
        attachments: 2,
        outcome: "Resource coordination and project tracking",
      },
      {
        id: "janell-week-7",
        weekId: "week-7",
        heading: "Week 7 · 02 Oct",
        approvedHours: 40,
        summary:
          "Mapped the onboarding workflow and prepared a summary of bottlenecks for the operations team.",
        fileName: "week07_report.pdf",
        attachments: 1,
        outcome: "Workflow mapping and process documentation",
      },
    ],
  },
  {
    id: "2023-0182",
    name: "Agapito Banda Jr.",
    initials: "AB",
    program: "BSIT",
    section: "4B",
    status: "Interning",
    flag: "Behind plan",
    role: "IT Support Intern",
    organization: "Vertex Systems",
    requiredHours: 480,
    completedHours: 240,
    startDate: "24 Aug 2026",
    expectedCompletion: "27 Nov 2026",
    weeklyTarget: 40,
    adviser: "Dr. Marco Lim",
    adviserInitials: "ML",
    remarks: {
      author: "Dr. Marco Lim",
      initials: "ML",
      lastEdited: "06 Oct 2026",
      text: "Agapito continues to handle support tickets well. His approved hours need closer monitoring because two attendance entries are still pending supervisor review.",
      followUp: "Follow up on the pending attendance entries and confirm the week 8 supervisor sign-off.",
    },
    accomplishments: [
      {
        id: "agapito-week-8",
        weekId: "week-8",
        heading: "Week 8 · 08 Oct",
        approvedHours: 28,
        summary:
          "Resolved 24 helpdesk tickets and documented the laptop imaging procedure used by the support team.",
        fileName: "week08_report.pdf",
        attachments: 1,
        outcome: "Ticket resolution and procedure documentation",
      },
      {
        id: "agapito-week-7",
        weekId: "week-7",
        heading: "Week 7 · 02 Oct",
        approvedHours: 36,
        summary:
          "Assisted with network troubleshooting at the Laguna branch and updated the asset inventory.",
        fileName: "week07_report.pdf",
        attachments: 1,
        outcome: "Network troubleshooting and asset management",
      },
    ],
  },
];

function summaryTone(flag: ProgressFlag) {
  if (flag === "Behind plan") return "behind";
  if (flag === "Ahead of schedule") return "ahead";
  return "on-task";
}

function statusTone(status: string) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function ProgressMonitoringPage() {
  const [students, setStudents] = useState<ProgressStudent[]>(initialStudents);
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudents[0].id);
  const [selectedWeekId, setSelectedWeekId] = useState(weeks[0].id);
  const [query, setQuery] = useState("");
  const [program, setProgram] = useState("BSIT");
  const [detailsSwitching, setDetailsSwitching] = useState(false);
  const [weekRefreshing, setWeekRefreshing] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [remarkOpen, setRemarkOpen] = useState(false);
  const [remarkDraft, setRemarkDraft] = useState("");
  const [entryForm, setEntryForm] = useState<EntryForm>({
    studentId: initialStudents[0].id,
    weekId: weeks[0].id,
    date: "09 Oct 2026",
    hours: "8",
    outcome: "",
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const switchTimer = useRef<number | undefined>(undefined);
  const weekTimer = useRef<number | undefined>(undefined);
  const toastTimer = useRef<number | undefined>(undefined);

  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) ?? students[0];
  const selectedWeek = weeks.find((week) => week.id === selectedWeekId) ?? weeks[0];
  const remainingHours = Math.max(0, selectedStudent.requiredHours - selectedStudent.completedHours);
  const progress = Math.round(
    (selectedStudent.completedHours / Math.max(1, selectedStudent.requiredHours)) * 1000
  ) / 10;
  const weeksRemaining = Math.max(
    0,
    Math.ceil(remainingHours / Math.max(1, selectedStudent.weeklyTarget))
  );
  const weekTotal = selectedWeek.days.reduce(
    (total, day) => total + Number.parseFloat(day.hours),
    0
  );
  const weeklyAccomplishments = selectedStudent.accomplishments.filter(
    (item) => item.weekId === selectedWeek.id
  );

  const studentOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = students.filter((student) => {
      const searchable = `${student.name} ${student.id} ${student.program} ${student.role} ${student.organization}`.toLowerCase();
      return (
        (!normalized || searchable.includes(normalized)) &&
        (program === "All programs" || student.program === program)
      );
    });
    if (!matches.some((student) => student.id === selectedStudent.id)) {
      return [selectedStudent, ...matches];
    }
    return matches;
  }, [students, selectedStudent, query, program]);

  function notify(title: string, detail?: string, kind: "success" | "info" = "info") {
    if (toastTimer.current !== undefined) window.clearTimeout(toastTimer.current);
    setToast({ title, detail, kind });
    toastTimer.current = window.setTimeout(() => setToast(null), 3400);
  }

  function selectStudent(studentId: string) {
    if (studentId === selectedStudent.id) return;
    const nextStudent = students.find((student) => student.id === studentId);
    if (!nextStudent) return;
    if (switchTimer.current !== undefined) window.clearTimeout(switchTimer.current);
    if (weekTimer.current !== undefined) {
      window.clearTimeout(weekTimer.current);
      weekTimer.current = undefined;
    }
    setWeekRefreshing(false);
    setDetailsSwitching(false);
    setSelectedStudentId(nextStudent.id);
    switchTimer.current = window.setTimeout(() => {
      setDetailsSwitching(true);
      switchTimer.current = window.setTimeout(() => {
        setDetailsSwitching(false);
        switchTimer.current = undefined;
      }, 850);
    }, 25);
  }

  function changeProgram(value: string) {
    setProgram(value);
    const matches = students.filter(
      (student) => value === "All programs" || student.program === value
    );
    if (matches.length && !matches.some((student) => student.id === selectedStudent.id)) {
      selectStudent(matches[0].id);
    }
  }

  function changeWeek(weekId: string) {
    if (weekId === selectedWeek.id) return;
    if (weekTimer.current !== undefined) window.clearTimeout(weekTimer.current);
    setWeekRefreshing(false);
    setSelectedWeekId(weekId);
    weekTimer.current = window.setTimeout(() => {
      setWeekRefreshing(true);
      weekTimer.current = window.setTimeout(() => {
        setWeekRefreshing(false);
        weekTimer.current = undefined;
      }, 600);
    }, 25);
  }

  function focusBehindPlan() {
    const behind = students.filter((student) => student.flag === "Behind plan");
    if (!behind.length) {
      notify("Students behind plan", "No students are currently behind their weekly target.", "info");
      return;
    }
    setProgram("All programs");
    selectStudent(behind[0].id);
    notify(
      "15 students behind plan",
      `Showing ${behind[0].name}. Use the student selector to review every flagged record.`,
      "info"
    );
  }

  function updateEntry<K extends keyof EntryForm>(key: K, value: EntryForm[K]) {
    setEntryForm((current) => ({ ...current, [key]: value }));
  }

  function openEntryModal() {
    setEntryForm({
      studentId: selectedStudent.id,
      weekId: selectedWeek.id,
      date: "09 Oct 2026",
      hours: "8",
      outcome: "",
    });
    setEntryOpen(true);
  }

  function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const hours = Number(entryForm.hours);
    if (!Number.isFinite(hours) || hours <= 0) return;
    const targetWeek = weeks.find((week) => week.id === entryForm.weekId) ?? weeks[0];
    const weekName = targetWeek.label.split(" · ")[0];
    const accomplishment: Accomplishment = {
      id: `entry-${Date.now()}`,
      weekId: targetWeek.id,
      heading: `${weekName} · ${entryForm.date}`,
      approvedHours: hours,
      summary: entryForm.outcome.trim() || "Progress entry recorded for this week.",
      outcome: entryForm.outcome.trim() ? "Learning outcome logged by the coordinator" : undefined,
    };
    setStudents((current) =>
      current.map((student) =>
        student.id === entryForm.studentId
          ? {
              ...student,
              completedHours: Math.min(student.requiredHours, student.completedHours + hours),
              accomplishments: [accomplishment, ...student.accomplishments],
            }
          : student
      )
    );
    if (entryForm.studentId !== selectedStudent.id) {
      selectStudent(entryForm.studentId);
    }
    if (entryForm.weekId !== selectedWeek.id) {
      setSelectedWeekId(entryForm.weekId);
    }
    setEntryOpen(false);
    notify(
      "Progress entry added",
      `${hours} approved hours were recorded for ${students.find((student) => student.id === entryForm.studentId)?.name ?? "the student"}.`,
      "success"
    );
  }

  function openRemarkModal() {
    setRemarkDraft(selectedStudent.remarks.text);
    setRemarkOpen(true);
  }

  function saveRemark(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!remarkDraft.trim()) return;
    setStudents((current) =>
      current.map((student) =>
        student.id === selectedStudent.id
          ? {
              ...student,
              remarks: {
                ...student.remarks,
                author: selectedStudent.adviser,
                initials: selectedStudent.adviserInitials,
                lastEdited: "09 Oct 2026",
                text: remarkDraft.trim(),
              },
            }
          : student
      )
    );
    setRemarkOpen(false);
    notify("Adviser remark saved", `The remark for ${selectedStudent.name} was updated for this session.`, "success");
  }

  function exportLog() {
    const rows = selectedWeek.days.map((day) => [
      day.date,
      day.timeIn,
      day.timeOut,
      day.hours,
      day.attendance,
      day.review,
    ]);
    const csv = [
      ["Date", "Time in", "Time out", "Hours", "Attendance", "Review"],
      ...rows,
    ]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${selectedStudent.id}-${selectedWeek.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    notify(
      "Attendance log exported",
      `${selectedWeek.label} for ${selectedStudent.name} was downloaded as a CSV.`,
      "success"
    );
  }

  function showAllEntries() {
    notify(
      "Weekly accomplishments",
      `Full accomplishment history for ${selectedStudent.name} is ready to connect to the monitoring API.`,
      "info"
    );
  }

  return (
    <section className="progress-page">
      <header className="progress-page-heading">
        <div>
          <h1>Internship progress monitoring</h1>
          <p>Track verified hours, attendance and learning outcomes with faculty advisers.</p>
        </div>
        <button className="progress-primary-button" type="button" onClick={openEntryModal}>
          <Plus size={14} />
          Add progress entry
        </button>
      </header>

      <div className="progress-filter-bar">
        <label className="progress-search-box">
          <Search size={14} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search student"
            aria-label="Search student"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={13} />
            </button>
          )}
        </label>
        <label className="progress-select-wrap">
          <select
            value={program}
            onChange={(event) => changeProgram(event.target.value)}
            aria-label="Filter by program"
          >
            <option>All programs</option>
            <option>BSIT</option>
            <option>BSBA</option>
            <option>BSHM</option>
          </select>
          <ChevronDown size={12} />
        </label>
        <label className="progress-select-wrap progress-student-select">
          <select
            value={selectedStudent.id}
            onChange={(event) => selectStudent(event.target.value)}
            aria-label="Select a student"
          >
            {studentOptions.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} · {student.id}
              </option>
            ))}
          </select>
          <ChevronDown size={12} />
        </label>
        <label className="progress-select-wrap">
          <select
            value={selectedWeek.id}
            onChange={(event) => changeWeek(event.target.value)}
            aria-label="Select a week"
          >
            {weeks.map((week) => (
              <option key={week.id} value={week.id}>
                {week.label}
              </option>
            ))}
          </select>
          <ChevronDown size={12} />
        </label>
        <button className="progress-behind-link" type="button" onClick={focusBehindPlan}>
          15 students behind plan <ArrowUpRight size={11} />
        </button>
      </div>

      <div
        key={selectedStudent.id}
        className={`progress-details ${detailsSwitching ? "is-switching" : ""}`}
      >
        <section className="panel progress-summary-card">
          <div className="progress-summary-top">
            <span className="progress-avatar">{selectedStudent.initials}</span>
            <div className="progress-summary-copy">
              <div className="progress-name-line">
                <h2>{selectedStudent.name}</h2>
                <span className={`progress-status status-${statusTone(selectedStudent.status)}`}>
                  {selectedStudent.status}
                </span>
                <span className={`progress-flag ${summaryTone(selectedStudent.flag)}`}>
                  {selectedStudent.flag}
                </span>
              </div>
              <p>
                {selectedStudent.program} {selectedStudent.section} · {selectedStudent.role} ·{" "}
                {selectedStudent.organization}
              </p>
            </div>
          </div>

          <div className="progress-summary-stats">
            <div className="progress-metric-stat">
              <span>Required hours</span>
              <strong>{selectedStudent.requiredHours}</strong>
            </div>
            <div className="progress-metric-stat">
              <span>Completed hours</span>
              <strong>{selectedStudent.completedHours}</strong>
            </div>
            <div className="progress-metric-stat">
              <span>Remaining hours</span>
              <strong>{remainingHours}</strong>
            </div>
            <div className="progress-metric-meta">
              <span>Internship start date</span>
              <strong>{selectedStudent.startDate}</strong>
            </div>
            <div className="progress-metric-meta">
              <span>Expected completion</span>
              <strong>{selectedStudent.expectedCompletion}</strong>
            </div>
            <div className="progress-metric-meta">
              <span>Weekly target</span>
              <strong>
                {selectedStudent.weeklyTarget} hours · 8 hours / day
              </strong>
            </div>
            <div className="progress-metric-meta">
              <span>Assigned faculty adviser</span>
              <strong>{selectedStudent.adviser}</strong>
            </div>
          </div>

          <div className="progress-meter-wrap">
            <div
              className="progress-meter"
              aria-label={`${progress}% of required internship hours completed`}
            >
              <span style={{ width: `${Math.min(100, progress)}%` }} />
            </div>
            <div className="progress-meter-footer">
              <span>{progress}% complete</span>
              <span>
                Approved hours only · {weeksRemaining} week{weeksRemaining === 1 ? "" : "s"} remaining
              </span>
            </div>
          </div>
        </section>

        <section className="panel progress-remarks-card">
          <div className="progress-card-heading">
            <div>
              <h2>Adviser remarks</h2>
              <p>Last edited · {selectedStudent.remarks.lastEdited}</p>
            </div>
          </div>
          <div className="progress-remark-author">
            <span>{selectedStudent.remarks.initials}</span>
            <div>
              <strong>{selectedStudent.remarks.author}</strong>
              <small>Faculty adviser</small>
            </div>
          </div>
          <blockquote className="progress-remark-quote">{selectedStudent.remarks.text}</blockquote>
          {selectedStudent.remarks.followUp && (
            <div className="progress-follow-up">
              <Clock3 size={14} />
              <div>
                <strong>One follow-up</strong>
                <span>{selectedStudent.remarks.followUp}</span>
              </div>
            </div>
          )}
          <button className="progress-text-action" type="button" onClick={openRemarkModal}>
            Add adviser remark <Plus size={11} />
          </button>
        </section>

        <div className={`progress-week-grid ${weekRefreshing ? "is-refreshing" : ""}`}>
          <section className="panel progress-attendance-card">
            <div className="progress-card-heading">
              <div>
                <h2>Attendance log</h2>
                <p>{selectedWeek.heading}</p>
              </div>
              <button className="progress-card-link" type="button" onClick={exportLog}>
                Export log <ArrowUpRight size={11} />
              </button>
            </div>
            <div className="progress-attendance-table-wrap">
              <table className="progress-attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time in</th>
                    <th>Time out</th>
                    <th>Hours</th>
                    <th>Attendance</th>
                    <th>Review</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedWeek.days.map((day) => (
                    <tr key={day.date}>
                      <td className="progress-date-cell">{day.date}</td>
                      <td>{day.timeIn}</td>
                      <td>{day.timeOut}</td>
                      <td>{day.hours}</td>
                      <td>
                        <span
                          className={`progress-attendance-pill attendance-${day.attendance.toLowerCase()}`}
                        >
                          {day.attendance}
                        </span>
                      </td>
                      <td>
                        <span className={`progress-review-pill review-${day.review.toLowerCase()}`}>
                          {day.review}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="progress-attendance-footer">
              <span>4-hour break excluded daily · approved by {selectedStudent.adviser}</span>
              <strong>Week total: {weekTotal} h</strong>
            </div>
          </section>

          <section className="panel progress-accomplishments-card">
            <div className="progress-card-heading">
              <div>
                <h2>Weekly accomplishments</h2>
                <p>Learning outcomes logged against approved hours</p>
              </div>
              <button className="progress-card-link" type="button" onClick={showAllEntries}>
                All entries <ArrowUpRight size={11} />
              </button>
            </div>
            <div className="progress-accomplishment-list">
              {weeklyAccomplishments.map((item) => (
                <article className="progress-accomplishment" key={item.id}>
                  <div className="progress-accomplishment-heading">
                    <strong>{item.heading}</strong>
                    <span className="progress-approved-pill">{item.approvedHours} h approved</span>
                  </div>
                  <p>{item.summary}</p>
                  {item.fileName && (
                    <button
                      className="progress-attachment"
                      type="button"
                      onClick={() =>
                        notify("Attachment selected", `${item.fileName} is ready to open.`, "info")
                      }
                    >
                      <FileText size={11} />
                      {item.fileName}
                      {item.attachments ? ` · ${item.attachments} attachments` : ""}
                    </button>
                  )}
                  {item.outcome && (
                    <span className="progress-outcome">
                      <CheckCircle2 size={11} /> {item.outcome}
                    </span>
                  )}
                </article>
              ))}
              {!weeklyAccomplishments.length && (
                <div className="progress-empty-state">
                  No accomplishments are logged for {selectedWeek.label.split(" · ")[0]} yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {entryOpen && (
        <div
          className="progress-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEntryOpen(false);
          }}
        >
          <section
            className="progress-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="progress-entry-title"
          >
            <div className="progress-modal-heading">
              <div>
                <span>PROGRESS MONITORING</span>
                <h2 id="progress-entry-title">Add progress entry</h2>
                <p>Record approved hours and a learning outcome for a student.</p>
              </div>
              <button type="button" onClick={() => setEntryOpen(false)} aria-label="Close dialog">
                <X size={17} />
              </button>
            </div>
            <form onSubmit={saveEntry}>
              <div className="progress-form-grid">
                <label className="progress-form-field progress-form-wide">
                  <span>Student</span>
                  <select
                    value={entryForm.studentId}
                    onChange={(event) => updateEntry("studentId", event.target.value)}
                  >
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} · {student.program} {student.section}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="progress-form-field">
                  <span>Week</span>
                  <select
                    value={entryForm.weekId}
                    onChange={(event) => updateEntry("weekId", event.target.value)}
                  >
                    {weeks.map((week) => (
                      <option key={week.id} value={week.id}>
                        {week.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="progress-form-field">
                  <span>Entry date</span>
                  <input
                    value={entryForm.date}
                    onChange={(event) => updateEntry("date", event.target.value)}
                    placeholder="e.g. 09 Oct 2026"
                  />
                </label>
                <label className="progress-form-field">
                  <span>Approved hours *</span>
                  <input
                    required
                    min="1"
                    type="number"
                    value={entryForm.hours}
                    onChange={(event) => updateEntry("hours", event.target.value)}
                  />
                </label>
                <label className="progress-form-field progress-form-wide">
                  <span>Learning outcome / accomplishment</span>
                  <textarea
                    required
                    rows={4}
                    value={entryForm.outcome}
                    onChange={(event) => updateEntry("outcome", event.target.value)}
                    placeholder="Describe the tasks completed and the outcome demonstrated."
                  />
                </label>
              </div>
              <div className="progress-modal-actions">
                <button className="progress-cancel-button" type="button" onClick={() => setEntryOpen(false)}>
                  Cancel
                </button>
                <button className="progress-primary-button" type="submit">
                  Save progress entry
                </button>
              </div>
              <p className="progress-form-note">
                Demo only: entries update the page state and are not saved to a database.
              </p>
            </form>
          </section>
        </div>
      )}

      {remarkOpen && (
        <div
          className="progress-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setRemarkOpen(false);
          }}
        >
          <section
            className="progress-modal progress-remark-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="progress-remark-title"
          >
            <div className="progress-modal-heading">
              <div>
                <span>ADVISER REVIEW</span>
                <h2 id="progress-remark-title">Add adviser remark</h2>
                <p>Update the adviser notes for {selectedStudent.name}.</p>
              </div>
              <button type="button" onClick={() => setRemarkOpen(false)} aria-label="Close dialog">
                <X size={17} />
              </button>
            </div>
            <form onSubmit={saveRemark}>
              <label className="progress-form-field">
                <span>Adviser remark</span>
                <textarea
                  required
                  rows={5}
                  value={remarkDraft}
                  onChange={(event) => setRemarkDraft(event.target.value)}
                  placeholder="Summarize the student's progress for this period."
                />
              </label>
              <div className="progress-modal-actions">
                <button className="progress-cancel-button" type="button" onClick={() => setRemarkOpen(false)}>
                  Cancel
                </button>
                <button className="progress-primary-button" type="submit">
                  Save remark
                </button>
              </div>
              <p className="progress-form-note">
                Demo only: remarks are held in page state and are not saved to a database.
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
