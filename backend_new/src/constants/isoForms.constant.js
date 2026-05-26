export const ISO_ROLE_FORM_MAP = {
  faculty: ["105", "109", "117", "118", "126", "158", "159", "172", "182", "189", "194", "195", "196", "655-A", "655-B", "656"],
  classTeacher: ["102", "174"],
  assistantHeadAcademics: ["103", "104", "119", "136", "184", "185", "186", "187", "188", "190", "191", "193", "197"],
  assistantHeadResearch: ["179"],
  internshipCoordinator: ["106", "107", "111", "112"],
  majorProjectCoordinator: ["108", "177", "178", "180"],
  ediCoordinator: ["108", "177", "178", "180"],
  studentActivityCoordinator: ["113", "183"],
  studentPortfolioAlumniCoordinator: ["110", "811", "812", "813", "814", "815", "816", "817", "818"],
  budgetCoordinator: ["114", "115", "116"],
  hod: ["119"],
};

export const ISO_FORM_FILES = {
  "102": "FF_102_0.xlsx",
  "103": "FF_103_1.docx",
  "104": "FF_104_0.docx",
  "105": "FF_105_0.docx",
  "106": "FF_106_0.docx",
  "107": "FF_107_0.docx",
  "108": "FF_108_0.docx",
  "109": "FF_109_0.docx",
  "110": "FF_110_0.docx",
  "111": "FF_111__0.docx",
  "112": "FF_112_0.docx",
  "113": "FF_113_0.docx",
  "114": "FF_114_0.docx",
  "115": "FF_115_0.docx",
  "116": "FF_116__0.docx",
  "117": "FF_117__0.docx",
  "118": "FF_118__0.docx",
  "119": "FF_119__0.docx",
  "120": "FF_120_0.docx",
  "126": "FF_126_0.docx",
  "136": "FF_136_0.docx",
  "158": "FF_158__0.xlsx",
  "159": "FF_159__0.xlsx",
  "160": "FF_160_0.xlsx",
  "172": "FF_172__0.xlsx",
  "174": "FF_174_0.docx",
  "177": "FF_177__0.docx",
  "178": "FF_178__0.docx",
  "179": "FF_179__0.docx",
  "180": "FF_180__0.docx",
  "182": "FF_182__0.docx",
  "184": "FF_184_0.docx",
  "185": "FF_185_0.docx",
  "186": "FF_186_0.docx",
  "187": "FF_187__0.docx",
  "188": "FF_188_0.docx",
  "189": "FF_189_0.docx",
  "190": "FF_190_0.docx",
  "191": "FF_191__0.docx",
  "193": "FF_193_0.docx",
  "194": "FF_194__0.docx",
  "195": "FF_195_0.docx",
  "196": "FF_196_0.docx",
  "197": "FF_197_0.docx",
  "08-A": "FF_08-A_1.docx",
  "100": "FF_100__0.xls",
};

export const ISO_FORM_TITLES = {
  "102": "Class Attendance Register",
  "103": "Timetable Preparation Report",
  "104": "Academic Calendar Compliance",
  "105": "Faculty Activity Report",
  "106": "Internship Offer Letter Register",
  "107": "Internship Completion Certificate Register",
  "108": "Project/Innovation Proposal",
  "109": "Faculty Self-Appraisal Form",
  "110": "Student Portfolio",
  "111": "Internship Feedback Form",
  "112": "Industry Mentor Details",
  "113": "Co-curricular Activity Report",
  "114": "Budget Proposal Form",
  "115": "Expenditure Statement",
  "116": "Budget Utilization Report",
  "117": "Course Delivery Plan",
  "118": "Course Exit Survey",
  "119": "Department Academic Review",
  "126": "Faculty Research Activity",
  "136": "Syllabus Coverage Report",
  "158": "Student Feedback Report",
  "159": "Slow/Advanced Learner Report",
  "172": "Tutorial/Extra Class Report",
  "174": "Class Teacher Activity Report",
  "177": "Project Review Report",
  "178": "Project Completion Report",
  "179": "Research Activity Report",
  "180": "Innovation & Patent Report",
  "182": "Lab Experiment Observation",
  "183": "Student Achievement Record",
  "184": "CO-PO Mapping Report",
  "185": "Program Educational Objectives Review",
  "186": "Academic Performance Analysis",
  "187": "Board of Studies Meeting Minutes",
  "188": "Academic Audit Report",
  "189": "Faculty Seminar/Workshop Report",
  "190": "Remedial Classes Report",
  "191": "University Result Analysis",
  "193": "Student Mentor Report",
  "194": "Course Outcome Attainment",
  "195": "Continuous Internal Evaluation",
  "196": "Assignment Evaluation Record",
  "197": "Industry Visit Report",
  "655-A": "Faculty Leave Application",
  "655-B": "Faculty Duty Leave Form",
  "656": "Faculty Research Publication",
  "811": "Alumni Interaction Record",
  "812": "Alumni Contact Directory",
  "813": "Alumni Event Report",
  "814": "Student Progression Record",
  "815": "Placement / Higher Study Record",
  "816": "Student Portfolio Showcase",
  "817": "Alumni Feedback Register",
  "818": "Distinguished Alumni Record",
};

const DEFAULT_FIELDS = [
  { name: "academicYear", label: "Academic Year", type: "text", required: true, placeholder: "e.g., 2024-25" },
  { name: "semester", label: "Semester", type: "select", required: true, options: ["1", "2", "3", "4", "5", "6", "7", "8"] },
  { name: "remarks", label: "Remarks / Observations", type: "textarea", required: false, placeholder: "Enter any additional remarks..." },
];

const CUSTOM_FIELDS = {
  "114": [
    { name: "department", label: "Department", type: "text", required: true },
    { name: "item", label: "Item / Material", type: "text", required: true },
    { name: "qty", label: "Quantity", type: "number", required: true },
    { name: "unit", label: "Unit (pcs / kg / L)", type: "text", required: true },
    { name: "purpose", label: "Purpose", type: "textarea", required: true },
    { name: "neededBy", label: "Required By", type: "date", required: true },
    { name: "remarks", label: "Remarks", type: "textarea", required: false },
  ],
  "116": [
    { name: "subject", label: "Subject / Course", type: "text", required: true },
    { name: "classSemester", label: "Class & Semester", type: "text", required: true },
    { name: "month", label: "Report Month", type: "month", required: true },
    { name: "students", label: "No. of Students", type: "number", required: true },
    { name: "topics", label: "Topics Covered", type: "textarea", required: true },
    { name: "activities", label: "Co-Curricular / Events", type: "textarea", required: false },
    { name: "remarks", label: "Remarks", type: "textarea", required: false },
  ],
  "117": [
    { name: "course", label: "Course Name", type: "text", required: true },
    { name: "code", label: "Course Code", type: "text", required: true },
    { name: "semester", label: "Semester", type: "select", required: true, options: ["Sem I", "Sem II", "Sem III", "Sem IV", "Sem V", "Sem VI", "Sem VII", "Sem VIII"] },
    { name: "co1", label: "CO1 Attainment (%)", type: "number", required: true },
    { name: "co2", label: "CO2 Attainment (%)", type: "number", required: true },
    { name: "co3", label: "CO3 Attainment (%)", type: "number", required: true },
    { name: "co4", label: "CO4 Attainment (%)", type: "number", required: true },
    { name: "avg", label: "Avg Attainment (%)", type: "number", required: true },
    { name: "remarks", label: "Remarks", type: "textarea", required: false },
  ],
};

const getTemplateSections = (formNo) => {
  const customFields = CUSTOM_FIELDS[formNo];
  
  // If it's a known complex form, use the section structure
  if (formNo === "114") {
    return [
      {
        id: "items",
        title: "Budget Item Details",
        type: "table",
        name: "items",
        columns: [
          { name: "item", label: "Item / Material", type: "text", required: true },
          { name: "qty", label: "Quantity", type: "number", required: true },
          { name: "unit", label: "Unit", type: "text", required: true },
          { name: "purpose", label: "Purpose", type: "text", required: true },
          { name: "neededBy", label: "Required By", type: "date", required: true },
        ]
      },
      {
        id: "dept_info",
        title: "Department Information",
        fields: [
          { name: "department", label: "Department Name", type: "text", required: true },
          { name: "academicYear", label: "Academic Year", type: "text", required: true },
        ]
      }
    ];
  }

  if (formNo === "815") {
    return [
      {
        id: "placement_section",
        title: "Placement & Higher Study Records",
        type: "table",
        name: "records",
        columns: [
          { name: "studentName", label: "Student Name", type: "text", required: true },
          { name: "type", label: "Category", type: "select", required: true, options: ["PLACEMENT", "HIGHER STUDY", "ENTREPRENEURSHIP"] },
          { name: "organization", label: "Company / University", type: "text", required: true },
          { name: "package", label: "Package (LPA) / Stipend", type: "number", required: true },
        ],
      },
    ];
  }

  if (formNo === "126") {
    return [
      {
        id: "publication_section",
        title: "Research Publication Details",
        fields: [
          { name: "paperTitle", label: "Title of Paper", type: "text", required: true },
          { name: "journalName", label: "Journal / Conference Name", type: "text", required: true },
          { name: "type", label: "Publication Type", type: "select", required: true, options: ["Journal", "Conference", "Book Chapter"] },
          { name: "issn", label: "ISSN / ISBN", type: "text", required: true },
        ]
      }
    ];
  }

  if (formNo === "180") {
    return [
      {
        id: "patent_section",
        title: "Patent / Innovation Details",
        fields: [
          { name: "patentTitle", label: "Title of Patent / Innovation", type: "text", required: true },
          { name: "appNo", label: "Application Number", type: "text", required: true },
          { name: "status", label: "Current Status", type: "select", required: true, options: ["FILED", "PUBLISHED", "GRANTED"] },
        ]
      }
    ];
  }

  // Default structure for other forms
  return [
    {
      id: "main_section",
      title: "General Information",
      fields: customFields || DEFAULT_FIELDS
    }
  ];
};

const getAssignedRoles = (formNo) =>
  Object.entries(ISO_ROLE_FORM_MAP)
    .filter(([, formNos]) => formNos.includes(formNo))
    .map(([role]) => role);

export const ISO_TEMPLATE_CATALOG = Object.keys(ISO_FORM_TITLES).map((formNo) => ({
  formNo,
  title: ISO_FORM_TITLES[formNo],
  description: `ISO responsibility-mapped form ${formNo}`,
  assignedRoles: getAssignedRoles(formNo),
  requiresHODApproval: true,
  status: "ACTIVE",
  sourceFile: ISO_FORM_FILES[formNo] || null,
  sections: getTemplateSections(formNo),
}));
