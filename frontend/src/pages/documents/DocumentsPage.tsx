import { useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CircleX,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileClock,
  FileText,
  FileUp,
  FileWarning,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import "./DocumentsPage.css";

type DocumentStatus = "Verified" | "Rejected" | "Missing" | "Pending review";
type HistoryTone = "success" | "danger" | "neutral";

type Requirement = {
  id: string;
  name: string;
  status: DocumentStatus;
  fileName?: string;
  fileSize?: string;
  submittedOn?: string;
  remarks?: string;
  submittedBy?: string;
  submittedRole?: string;
  reviewedBy?: string;
  reviewedOn?: string;
};

type HistoryEvent = {
  title: string;
  detail: string;
  tone: HistoryTone;
};

type StudentDocuments = {
  id: string;
  name: string;
  program: string;
  section: string;
  requirements: Requirement[];
  history: HistoryEvent[];
};

type ToastMessage = {
  title: string;
  detail?: string;
  kind?: "success" | "info";
};

const catalog = {
  application: "Internship application form",
  endorsement: "College endorsement letter",
  agreement: "Memorandum of agreement",
  acceptance: "Organization acceptance letter",
  resume: "Internship resume copy",
  medical: "Medical certificate",
  consent: "Parent / guardian consent",
  learning: "Internship learning plan",
} as const;

type RequirementKey = keyof typeof catalog;

function requirement(
  id: RequirementKey,
  overrides: Partial<Omit<Requirement, "id" | "name">>
): Requirement {
  return { id, name: catalog[id], status: "Missing", ...overrides };
}

const initialStudents: StudentDocuments[] = [
  {
    id: "2023-0307",
    name: "Marciano Salazar",
    program: "BSIT",
    section: "4B",
    requirements: [
      requirement("application", {
        status: "Verified",
        fileName: "application-form.pdf",
        fileSize: "112 KB",
        submittedOn: "29 Sep 2026",
      }),
      requirement("endorsement", {
        status: "Verified",
        fileName: "college-endorsement.pdf",
        fileSize: "88 KB",
        submittedOn: "29 Sep 2026",
      }),
      requirement("agreement", {
        status: "Verified",
        fileName: "memorandum-of-agreement.pdf",
        fileSize: "1.2 MB",
        submittedOn: "01 Oct 2026",
      }),
      requirement("acceptance", {
        status: "Verified",
        fileName: "org-acceptance-letter.pdf",
        fileSize: "96 KB",
        submittedOn: "01 Oct 2026",
      }),
      requirement("resume", {
        status: "Verified",
        fileName: "internship-resume.pdf",
        fileSize: "204 KB",
        submittedOn: "02 Oct 2026",
      }),
      requirement("medical", {
        status: "Rejected",
        fileName: "medical_salazar_r1.pdf",
        fileSize: "40 KB",
        submittedOn: "07 Oct 2026",
        submittedBy: "Marciano Salazar",
        submittedRole: "Student",
        reviewedBy: "John Paul Carrillo Zara",
        reviewedOn: "09 Oct, 8:35 AM",
        remarks:
          "The physician's signature and license number are missing. Please upload a signed medical certificate issued within the last 30 days.",
      }),
      requirement("consent", {
        status: "Missing",
        remarks:
          "No parent or guardian consent has been submitted yet. Upload the signed consent form to complete this requirement.",
      }),
      requirement("learning", {
        status: "Pending review",
        fileName: "learning-plan-draft.pdf",
        fileSize: "228 KB",
        submittedOn: "08 Oct 2026",
        submittedBy: "Marciano Salazar",
        submittedRole: "Student",
        reviewedBy: "Queued for coordinator review",
        reviewedOn: "08 Oct, 4:45 PM",
        remarks:
          "Check the learning objectives and host-supervisor approval before verifying this requirement.",
      }),
    ],
    history: [
      {
        title: "Endorsement letter verified",
        detail: "Elena Villanueva · 01 Oct, 10:20 AM",
        tone: "success",
      },
      {
        title: "Medical certificate rejected",
        detail: "John Paul Carrillo · 07 Oct, 8:15 AM",
        tone: "danger",
      },
      {
        title: "Learning plan submitted",
        detail: "Marciano Salazar · 08 Oct, 9:05 AM",
        tone: "neutral",
      },
      {
        title: "Resume copy verified",
        detail: "Elena Villanueva · 02 Oct, 3:12 PM",
        tone: "success",
      },
    ],
  },
  {
    id: "2023-0147",
    name: "Karl Sebastian Cuerdo",
    program: "BSIT",
    section: "4A",
    requirements: [
      requirement("application", {
        status: "Verified",
        fileName: "application-cuerdo.pdf",
        fileSize: "118 KB",
        submittedOn: "04 Sep 2026",
      }),
      requirement("endorsement", {
        status: "Verified",
        fileName: "endorsement-cuerdo.pdf",
        fileSize: "82 KB",
        submittedOn: "05 Sep 2026",
      }),
      requirement("agreement", {
        status: "Verified",
        fileName: "moa-brightpath.pdf",
        fileSize: "1.4 MB",
        submittedOn: "09 Sep 2026",
      }),
      requirement("acceptance", {
        status: "Verified",
        fileName: "brightpath-acceptance.pdf",
        fileSize: "102 KB",
        submittedOn: "09 Sep 2026",
      }),
      requirement("resume", {
        status: "Verified",
        fileName: "resume-cuerdo.pdf",
        fileSize: "196 KB",
        submittedOn: "06 Sep 2026",
      }),
      requirement("medical", {
        status: "Pending review",
        fileName: "medical_cuerdo.pdf",
        fileSize: "56 KB",
        submittedOn: "08 Oct 2026",
        submittedBy: "Karl Sebastian Cuerdo",
        submittedRole: "Student",
        reviewedBy: "Queued for coordinator review",
        reviewedOn: "08 Oct, 3:20 PM",
        remarks:
          "Confirm the clinic seal and the physician's license number before approving this certificate.",
      }),
      requirement("consent", {
        status: "Verified",
        fileName: "guardian-consent-cuerdo.pdf",
        fileSize: "74 KB",
        submittedOn: "06 Sep 2026",
      }),
      requirement("learning", {
        status: "Verified",
        fileName: "learning-plan-cuerdo.pdf",
        fileSize: "212 KB",
        submittedOn: "10 Sep 2026",
      }),
    ],
    history: [
      {
        title: "Learning plan verified",
        detail: "Elena Villanueva · 11 Sep, 9:40 AM",
        tone: "success",
      },
      {
        title: "Medical certificate submitted",
        detail: "Karl Sebastian Cuerdo · 08 Oct, 3:20 PM",
        tone: "neutral",
      },
      {
        title: "Organization acceptance letter verified",
        detail: "Elena Villanueva · 09 Sep, 2:10 PM",
        tone: "success",
      },
      {
        title: "Memorandum of agreement verified",
        detail: "John Paul Carrillo · 09 Sep, 11:05 AM",
        tone: "success",
      },
    ],
  },
  {
    id: "2023-0214",
    name: "Janell Tagayun",
    program: "BSBA",
    section: "4A",
    requirements: [
      requirement("application", {
        status: "Verified",
        fileName: "application-tagayun.pdf",
        fileSize: "108 KB",
        submittedOn: "13 Aug 2026",
      }),
      requirement("endorsement", {
        status: "Verified",
        fileName: "endorsement-tagayun.pdf",
        fileSize: "79 KB",
        submittedOn: "14 Aug 2026",
      }),
      requirement("agreement", {
        status: "Verified",
        fileName: "moa-nexa.pdf",
        fileSize: "1.1 MB",
        submittedOn: "20 Aug 2026",
      }),
      requirement("acceptance", {
        status: "Verified",
        fileName: "nexa-acceptance.pdf",
        fileSize: "91 KB",
        submittedOn: "20 Aug 2026",
      }),
      requirement("resume", {
        status: "Verified",
        fileName: "resume-tagayun.pdf",
        fileSize: "188 KB",
        submittedOn: "15 Aug 2026",
      }),
      requirement("medical", {
        status: "Verified",
        fileName: "medical_tagayun.pdf",
        fileSize: "48 KB",
        submittedOn: "22 Aug 2026",
      }),
      requirement("consent", {
        status: "Verified",
        fileName: "guardian-consent-tagayun.pdf",
        fileSize: "68 KB",
        submittedOn: "16 Aug 2026",
      }),
      requirement("learning", {
        status: "Verified",
        fileName: "learning-plan-tagayun.pdf",
        fileSize: "231 KB",
        submittedOn: "25 Aug 2026",
      }),
    ],
    history: [
      {
        title: "All requirements verified",
        detail: "John Paul Carrillo · 26 Aug, 10:30 AM",
        tone: "success",
      },
      {
        title: "Medical certificate verified",
        detail: "Elena Villanueva · 24 Aug, 1:15 PM",
        tone: "success",
      },
      {
        title: "Learning plan verified",
        detail: "Elena Villanueva · 26 Aug, 8:50 AM",
        tone: "success",
      },
      {
        title: "Parent consent verified",
        detail: "Elena Villanueva · 17 Aug, 9:10 AM",
        tone: "success",
      },
    ],
  },
  {
    id: "2023-0182",
    name: "Agapito Banda Jr.",
    program: "BSIT",
    section: "4B",
    requirements: [
      requirement("application", {
        status: "Verified",
        fileName: "application-banda.pdf",
        fileSize: "121 KB",
        submittedOn: "16 Sep 2026",
      }),
      requirement("endorsement", {
        status: "Verified",
        fileName: "endorsement-banda.pdf",
        fileSize: "85 KB",
        submittedOn: "17 Sep 2026",
      }),
      requirement("agreement", {
        status: "Rejected",
        fileName: "moa-vertex-r1.pdf",
        fileSize: "1.3 MB",
        submittedOn: "02 Oct 2026",
        submittedBy: "Agapito Banda Jr.",
        submittedRole: "Student",
        reviewedBy: "John Paul Carrillo Zara",
        reviewedOn: "08 Oct, 2:40 PM",
        remarks:
          "The host supervisor's signature is missing on page 3. Request a corrected copy before the placement visit.",
      }),
      requirement("acceptance", {
        status: "Verified",
        fileName: "vertex-acceptance.pdf",
        fileSize: "94 KB",
        submittedOn: "18 Sep 2026",
      }),
      requirement("resume", {
        status: "Verified",
        fileName: "resume-banda.pdf",
        fileSize: "201 KB",
        submittedOn: "18 Sep 2026",
      }),
      requirement("medical", {
        status: "Missing",
        remarks:
          "No medical certificate has been submitted yet. A copy issued within the last 30 days is required.",
      }),
      requirement("consent", {
        status: "Missing",
        remarks:
          "The parent or guardian consent form has not been submitted. Send a reminder to the student.",
      }),
      requirement("learning", {
        status: "Pending review",
        fileName: "learning-plan-banda.pdf",
        fileSize: "219 KB",
        submittedOn: "07 Oct 2026",
        submittedBy: "Agapito Banda Jr.",
        submittedRole: "Student",
        reviewedBy: "Queued for coordinator review",
        reviewedOn: "07 Oct, 5:05 PM",
        remarks:
          "Check that the learning objectives match the IT support placement and that the host supervisor approved the plan.",
      }),
    ],
    history: [
      {
        title: "Memorandum of agreement rejected",
        detail: "John Paul Carrillo · 08 Oct, 2:40 PM",
        tone: "danger",
      },
      {
        title: "Medical certificate reminder sent",
        detail: "Elena Villanueva · 07 Oct, 9:25 AM",
        tone: "neutral",
      },
      {
        title: "Learning plan submitted",
        detail: "Agapito Banda Jr. · 07 Oct, 5:05 PM",
        tone: "neutral",
      },
      {
        title: "Internship resume copy verified",
        detail: "Elena Villanueva · 19 Sep, 10:15 AM",
        tone: "success",
      },
    ],
  },
  {
    id: "2023-0261",
    name: "Jillian Formezala",
    program: "BSBA",
    section: "4B",
    requirements: [
      requirement("application", {
        status: "Verified",
        fileName: "application-formezala.pdf",
        fileSize: "115 KB",
        submittedOn: "21 Sep 2026",
      }),
      requirement("endorsement", {
        status: "Verified",
        fileName: "endorsement-formezala.pdf",
        fileSize: "81 KB",
        submittedOn: "22 Sep 2026",
      }),
      requirement("agreement", {
        status: "Verified",
        fileName: "moa-summit.pdf",
        fileSize: "1.2 MB",
        submittedOn: "28 Sep 2026",
      }),
      requirement("acceptance", {
        status: "Verified",
        fileName: "summit-acceptance.pdf",
        fileSize: "89 KB",
        submittedOn: "28 Sep 2026",
      }),
      requirement("resume", {
        status: "Verified",
        fileName: "resume-formezala.pdf",
        fileSize: "192 KB",
        submittedOn: "23 Sep 2026",
      }),
      requirement("medical", {
        status: "Verified",
        fileName: "medical_formezala.pdf",
        fileSize: "52 KB",
        submittedOn: "30 Sep 2026",
      }),
      requirement("consent", {
        status: "Missing",
        remarks:
          "No signed guardian consent is on file. The student must upload it before the internship begins.",
      }),
      requirement("learning", {
        status: "Pending review",
        fileName: "learning-plan-formezala.pdf",
        fileSize: "225 KB",
        submittedOn: "08 Oct 2026",
        submittedBy: "Jillian Formezala",
        submittedRole: "Student",
        reviewedBy: "Queued for coordinator review",
        reviewedOn: "08 Oct, 1:30 PM",
        remarks:
          "Review the operations objectives and confirm the host supervisor's approval before verifying.",
      }),
    ],
    history: [
      {
        title: "Medical certificate verified",
        detail: "Elena Villanueva · 01 Oct, 9:05 AM",
        tone: "success",
      },
      {
        title: "Learning plan submitted",
        detail: "Jillian Formezala · 08 Oct, 1:30 PM",
        tone: "neutral",
      },
      {
        title: "Parent consent requested",
        detail: "John Paul Carrillo · 08 Oct, 1:45 PM",
        tone: "neutral",
      },
      {
        title: "Organization acceptance letter verified",
        detail: "Elena Villanueva · 29 Sep, 10:40 AM",
        tone: "success",
      },
    ],
  },
];

const stats = [
  {
    label: "Awaiting verification",
    value: "12",
    detail: "College-wide review queue",
    icon: FileClock,
    tone: "doc-violet",
  },
  {
    label: "Missing documents",
    value: "39",
    detail: "Send reminders before placement",
    icon: FileWarning,
    tone: "doc-peach",
  },
  {
    label: "Rejected submissions",
    value: "9",
    detail: "Corrected copies are required",
    icon: CircleX,
    tone: "doc-rose",
  },
  {
    label: "Incomplete requirements",
    value: "38",
    detail: "Unique students · categories overlap",
    icon: ShieldAlert,
    tone: "doc-sun",
  },
];

const statusLabels: Record<DocumentStatus, string> = {
  Verified: "Verified",
  Rejected: "Rejected",
  Missing: "Missing",
  "Pending review": "Pending review",
};

const statusTones: Record<DocumentStatus, string> = {
  Verified: "doc-status-verified",
  Rejected: "doc-status-rejected",
  Missing: "doc-status-missing",
  "Pending review": "doc-status-pending",
};

function verifiedTotal(student: StudentDocuments) {
  return student.requirements.filter((item) => item.status === "Verified").length;
}

function attentionPhrase(status: DocumentStatus) {
  if (status === "Rejected") return "rejected";
  if (status === "Missing") return "missing";
  if (status === "Pending review") return "awaiting review";
  return "verified";
}

function defaultDocumentId(student: StudentDocuments) {
  return (
    student.requirements.find((item) => item.status === "Rejected")?.id ??
    student.requirements.find((item) => item.status === "Missing")?.id ??
    student.requirements.find((item) => item.status === "Pending review")?.id ??
    student.requirements[0]?.id ??
    ""
  );
}

function reviewMatches(student: StudentDocuments, filter: string) {
  if (filter === "Awaiting verification") {
    return student.requirements.some((item) => item.status === "Pending review");
  }
  if (filter === "Rejected submissions") {
    return student.requirements.some((item) => item.status === "Rejected");
  }
  if (filter === "Incomplete requirements") {
    return student.requirements.some((item) => item.status === "Missing");
  }
  if (filter === "Needs review") {
    return student.requirements.some((item) => item.status !== "Verified");
  }
  return true;
}

export default function DocumentsPage() {
  const [students, setStudents] = useState<StudentDocuments[]>(initialStudents);
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudents[0].id);
  const [selectedDocumentId, setSelectedDocumentId] = useState("medical");
  const [switching, setSwitching] = useState(false);
  const [documentSwitching, setDocumentSwitching] = useState(false);
  const [query, setQuery] = useState("");
  const [program, setProgram] = useState("All programs");
  const [section, setSection] = useState("All sections");
  const [reviewFilter, setReviewFilter] = useState("Needs review");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const switchTimer = useRef<number | undefined>(undefined);
  const documentSwitchTimer = useRef<number | undefined>(undefined);
  const toastTimer = useRef<number | undefined>(undefined);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) ?? students[0];
  const selectedDocument =
    selectedStudent.requirements.find((item) => item.id === selectedDocumentId) ??
    selectedStudent.requirements[0];
  const verified = verifiedTotal(selectedStudent);
  const total = selectedStudent.requirements.length;
  const attentionDocuments = selectedStudent.requirements.filter(
    (item) => item.status !== "Verified"
  );
  const nextDocument = selectedStudent.requirements.find(
    (item) => item.status === "Pending review"
  );

  const studentOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = students.filter((student) => {
      const searchable = [
        student.name,
        student.id,
        student.program,
        student.section,
        ...student.requirements.map((item) => `${item.name} ${item.fileName ?? ""}`),
      ]
        .join(" ")
        .toLowerCase();
      return (
        (!normalized || searchable.includes(normalized)) &&
        (program === "All programs" || student.program === program) &&
        (section === "All sections" || `${student.program} ${student.section}` === section) &&
        reviewMatches(student, reviewFilter)
      );
    });
    if (!matches.some((student) => student.id === selectedStudent.id)) {
      return [selectedStudent, ...matches];
    }
    return matches;
  }, [students, selectedStudent, query, program, section, reviewFilter]);

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
    if (documentSwitchTimer.current !== undefined) {
      window.clearTimeout(documentSwitchTimer.current);
      documentSwitchTimer.current = undefined;
    }
    setDocumentSwitching(false);
    setSwitching(false);
    setSelectedStudentId(nextStudent.id);
    setSelectedDocumentId(defaultDocumentId(nextStudent));
    switchTimer.current = window.setTimeout(() => {
      setSwitching(true);
      switchTimer.current = window.setTimeout(() => {
        setSwitching(false);
        switchTimer.current = undefined;
      }, 850);
    }, 25);
  }

  function selectDocument(documentId: string) {
    if (documentId === selectedDocument?.id) return;
    if (documentSwitchTimer.current !== undefined) {
      window.clearTimeout(documentSwitchTimer.current);
    }
    setDocumentSwitching(false);
    setSelectedDocumentId(documentId);
    documentSwitchTimer.current = window.setTimeout(() => {
      setDocumentSwitching(true);
      documentSwitchTimer.current = window.setTimeout(() => {
        setDocumentSwitching(false);
        documentSwitchTimer.current = undefined;
      }, 850);
    }, 25);
  }

  function updateRequirement(
    studentId: string,
    documentId: string,
    patch: Partial<Requirement>,
    historyEvent?: HistoryEvent
  ) {
    setStudents((current) =>
      current.map((student) => {
        if (student.id !== studentId) return student;
        return {
          ...student,
          requirements: student.requirements.map((item) =>
            item.id === documentId ? { ...item, ...patch } : item
          ),
          history: historyEvent
            ? [historyEvent, ...student.history].slice(0, 4)
            : student.history,
        };
      })
    );
  }

  function openFile(name?: string) {
    notify(
      "File preview",
      `${name ?? selectedDocument.name} is ready to open. Connect the document storage API to preview the uploaded copy.`,
      "info"
    );
  }

  function requestReplacement() {
    notify(
      "Replacement requested",
      `${selectedStudent.name} will be asked to upload a new copy of ${selectedDocument.name.toLowerCase()}.`,
      "success"
    );
  }

  function saveRemarks() {
    notify("Remarks saved", `Notes for ${selectedDocument.name.toLowerCase()} were saved for this session.`, "success");
  }

  function handleRowAction(item: Requirement) {
    selectDocument(item.id);
    if (item.status === "Missing") {
      uploadInputRef.current?.click();
      return;
    }
    if (item.status === "Verified") {
      openFile(item.fileName);
      return;
    }
    notify("Document selected", `${item.name} is open in the review panel.`, "info");
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const scopedDocument = selectedDocument;
    updateRequirement(selectedStudent.id, scopedDocument.id, {
      status: "Pending review",
      fileName: file.name,
      fileSize: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      submittedOn: "09 Oct 2026",
      submittedBy: selectedStudent.name,
      submittedRole: "Student",
      reviewedBy: "Queued for coordinator review",
      reviewedOn: "09 Oct, 10:04 AM",
    });
    notify("Submission added", `${file.name} was attached to ${scopedDocument.name.toLowerCase()} for this session.`, "success");
    event.target.value = "";
  }

  function verifyNextDocument() {
    if (!nextDocument) return;
    updateRequirement(
      selectedStudent.id,
      nextDocument.id,
      {
        status: "Verified",
        reviewedBy: "John Paul Carrillo Zara",
        reviewedOn: "09 Oct, 10:04 AM",
        remarks: "Document verified by the coordinator. No further action is required.",
      },
      {
        title: `${nextDocument.name} verified`,
        detail: "John Paul Carrillo · 09 Oct, 10:04 AM",
        tone: "success",
      }
    );
    notify("Document verified", `${nextDocument.name} is now verified for ${selectedStudent.name}.`, "success");
  }

  function returnNextDocument() {
    if (!nextDocument) return;
    updateRequirement(
      selectedStudent.id,
      nextDocument.id,
      {
        status: "Rejected",
        reviewedBy: "John Paul Carrillo Zara",
        reviewedOn: "09 Oct, 10:04 AM",
        remarks:
          "The submitted copy needs corrections before it can be verified. Please review the highlighted requirement and resubmit.",
      },
      {
        title: `${nextDocument.name} returned`,
        detail: "John Paul Carrillo · 09 Oct, 10:04 AM",
        tone: "danger",
      }
    );
    notify("Document returned", `${nextDocument.name} was returned to ${selectedStudent.name} for correction.`, "info");
  }

  function handlePrimaryAction() {
    if (selectedDocument.status === "Missing") {
      uploadInputRef.current?.click();
      return;
    }
    if (selectedDocument.status === "Rejected") {
      requestReplacement();
      return;
    }
    if (selectedDocument.status === "Pending review") {
      updateRequirement(
        selectedStudent.id,
        selectedDocument.id,
        {
          status: "Verified",
          reviewedBy: "John Paul Carrillo Zara",
          reviewedOn: "09 Oct, 10:04 AM",
          remarks: "Document verified by the coordinator. No further action is required.",
        },
        {
          title: `${selectedDocument.name} verified`,
          detail: "John Paul Carrillo · 09 Oct, 10:04 AM",
          tone: "success",
        }
      );
      notify("Document verified", `${selectedDocument.name} is now verified.`, "success");
      return;
    }
    openFile(selectedDocument.fileName);
  }

  function handleSecondaryAction() {
    if (selectedDocument.status === "Pending review") {
      updateRequirement(
        selectedStudent.id,
        selectedDocument.id,
        {
          status: "Rejected",
          reviewedBy: "John Paul Carrillo Zara",
          reviewedOn: "09 Oct, 10:04 AM",
          remarks:
            "The submitted copy needs corrections before it can be verified. Please review the highlighted requirement and resubmit.",
        },
        {
          title: `${selectedDocument.name} returned`,
          detail: "John Paul Carrillo · 09 Oct, 10:04 AM",
          tone: "danger",
        }
      );
      notify("Document returned", `${selectedDocument.name} was returned for correction.`, "info");
      return;
    }
    saveRemarks();
  }

  const primaryLabel =
    selectedDocument.status === "Missing"
      ? "Upload document"
      : selectedDocument.status === "Rejected"
      ? "Request new copy"
      : selectedDocument.status === "Pending review"
      ? "Verify document"
      : "Download copy";
  const secondaryLabel =
    selectedDocument.status === "Pending review" ? "Request changes" : "Save remarks";
  const bannerClass =
    selectedDocument.status === "Rejected"
      ? "doc-banner-rejected"
      : selectedDocument.status === "Missing"
      ? "doc-banner-missing"
      : selectedDocument.status === "Pending review"
      ? "doc-banner-pending"
      : "doc-banner-verified";
  const bannerCopy =
    selectedDocument.status === "Rejected"
      ? "Rejected: requirement not met"
      : selectedDocument.status === "Missing"
      ? "Missing: no submission on record"
      : selectedDocument.status === "Pending review"
      ? "Pending review: waiting for coordinator action"
      : "Verified: requirement complete";
  const remarks =
    selectedDocument.remarks ??
    (selectedDocument.status === "Verified"
      ? "All details match the college requirement and this submission is complete."
      : "Check the submitted copy against the requirement before recording a decision.");

  return (
    <section className="documents-page">
      <header className="documents-page-heading">
        <div>
          <h1>Internship document management</h1>
          <p>Review submissions, resolve missing requirements and keep a clear verification trail.</p>
        </div>
        <button
          className="documents-upload-button"
          type="button"
          onClick={() => uploadInputRef.current?.click()}
        >
          <Upload size={14} />
          Upload document
        </button>
      </header>

      <section className="stat-grid documents-stat-grid" aria-label="Document summary">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className="stat-card" key={stat.label}>
              <div className="stat-card-top">
                <span>{stat.label}</span>
                <span className={`stat-icon ${stat.tone}`}>
                  <Icon size={15} />
                </span>
              </div>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </article>
          );
        })}
      </section>

      <div className="documents-filter-bar">
        <label className="documents-search-box">
          <Search size={14} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search student or document"
            aria-label="Search student or document"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={13} />
            </button>
          )}
        </label>
        <label className="documents-select-wrap">
          <select
            value={program}
            onChange={(event) => setProgram(event.target.value)}
            aria-label="Filter by program"
          >
            <option>All programs</option>
            <option>BSIT</option>
            <option>BSBA</option>
            <option>BSHM</option>
          </select>
          <ChevronDown size={12} />
        </label>
        <label className="documents-select-wrap">
          <select
            value={section}
            onChange={(event) => setSection(event.target.value)}
            aria-label="Filter by section"
          >
            <option>All sections</option>
            {["BSIT 4A", "BSIT 4B", "BSBA 4A", "BSBA 4B", "BSHM 4B"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <ChevronDown size={12} />
        </label>
        <label className="documents-select-wrap">
          <select
            value={reviewFilter}
            onChange={(event) => setReviewFilter(event.target.value)}
            aria-label="Filter by review state"
          >
            <option>Needs review</option>
            <option>All review states</option>
            <option>Awaiting verification</option>
            <option>Rejected submissions</option>
            <option>Incomplete requirements</option>
          </select>
          <ChevronDown size={12} />
        </label>
        <label className="documents-select-wrap documents-student-select">
          <select
            value={selectedStudent.id}
            onChange={(event) => selectStudent(event.target.value)}
            aria-label="Select a student"
          >
            {studentOptions.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} · {student.program} {student.section}
              </option>
            ))}
            {!studentOptions.length && <option value={selectedStudent.id}>No matching students</option>}
          </select>
          <ChevronDown size={12} />
        </label>
      </div>

      <div key={selectedStudent.id} className={`documents-workspace ${switching ? "is-switching" : ""}`}>
        <section className="document-panel document-checklist-panel">
          <div className="checklist-heading">
            <div>
              <h2>Required document checklist</h2>
              <p>
                {selectedStudent.name} · {selectedStudent.id} · {selectedStudent.program}{" "}
                {selectedStudent.section}
              </p>
            </div>
            <div className="checklist-progress">
              <strong>
                {verified} of {total} verified
              </strong>
              <span className="checklist-progress-track">
                <i style={{ width: `${Math.round((verified / Math.max(1, total)) * 100)}%` }} />
              </span>
            </div>
          </div>

          {attentionDocuments.length > 0 ? (
            <div className="checklist-alert">
              <TriangleAlert size={15} />
              <div>
                <strong>
                  {attentionDocuments.length} requirement
                  {attentionDocuments.length === 1 ? "" : "s"} need
                  {attentionDocuments.length === 1 ? "s" : ""} attention before 16 October
                </strong>
                <span>
                  {attentionDocuments
                    .slice(0, 3)
                    .map((item) => `${item.name} ${attentionPhrase(item.status)}`)
                    .join("; ")}
                  .
                </span>
              </div>
            </div>
          ) : (
            <div className="checklist-clear">
              <CheckCircle2 size={15} />
              <div>
                <strong>All requirements are verified</strong>
                <span>No outstanding actions for this student this semester.</span>
              </div>
            </div>
          )}

          <div className="checklist-table-wrap">
            <table className="checklist-table">
              <thead>
                <tr>
                  <th>Required document</th>
                  <th>Submitted</th>
                  <th>Verification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.requirements.map((item) => (
                  <tr
                    key={item.id}
                    className={selectedDocument.id === item.id ? "is-selected" : ""}
                    onClick={() => selectDocument(item.id)}
                  >
                    <td>
                      <div className="checklist-document-cell">
                        <span className="checklist-file-icon">
                          <FileText size={13} />
                        </span>
                        <span>
                          <strong>{item.name}</strong>
                          <small>
                            {item.fileName
                              ? `${item.fileName}${item.fileSize ? ` · ${item.fileSize}` : ""}`
                              : "Not yet submitted"}
                          </small>
                        </span>
                      </div>
                    </td>
                    <td className="checklist-date-cell">{item.submittedOn ?? "—"}</td>
                    <td>
                      <span className={`doc-status ${statusTones[item.status]}`}>
                        {statusLabels[item.status]}
                      </span>
                    </td>
                    <td>
                      <button
                        className="checklist-action"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRowAction(item);
                        }}
                      >
                        {item.status === "Verified" ? (
                          <>
                            <Eye size={11} /> View
                          </>
                        ) : item.status === "Missing" ? (
                          <>
                            <Upload size={11} /> Upload
                          </>
                        ) : (
                          <>
                            <Eye size={11} /> Review
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="checklist-upload-strip">
            <div>
              <span className="checklist-upload-icon">
                <FileUp size={15} />
              </span>
              <span>
                <strong>Add or replace a student submission</strong>
                <small>PDF, JPG or PNG · up to 10 MB per file</small>
              </span>
            </div>
            <button type="button" onClick={() => uploadInputRef.current?.click()}>
              Choose file
            </button>
          </div>
          <p className="checklist-footnote">
            Required checklist · {selectedStudent.program} internship · v2025.1 · maintained by the
            college.
          </p>
        </section>

        <aside className={`documents-side-column ${documentSwitching ? "is-switching" : ""}`}>
          <section className="document-panel document-preview-card">
            <div className="document-card-heading">
              <div>
                <h2>{selectedDocument.name}</h2>
                <p>Selected document · {selectedStudent.name}</p>
              </div>
              <button
                type="button"
                className="document-open-link"
                onClick={() => openFile(selectedDocument.fileName)}
              >
                Open file <ArrowUpRight size={11} />
              </button>
            </div>

            <div className={`document-banner ${bannerClass}`}>
              {selectedDocument.status === "Verified" ? (
                <CheckCircle2 size={13} />
              ) : selectedDocument.status === "Pending review" ? (
                <Clock3 size={13} />
              ) : (
                <TriangleAlert size={13} />
              )}
              {bannerCopy}
            </div>

            {selectedDocument.fileName ? (
              <div className="document-file-row">
                <span className={`document-file-badge ${statusTones[selectedDocument.status]}`}>
                  <FileText size={15} />
                </span>
                <div>
                  <strong>{selectedDocument.fileName}</strong>
                  <small>
                    Uploaded {selectedDocument.submittedOn ?? "—"}
                    {selectedDocument.submittedOn ? ", 2:10 PM" : ""}
                  </small>
                </div>
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() =>
                    notify(
                      "Attachment selected",
                      `${selectedDocument.fileName} is attached to this requirement.`,
                      "info"
                    )
                  }
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="document-file-empty">
                <span className="document-file-badge doc-status-missing">
                  <FileText size={15} />
                </span>
                <div>
                  <strong>No file uploaded</strong>
                  <small>Awaiting a student submission</small>
                </div>
                <button type="button" onClick={() => uploadInputRef.current?.click()}>
                  Add file
                </button>
              </div>
            )}

            <div className="document-meta-block">
              <span>Submitted by</span>
              <strong>
                {selectedDocument.submittedBy ?? (selectedDocument.status === "Missing" ? "Awaiting submission" : selectedStudent.name)}
              </strong>
              <small>
                {selectedDocument.submittedRole ??
                  (selectedDocument.status === "Missing" ? "No submission on record" : "Student")}
              </small>
            </div>
            <div className="document-meta-block">
              <span>Reviewed by</span>
              <strong>{selectedDocument.reviewedBy ?? "Not yet reviewed"}</strong>
              <small>{selectedDocument.reviewedOn ?? "Reviewer will be assigned automatically"}</small>
            </div>

            <div className="document-remarks">
              <span>Coordinator remarks</span>
              <p>{remarks}</p>
              <small>Visible to the student and assigned faculty adviser.</small>
            </div>

            <div className="document-card-actions">
              <button className="document-primary-button" type="button" onClick={handlePrimaryAction}>
                {selectedDocument.status === "Rejected" ? (
                  <>
                    <RotateCcw size={12} /> {primaryLabel}
                  </>
                ) : selectedDocument.status === "Pending review" ? (
                  <>
                    <FileCheck2 size={12} /> {primaryLabel}
                  </>
                ) : selectedDocument.status === "Missing" ? (
                  <>
                    <Upload size={12} /> {primaryLabel}
                  </>
                ) : (
                  <>
                    <Download size={12} /> {primaryLabel}
                  </>
                )}
              </button>
              <button className="document-secondary-button" type="button" onClick={handleSecondaryAction}>
                {secondaryLabel}
              </button>
            </div>
          </section>

          <section className="document-panel document-next-card">
            <div className="document-simple-heading">
              <h2>Next for verification</h2>
              <p>
                {nextDocument
                  ? `${nextDocument.name} · submitted ${nextDocument.submittedOn ?? "—"}`
                  : "No submissions are waiting for review"}
              </p>
            </div>

            {nextDocument ? (
              <>
                <div className="document-next-file">
                  <span className="document-file-badge doc-status-pending">
                    <FileText size={15} />
                  </span>
                  <span>
                    <strong>{nextDocument.fileName ?? nextDocument.name}</strong>
                    <small>{nextDocument.fileSize ?? "Attached submission"}</small>
                  </span>
                  <span className="doc-status doc-status-pending">Pending</span>
                </div>
                <p className="document-next-copy">
                  Check the learning objectives and host-supervisor approval before verifying this
                  requirement.
                </p>
                <div className="document-card-actions">
                  <button className="document-primary-button" type="button" onClick={verifyNextDocument}>
                    Verify document
                  </button>
                  <button className="document-secondary-button" type="button" onClick={returnNextDocument}>
                    Return
                  </button>
                </div>
              </>
            ) : (
              <div className="document-next-empty">
                <ShieldCheck size={18} />
                <span>
                  <strong>Review queue is clear</strong>
                  <small>Every submitted document for this student has a recorded decision.</small>
                </span>
              </div>
            )}
          </section>

          <section className="document-panel document-history-card">
            <div className="document-simple-heading">
              <h2>Verification history</h2>
              <p>Latest events for {selectedStudent.name.split(/\s+/)[0]}'s requirements</p>
            </div>
            <ol className="document-history-list">
              {selectedStudent.history.map((event) => (
                <li className="document-history-item" key={`${event.title}-${event.detail}`}>
                  <span className={`document-history-icon ${event.tone}`}>
                    {event.tone === "success" ? (
                      <CheckCircle2 size={11} />
                    ) : event.tone === "danger" ? (
                      <CircleX size={11} />
                    ) : (
                      <Clock3 size={11} />
                    )}
                  </span>
                  <span>
                    <strong>{event.title}</strong>
                    <small>{event.detail}</small>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      <input
        ref={uploadInputRef}
        className="documents-hidden-input"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelected}
      />

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
