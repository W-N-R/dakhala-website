// ============================================================
// Dakhala — Enriched University Data
// Data sourced from UniCalc (unicalc.vercel.app) for authenticity
// ============================================================

export const publicUniversities = [
  {
    id: "nust",
    name: "National University of Sciences and Technology",
    shortName: "NUST",
    colorHex: "#0D3B66",
    city: "Islamabad",
    entryTest: "NUST NET",
    categories: ["engineering", "cs", "business"],
    slug: "nust",
    feePerSemester: 145000,
    educationSystems: ["FSc", "A-Levels (Immediate)", "A-Levels (Gap Year)"],
    entryTestTypes: ["University Test (NET)", "SAT", "ACT"],
    programGroups: [
      {
        groupName: "Engineering (SMME, CEME, SEECS)",
        formulas: {
          "FSc": { matric: 10, fsc: 15, test: 75 },
          "A-Levels (Immediate)": { matric: 25, fsc: 0, test: 75 },
          "A-Levels (Gap Year)": { matric: 10, fsc: 15, test: 75 }
        }
      },
      {
        groupName: "Computing & AI",
        formulas: {
          "FSc": { matric: 10, fsc: 15, test: 75 },
          "A-Levels (Immediate)": { matric: 25, fsc: 0, test: 75 },
          "A-Levels (Gap Year)": { matric: 10, fsc: 15, test: 75 }
        }
      },
      {
        groupName: "Business & Social Sciences",
        formulas: {
          "FSc": { matric: 10, fsc: 15, test: 75 },
          "A-Levels (Immediate)": { matric: 25, fsc: 0, test: 75 },
          "A-Levels (Gap Year)": { matric: 10, fsc: 15, test: 75 }
        }
      }
    ],
    formula: { matric: 10, fsc: 15, test: 75 },
    testPattern: {
      testName: "NET",
      totalMcqs: 200,
      duration: "3 hours",
      totalMarks: 200,
      subjects: [
        { name: "Mathematics", mcqs: 100 },
        { name: "Physics", mcqs: 60 },
        { name: "English", mcqs: 40 }
      ],
      tags: ["No Negative Marking", "No Calculator", "Computer Based"]
    },
    campuses: ["SEECS Islamabad", "SMME Islamabad", "CEME Rawalpindi", "MCS Rawalpindi"],
    meritData: {
      type: "rank",
      campuses: {
        "SEECS Islamabad": {
          "BS CS": { 2025: "#853", 2024: "#282", 2023: "#447" },
          "BS AI": { 2025: "#642", 2024: "#298", 2023: "#566" },
          "BS DS": { 2025: "#909", 2024: "#328", 2023: "#652" },
          "BE SE": { 2025: "#846", 2024: "#115", 2023: "#378" },
          "BE CE": { 2025: "#1226", 2024: "--", 2023: "--" },
          "BE EE": { 2025: "#1821", 2024: "#691", 2023: "#2449" }
        },
        "SMME Islamabad": {
          "BE Mechanical": { 2025: "#2355", 2024: "--", 2023: "--" },
          "BE Aerospace": { 2025: "#2526", 2024: "--", 2023: "--" }
        },
        "CEME Rawalpindi": {
          "BE Computer": { 2025: "#3260", 2024: "#1072", 2023: "#2746" },
          "BE EE": { 2025: "#5179", 2024: "#2914", 2023: "#6139" },
          "BE Mech": { 2025: "#5422", 2024: "#2980", 2023: "#6204" },
          "BE Mechatronics": { 2025: "#4144", 2024: "#1929", 2023: "#4830" }
        },
        "MCS Rawalpindi": {
          "BE EE": { 2025: "#7488", 2024: "#3432", 2023: "#7703" },
          "BE SE": { 2025: "#3409", 2024: "#819", 2023: "#1262" },
          "BE Info Security": { 2025: "#3979", 2024: "#1351", 2023: "#2988" }
        }
      }
    },
    programs: [
      { name: "Computer Science", merits: { 2023: 78.5, 2024: 80.2, 2025: 81.9 } },
      { name: "Software Engineering", merits: { 2023: 77.2, 2024: 79.1, 2025: 80.8 } },
      { name: "Electrical Engineering", merits: { 2023: 65.4, 2024: 64.0, 2025: 63.2 } },
      { name: "Mechanical Engineering", merits: { 2023: 68.1, 2024: 67.2, 2025: 66.0 } },
      { name: "Business Administration", merits: { 2023: 72.3, 2024: 73.5, 2025: 75.1 } }
    ]
  },
  {
    id: "uet-lahore",
    name: "University of Engineering and Technology",
    shortName: "UET Lahore",
    colorHex: "#8B263E",
    city: "Lahore",
    entryTest: "ECAT",
    categories: ["engineering", "cs"],
    slug: "uet-lahore",
    feePerSemester: 45000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["ECAT"],
    programGroups: [
      {
        groupName: "Engineering & CS",
        formulas: {
          "FSc": { matric: 17, fsc: 50, test: 33 },
          "A-Levels": { matric: 17, fsc: 50, test: 33 }
        }
      }
    ],
    formula: { matric: 17, fsc: 50, test: 33 },
    testPattern: {
      testName: "ECAT",
      totalMcqs: 100,
      duration: "2 hours",
      totalMarks: 400,
      subjects: [
        { name: "Mathematics", mcqs: 30 },
        { name: "Physics", mcqs: 30 },
        { name: "Chemistry", mcqs: 30 },
        { name: "English", mcqs: 10 }
      ],
      tags: ["Negative Marking", "No Calculator", "Paper Based"]
    },
    campuses: ["Lahore", "KSK"],
    meritData: {
      type: "aggregate",
      campuses: {
        "Lahore": {
          "Computer Science": { 2025: "85.83%", 2024: "83.10%", 2023: "81.20%" },
          "Cyber Security": { 2025: "81.68%", 2024: "79.20%", 2023: "77.00%" },
          "Electrical Engineering": { 2025: "80.35%", 2024: "71.50%", 2023: "72.10%" },
          "Robotics & Intelligent Systems": { 2025: "79.84%", 2024: "77.00%", 2023: "75.00%" },
          "BBA": { 2025: "70.39%", 2024: "68.00%", 2023: "65.50%" }
        },
        "KSK": {
          "Computer Science": { 2025: "77.19%", 2024: "75.00%", 2023: "73.00%" },
          "Artificial Intelligence": { 2025: "74.60%", 2024: "72.50%", 2023: "70.00%" },
          "Electrical Engineering": { 2025: "69.74%", 2024: "68.00%", 2023: "66.00%" },
          "Biomedical Engineering": { 2025: "70.09%", 2024: "68.50%", 2023: "67.00%" }
        }
      }
    },
    programs: [
      { name: "Computer Science", merits: { 2023: 81.2, 2024: 83.1, 2025: 85.83 } },
      { name: "Cyber Security", merits: { 2023: 77.0, 2024: 79.2, 2025: 81.68 } },
      { name: "Electrical Engineering", merits: { 2023: 72.1, 2024: 71.5, 2025: 80.35 } },
      { name: "Robotics & Intelligent Systems", merits: { 2023: 75.0, 2024: 77.0, 2025: 79.84 } },
      { name: "BBA", merits: { 2023: 65.5, 2024: 68.0, 2025: 70.39 } }
    ]
  },
  {
    id: "qau",
    name: "Quaid-i-Azam University",
    shortName: "QAU",
    colorHex: "#1B4332",
    city: "Islamabad",
    entryTest: "None",
    categories: ["cs", "science"],
    formula: { matric: 30, fsc: 70, test: 0 },
    slug: "qau",
    feePerSemester: 35000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: [],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 30, fsc: 70, test: 0 },
          "A-Levels": { matric: 30, fsc: 70, test: 0 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Islamabad"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 84.5, 2024: 86.0, 2025: 87.5 } },
      { name: "Physics", merits: { 2023: 78.2, 2024: 79.5, 2025: 80.1 } },
      { name: "Chemistry", merits: { 2023: 74.0, 2024: 75.1, 2025: 76.0 } },
      { name: "International Relations", merits: { 2023: 76.5, 2024: 78.0, 2025: 79.2 } }
    ]
  },
  {
    id: "gcu-lahore",
    name: "Government College University",
    shortName: "GCU Lahore",
    colorHex: "#2D6A4F",
    city: "Lahore",
    entryTest: "Entry Test",
    categories: ["cs", "arts"],
    formula: { matric: 10, fsc: 40, test: 50 },
    slug: "gcu-lahore",
    feePerSemester: 40000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["GCU Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 10, fsc: 40, test: 50 },
          "A-Levels": { matric: 10, fsc: 40, test: 50 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Lahore"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 75.2, 2024: 77.0, 2025: 78.5 } },
      { name: "English Literature", merits: { 2023: 70.1, 2024: 71.5, 2025: 72.3 } },
      { name: "Political Science", merits: { 2023: 68.0, 2024: 69.2, 2025: 70.0 } }
    ]
  },
  {
    id: "pu",
    name: "University of the Punjab",
    shortName: "Punjab Uni",
    colorHex: "#1D3557",
    city: "Lahore",
    entryTest: "PU Test",
    categories: ["engineering", "cs"],
    formula: { matric: 17, fsc: 50, test: 33 },
    slug: "punjab-uni",
    feePerSemester: 28000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["PU Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 17, fsc: 50, test: 33 },
          "A-Levels": { matric: 17, fsc: 50, test: 33 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Lahore", "Gujranwala", "Jhelum"],
    meritData: {
      type: "aggregate",
      campuses: {
        "Lahore": {
          "Computer Science": { 2025: "85.90%", 2024: "84.10%", 2023: "82.50%" },
          "Software Engineering": { 2025: "84.80%", 2024: "83.00%", 2023: "81.30%" },
          "Information Technology": { 2025: "82.80%", 2024: "81.20%", 2023: "79.50%" },
          "Law (LLB)": { 2025: "77.50%", 2024: "76.00%", 2023: "74.20%" }
        },
        "Gujranwala": {
          "BS Computer Science": { 2025: "81.77%", 2024: "79.50%", 2023: "77.20%" },
          "BS IT": { 2025: "79.17%", 2024: "77.00%", 2023: "75.00%" },
          "LLB (Hons.)": { 2025: "71.32%", 2024: "69.50%", 2023: "67.00%" },
          "BBA (Hons.)": { 2025: "55.84%", 2024: "53.00%", 2023: "51.50%" },
          "BS (Accounting & Finance)": { 2025: "55.69%", 2024: "53.20%", 2023: "51.00%" },
          "BS Commerce": { 2025: "44.29%", 2024: "42.00%", 2023: "40.00%" }
        },
        "Jhelum": {
          "BS Computer Science": { 2025: "71.88%", 2024: "69.20%", 2023: "67.00%" },
          "LLB (Hons.)": { 2025: "56.00%", 2024: "54.20%", 2023: "52.00%" },
          "BBA": { 2025: "36.89%", 2024: "35.00%", 2023: "33.00%" },
          "Accounting & Finance": { 2025: "56.36%", 2024: "54.00%", 2023: "51.50%" },
          "BS Commerce": { 2025: "34.36%", 2024: "32.50%", 2023: "30.00%" }
        }
      }
    },
    programs: [
      { name: "Computer Science", merits: { 2023: 82.5, 2024: 84.1, 2025: 85.9 } },
      { name: "Software Engineering", merits: { 2023: 81.3, 2024: 83.0, 2025: 84.8 } },
      { name: "Information Technology", merits: { 2023: 79.5, 2024: 81.2, 2025: 82.8 } },
      { name: "Law (LLB)", merits: { 2023: 74.2, 2024: 76.0, 2025: 77.5 } }
    ]
  },
  {
    id: "ned",
    name: "NED University of Engineering and Technology",
    shortName: "NED University",
    colorHex: "#5E503F",
    city: "Karachi",
    entryTest: "NED Test",
    categories: ["engineering", "cs"],
    formula: { matric: 0, fsc: 40, test: 60 },
    slug: "ned-university",
    feePerSemester: 38000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["NED Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 0, fsc: 40, test: 60 },
          "A-Levels": { matric: 0, fsc: 40, test: 60 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Karachi"],
    meritData: {
      type: "aggregate",
      campuses: {
        "Karachi": {
          "BS Computer Science": { 2025: "85.82%", 2024: "84.27%", 2023: "84.27%" },
          "BS Software Engineering": { 2025: "87.53%", 2024: "86.86%", 2023: "86.86%" },
          "BS Computer Systems Engineering": { 2025: "85.84%", 2024: "83.90%", 2023: "83.90%" },
          "Electrical Engineering": { 2025: "80.02%", 2024: "79.41%", 2023: "79.41%" },
          "Mechanical Engineering": { 2025: "78.30%", 2024: "73.06%", 2023: "73.86%" },
          "Biomedical Engineering": { 2025: "73.88%", 2024: "66.30%", 2023: "62.77%" },
          "Civil Engineering": { 2025: "72.34%", 2024: "69.00%", 2023: "70.18%" },
          "Computational Finance": { 2025: "78.98%", 2024: "72.73%", 2023: "72.73%" }
        }
      }
    },
    programs: [
      { name: "Software Engineering", merits: { 2023: 86.86, 2024: 86.86, 2025: 87.53 } },
      { name: "Computer Science", merits: { 2023: 84.27, 2024: 84.27, 2025: 85.82 } },
      { name: "Electrical Engineering", merits: { 2023: 79.41, 2024: 79.41, 2025: 80.02 } },
      { name: "Mechanical Engineering", merits: { 2023: 73.86, 2024: 73.06, 2025: 78.30 } }
    ]
  },
  {
    id: "comsats",
    name: "COMSATS University Islamabad",
    shortName: "COMSATS",
    colorHex: "#3A0CA3",
    city: "Islamabad",
    entryTest: "NTS NAT",
    categories: ["cs", "engineering"],
    slug: "comsats",
    feePerSemester: 98000,
    educationSystems: ["FSc", "A/O-Levels"],
    entryTestTypes: ["University Test", "NAT"],
    programGroups: [
      {
        groupName: "Computing (CS, SE, Cyber)",
        formulas: {
          "FSc": { matric: 10, fsc: 40, test: 50 },
          "A/O-Levels": { matric: 10, fsc: 40, test: 50 }
        }
      },
      {
        groupName: "Engineering",
        formulas: {
          "FSc": { matric: 10, fsc: 40, test: 50 },
          "A/O-Levels": { matric: 10, fsc: 40, test: 50 }
        }
      },
      {
        groupName: "Business",
        formulas: {
          "FSc": { matric: 10, fsc: 40, test: 50 },
          "A/O-Levels": { matric: 10, fsc: 40, test: 50 }
        }
      }
    ],
    formula: { matric: 10, fsc: 40, test: 50 },
    testPattern: {
      testName: "NTS-NAT",
      totalMcqs: 90,
      duration: "3 hours",
      totalMarks: 100,
      subjects: [
        { name: "Quantitative", mcqs: 20 },
        { name: "Analytical", mcqs: 20 },
        { name: "English", mcqs: 20 },
        { name: "Subject Specific", mcqs: 30 }
      ],
      tags: ["No Negative Marking", "No Calculator", "Paper Based"]
    },
    campuses: ["Islamabad", "Lahore", "Abbottabad", "Wah", "Attock", "Sahiwal", "Vehari"],
    meritData: {
      type: "aggregate",
      campuses: {
        "Islamabad": {
          "BS CS": { 2025: "88.42%", 2024: "88.28%" },
          "BS AI": { 2025: "87.70%", 2024: "87.28%" },
          "BS SE": { 2025: "85.96%", 2024: "86.32%" },
          "BS DS": { 2025: "86.37%", 2024: "85.80%" },
          "BS Cyber": { 2025: "86.40%", 2024: "85.50%" },
          "BS Bio Informatics": { 2025: "63.02%", 2024: "62.00%" },
          "BS Bio Science": { 2025: "54.42%", 2024: "53.50%" },
          "BS Chemistry": { 2025: "50.29%", 2024: "50.00%" },
          "BS Economics with Data Science": { 2025: "60.13%", 2024: "59.50%" },
          "BS Economics": { 2025: "50.05%", 2024: "49.50%" },
          "BS Computer Engineering": { 2025: "79.96%", 2024: "79.00%" }
        },
        "Lahore": {
          "BS CS": { 2025: "88.18%", 2024: "88.21%" },
          "BS SE": { 2025: "86.39%", 2024: "86.60%" },
          "BS AI": { 2025: "84.52%", 2024: "--" }
        },
        "Abbottabad": {
          "BS CS": { 2025: "81.20%", 2024: "80.50%" },
          "BS SE": { 2025: "80.01%", 2024: "79.50%" }
        }
      }
    },
    programs: [
      { name: "Computer Science", merits: { 2023: 84.2, 2024: 86.1, 2025: 88.42 } },
      { name: "Software Engineering", merits: { 2023: 82.0, 2024: 83.9, 2025: 85.96 } },
      { name: "Data Science", merits: { 2023: 79.8, 2024: 81.5, 2025: 86.37 } },
      { name: "Cyber Security", merits: { 2023: 80.0, 2024: 81.0, 2025: 86.40 } }
    ]
  },
  {
    id: "air",
    name: "Air University",
    shortName: "Air University",
    colorHex: "#0077B6",
    city: "Islamabad",
    entryTest: "Air Uni Test",
    categories: ["engineering", "cs"],
    formula: { matric: 15, fsc: 35, test: 50 },
    slug: "air-university",
    feePerSemester: 85000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["Air Uni Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 15, fsc: 35, test: 50 },
          "A-Levels": { matric: 15, fsc: 35, test: 50 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Islamabad", "Karachi"],
    meritData: {
      type: "aggregate",
      campuses: {
        "Islamabad": {
          "BS Computer Science": { 2025: "78.10%", 2024: "76.20%", 2023: "74.50%" },
          "BS Cyber Security": { 2025: "76.90%", 2024: "75.00%", 2023: "73.10%" }
        },
        "Karachi": {
          "BS Computer Sciences": { 2025: "81.00%", 2024: "79.00%", 2023: "77.00%" },
          "BS Software Engineering": { 2025: "75.00%", 2024: "73.00%", 2023: "71.00%" },
          "BS Artificial Intelligence": { 2025: "81.00%", 2024: "79.00%", 2023: "77.00%" },
          "BS Data Science": { 2025: "65.00%", 2024: "63.00%", 2023: "61.00%" },
          "Bachelor of Computer Engineering": { 2025: "66.00%", 2024: "64.00%", 2023: "62.00%" },
          "Bachelor of Mechatronics Engineering": { 2025: "63.00%", 2024: "61.00%", 2023: "59.00%" },
          "Bachelor of Biomedical Engineering": { 2025: "69.00%", 2024: "67.00%", 2023: "65.00%" }
        }
      }
    },
    programs: [
      { name: "Computer Science", merits: { 2023: 74.5, 2024: 76.2, 2025: 78.1 } },
      { name: "Cyber Security", merits: { 2023: 73.1, 2024: 75.0, 2025: 76.9 } },
      { name: "Software Engineering", merits: { 2023: 71.0, 2024: 73.0, 2025: 75.0 } },
      { name: "Artificial Intelligence", merits: { 2023: 77.0, 2024: 79.0, 2025: 81.0 } }
    ]
  },
  {
    id: "giki",
    name: "Ghulam Ishaq Khan Institute of Engineering Sciences and Technology",
    shortName: "GIKI",
    colorHex: "#1A5632",
    city: "Swabi",
    entryTest: "GIKI Test",
    categories: ["engineering", "cs"],
    slug: "giki",
    feePerSemester: 420000,
    educationSystems: ["FSc", "A/O-Levels"],
    entryTestTypes: ["University Test", "SAT"],
    programGroups: [
      {
        groupName: "Engineering & Sciences",
        formulas: {
          "FSc": { matric: 0, fsc: 15, test: 85 },
          "A/O-Levels": { matric: 0, fsc: 15, test: 85 }
        }
      },
      {
        groupName: "Computer Systems & AI",
        formulas: {
          "FSc": { matric: 0, fsc: 15, test: 85 },
          "A/O-Levels": { matric: 0, fsc: 15, test: 85 }
        }
      },
      {
        groupName: "Management Sciences",
        formulas: {
          "FSc": { matric: 0, fsc: 15, test: 85 },
          "A/O-Levels": { matric: 0, fsc: 15, test: 85 }
        }
      }
    ],
    formula: { matric: 0, fsc: 15, test: 85 },
    testPattern: {
      testName: "GIKI Entry Test",
      totalMcqs: 80,
      duration: "2 hours",
      totalMarks: 200,
      subjects: [
        { name: "Mathematics", mcqs: 30 },
        { name: "Physics", mcqs: 30 },
        { name: "English", mcqs: 20 }
      ],
      tags: ["No Negative Marking", "No Calculator", "Computer Based"]
    },
    campuses: ["Swabi"],
    meritData: {
      type: "rank",
      campuses: {
        "Swabi": {
          "BS Computer Science": { 2025: "#602" },
          "BS Artificial Intelligence": { 2025: "#670" },
          "BS Software Engineering": { 2025: "#857" },
          "BS Cyber Security": { 2025: "#1340" },
          "BS Data Science": { 2025: "#1399" },
          "BS Computer Engineering": { 2025: "#1358" },
          "BS Mechanical Engineering": { 2025: "#2241" },
          "BS Electrical Engineering": { 2025: "#2592" },
          "BS Civil Engineering": { 2025: "#3249" }
        }
      }
    },
    programs: [
      { name: "Computer Science", merits: { 2023: 68.5, 2024: 70.2, 2025: 72.1 } },
      { name: "Artificial Intelligence", merits: { 2023: 67.2, 2024: 69.0, 2025: 70.8 } },
      { name: "Mechanical Engineering", merits: { 2023: 55.4, 2024: 54.1, 2025: 53.0 } }
    ]
  },
  {
    id: "pieas",
    name: "Pakistan Institute of Engineering and Applied Sciences",
    shortName: "PIEAS",
    colorHex: "#14213D",
    city: "Islamabad",
    entryTest: "PIEAS Test",
    categories: ["engineering", "cs"],
    formula: { matric: 15, fsc: 25, test: 60 },
    slug: "pieas",
    feePerSemester: 68000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["PIEAS Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 15, fsc: 25, test: 60 },
          "A-Levels": { matric: 15, fsc: 25, test: 60 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Islamabad"],
    meritData: {
      type: "aggregate",
      campuses: {
        "Islamabad": {
          "Computer Science": { 2025: "90.85%", 2024: "90.64%", 2023: "88.50%" },
          "Electrical Engineering": { 2025: "81.04%", 2024: "77.91%", 2023: "75.80%" },
          "Mechanical Engineering": { 2025: "84.79%", 2024: "80.92%", 2023: "78.50%" },
          "Chemical Engineering": { 2025: "75.78%", 2024: "75.38%", 2023: "73.00%" },
          "Metallurgy and Materials Engineering": { 2025: "61.53%", 2024: "62.04%", 2023: "60.00%" },
          "Physics": { 2025: "83.04%", 2024: "83.21%", 2023: "81.00%" }
        }
      }
    },
    programs: [
      { name: "Computer Science", merits: { 2023: 88.50, 2024: 90.64, 2025: 90.85 } },
      { name: "Mechanical Engineering", merits: { 2023: 78.50, 2024: 80.92, 2025: 84.79 } },
      { name: "Physics", merits: { 2023: 81.00, 2024: 83.21, 2025: 83.04 } },
      { name: "Electrical Engineering", merits: { 2023: 75.80, 2024: 77.91, 2025: 81.04 } }
    ]
  },
  {
    id: "itu",
    name: "Information Technology University",
    shortName: "ITU Lahore",
    colorHex: "#457B9D",
    city: "Lahore",
    entryTest: "ITU Test",
    categories: ["cs"],
    formula: { matric: 15, fsc: 35, test: 50 },
    slug: "itu-lahore",
    feePerSemester: 95000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["ITU Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 15, fsc: 35, test: 50 },
          "A-Levels": { matric: 15, fsc: 35, test: 50 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Lahore"],
    meritData: {
      type: "aggregate",
      campuses: {
        "Lahore": {
          "Computer Science": { 2025: "81.27%", 2024: "78.50%", 2023: "76.80%" },
          "Software Engineering": { 2025: "83.05%", 2024: "76.90%", 2023: "75.00%" },
          "Computer Engineering": { 2025: "77.00%", 2024: "60.50%", 2023: "62.10%" },
          "Electrical Engineering": { 2025: "60.12%", 2024: "58.00%", 2023: "56.00%" },
          "Artificial Intelligence": { 2025: "81.40%", 2024: "78.20%", 2023: "76.50%" },
          "Management & Technology": { 2025: "61.27%", 2024: "59.00%", 2023: "57.20%" },
          "Financial Technology": { 2025: "62.09%", 2024: "60.20%", 2023: "58.00%" },
          "Economics With Data Science": { 2025: "55.85%", 2024: "53.00%", 2023: "51.50%" }
        }
      }
    },
    programs: [
      { name: "Software Engineering", merits: { 2023: 75.00, 2024: 76.90, 2025: 83.05 } },
      { name: "Artificial Intelligence", merits: { 2023: 76.50, 2024: 78.20, 2025: 81.40 } },
      { name: "Computer Science", merits: { 2023: 76.80, 2024: 78.50, 2025: 81.27 } },
      { name: "Computer Engineering", merits: { 2023: 62.10, 2024: 60.50, 2025: 77.00 } }
    ]
  },
  {
    id: "uaf",
    name: "University of Agriculture Faisalabad",
    shortName: "UAF",
    colorHex: "#2E7D32",
    city: "Faisalabad",
    entryTest: "UAF Test",
    categories: ["agriculture", "science"],
    formula: { matric: 30, fsc: 30, test: 40 },
    slug: "uaf",
    feePerSemester: 25000,
    educationSystems: ["FSc"],
    entryTestTypes: ["UAF Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: { "FSc": { matric: 30, fsc: 30, test: 40 } }
      }
    ],
    testPattern: null,
    campuses: ["Faisalabad"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Agriculture", merits: { 2023: 65.5, 2024: 67.0, 2025: 68.2 } },
      { name: "Food Sciences", merits: { 2023: 70.1, 2024: 71.3, 2025: 72.5 } },
      { name: "Computer Science", merits: { 2023: 72.8, 2024: 74.5, 2025: 76.1 } }
    ]
  },
  {
    id: "muet",
    name: "Mehran University of Engineering and Technology",
    shortName: "MUET Jamshoro",
    colorHex: "#9E2A2B",
    city: "Jamshoro",
    entryTest: "MUET Test",
    categories: ["engineering", "cs"],
    formula: { matric: 10, fsc: 30, test: 60 },
    slug: "muet-jamshoro",
    feePerSemester: 32000,
    educationSystems: ["FSc"],
    entryTestTypes: ["MUET Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: { "FSc": { matric: 10, fsc: 30, test: 60 } }
      }
    ],
    testPattern: null,
    campuses: ["Jamshoro"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Systems Engineering", merits: { 2023: 68.2, 2024: 70.0, 2025: 71.5 } },
      { name: "Electrical Engineering", merits: { 2023: 60.1, 2024: 59.5, 2025: 58.2 } },
      { name: "Civil Engineering", merits: { 2023: 65.0, 2024: 64.2, 2025: 63.0 } }
    ]
  },
  {
    id: "ist",
    name: "Institute of Space Technology",
    shortName: "IST Islamabad",
    colorHex: "#3F37C9",
    city: "Islamabad",
    entryTest: "NUST NET / NAT",
    categories: ["engineering", "cs"],
    formula: { matric: 20, fsc: 40, test: 40 },
    slug: "ist-islamabad",
    feePerSemester: 110000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["NET", "NAT"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 20, fsc: 40, test: 40 },
          "A-Levels": { matric: 20, fsc: 40, test: 40 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Islamabad"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Aerospace Engineering", merits: { 2023: 72.5, 2024: 74.1, 2025: 75.3 } },
      { name: "Avionics Engineering", merits: { 2023: 68.0, 2024: 67.2, 2025: 66.0 } },
      { name: "Space Science", merits: { 2023: 62.3, 2024: 63.8, 2025: 64.5 } }
    ]
  },
  {
    id: "uet-taxila",
    name: "University of Engineering and Technology",
    shortName: "UET Taxila",
    colorHex: "#6F1D1B",
    city: "Taxila",
    entryTest: "ECAT",
    categories: ["engineering", "cs"],
    formula: { matric: 17, fsc: 50, test: 33 },
    slug: "uet-taxila",
    feePerSemester: 42000,
    educationSystems: ["FSc"],
    entryTestTypes: ["ECAT"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: { "FSc": { matric: 17, fsc: 50, test: 33 } }
      }
    ],
    testPattern: null,
    campuses: ["Taxila"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 76.5, 2024: 78.1, 2025: 79.8 } },
      { name: "Software Engineering", merits: { 2023: 75.1, 2024: 77.0, 2025: 78.5 } },
      { name: "Mechanical Engineering", merits: { 2023: 64.2, 2024: 63.0, 2025: 62.1 } }
    ]
  },
  {
    id: "uhs",
    name: "University of Health Sciences",
    shortName: "UHS",
    colorHex: "#008080",
    city: "Lahore",
    entryTest: "MDCAT",
    categories: ["medical"],
    slug: "uhs",
    feePerSemester: 18000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["MDCAT"],
    programGroups: [
      {
        groupName: "Medical Programs",
        formulas: {
          "FSc": { matric: 10, fsc: 40, test: 50 },
          "A-Levels": { matric: 10, fsc: 40, test: 50 }
        }
      }
    ],
    formula: { matric: 10, fsc: 40, test: 50 },
    testPattern: {
      testName: "MDCAT",
      totalMcqs: 200,
      duration: "3.5 hours",
      totalMarks: 200,
      subjects: [
        { name: "Biology", mcqs: 68 },
        { name: "Chemistry", mcqs: 54 },
        { name: "Physics", mcqs: 54 },
        { name: "English", mcqs: 18 },
        { name: "Logical Reasoning", mcqs: 6 }
      ],
      tags: ["No Negative Marking", "No Calculator", "Paper Based"]
    },
    campuses: ["Lahore"],
    meritData: {
      type: "aggregate",
      campuses: {
        "Lahore": {
          "MBBS": { 2025: "91.50%", 2024: "91.20%", 2023: "90.80%" },
          "BDS": { 2025: "90.10%", 2024: "89.80%", 2023: "89.40%" }
        }
      }
    },
    programs: [
      { name: "MBBS", merits: { 2023: 90.80, 2024: 91.20, 2025: 91.50 } },
      { name: "BDS", merits: { 2023: 89.40, 2024: 89.80, 2025: 90.10 } }
    ]
  }
];

export const privateUniversities = [
  {
    id: "lums",
    name: "Lahore University of Management Sciences",
    shortName: "LUMS",
    colorHex: "#C1121F",
    city: "Lahore",
    entryTest: "SAT/LCAT",
    categories: ["business", "cs", "engineering"],
    formula: { matric: 30, fsc: 30, test: 40 },
    slug: "lums",
    feePerSemester: 580000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["SAT", "LCAT"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 30, fsc: 30, test: 40 },
          "A-Levels": { matric: 30, fsc: 30, test: 40 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Lahore"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Management Science", merits: { 2023: 82.0, 2024: 84.5, 2025: 86.0 } },
      { name: "Computer Science", merits: { 2023: 84.1, 2024: 86.8, 2025: 88.5 } },
      { name: "Economics", merits: { 2023: 78.5, 2024: 80.2, 2025: 82.0 } }
    ]
  },
  {
    id: "fast",
    name: "National University of Computer and Emerging Sciences",
    shortName: "FAST-NUCES",
    colorHex: "#03045E",
    city: "Islamabad",
    entryTest: "NU Test",
    categories: ["cs", "engineering", "business"],
    slug: "fast-nuces",
    feePerSemester: 216000,
    educationSystems: ["FSc", "A-Levels (Immediate)", "A-Levels (Gap Year)"],
    entryTestTypes: ["NU Test", "NAT", "SAT"],
    programGroups: [
      {
        groupName: "Computing (CS, SE, AI, DS)",
        programs: ["BS CS", "BS SE", "BS AI", "BS DS", "BS Cyber"],
        formulas: {
          "FSc": { matric: 10, fsc: 40, test: 50 },
          "A-Levels (Immediate)": { matric: 10, fsc: 40, test: 50 },
          "A-Levels (Gap Year)": { matric: 10, fsc: 40, test: 50 }
        }
      },
      {
        groupName: "Engineering (EE, CE, Civil)",
        programs: ["BS EE", "BS CE", "BS Civil"],
        formulas: {
          "FSc": { matric: 17, fsc: 50, test: 33 },
          "A-Levels (Immediate)": { matric: 17, fsc: 50, test: 33 },
          "A-Levels (Gap Year)": { matric: 17, fsc: 50, test: 33 }
        }
      },
      {
        groupName: "Business (BBA, AFM)",
        programs: ["BBA", "BS A&F", "BS Business Analytics", "BS FinTech"],
        formulas: {
          "FSc": { matric: 10, fsc: 40, test: 50 },
          "A-Levels (Immediate)": { matric: 10, fsc: 40, test: 50 },
          "A-Levels (Gap Year)": { matric: 10, fsc: 40, test: 50 }
        }
      }
    ],
    formula: { matric: 0, fsc: 50, test: 50 },
    testPattern: {
      testName: "NU Test",
      totalMcqs: 100,
      duration: "2 hours",
      totalMarks: 100,
      subjects: [
        { name: "Adv. Math", mcqs: 50 },
        { name: "Basic Math", mcqs: 20 },
        { name: "Analytical Skills & IQ", mcqs: 20 },
        { name: "English", mcqs: 10 }
      ],
      tags: ["Negative Marking", "No Calculator", "Computer Based"]
    },
    campuses: ["Islamabad", "Lahore", "Karachi", "Peshawar", "Chiniot-Faisalabad", "Multan"],
    meritData: {
      type: "aggregate",
      campuses: {
        "Islamabad": {
          "BS CS": { 2025: "73.00%", 2024: "75.00%" },
          "BS SE": { 2025: "71.88%", 2024: "73.00%" },
          "BS AI": { 2025: "73.00%", 2024: "74.00%" },
          "BS DS": { 2025: "71.50%", 2024: "71.50%" },
          "BS Cyber": { 2025: "70.75%", 2024: "71.00%" },
          "BS EE": { 2025: "67.25%", 2024: "65.00%" },
          "BS CE": { 2025: "73.50%", 2024: "78.00%" }
        },
        "Lahore": {
          "BS CS": { 2025: "76.00%", 2024: "76.00%" },
          "BS SE": { 2025: "74.41%", 2024: "76.00%" },
          "BS AI": { 2025: "78.42%", 2024: "--" },
          "BS DS": { 2025: "73.75%", 2024: "--" },
          "BS Cyber": { 2025: "73.50%", 2024: "--" },
          "BS EE": { 2025: "69.00%", 2024: "68.00%" },
          "BS Civil": { 2025: "54.00%", 2024: "--" },
          "BBA": { 2025: "49.67%", 2024: "--" },
          "BS A&F": { 2025: "46.92%", 2024: "--" },
          "BS Business Analytics": { 2025: "61.13%", 2024: "--" },
          "BS FinTech": { 2025: "62.57%", 2024: "--" }
        },
        "Karachi": {
          "BS CS": { 2025: "68.26%", 2024: "68.00%" },
          "BS SE": { 2025: "66.37%", 2024: "66.00%" },
          "BS AI": { 2025: "65.47%", 2024: "67.00%" },
          "BS DS": { 2025: "67.76%", 2024: "66.00%" },
          "BS Cyber": { 2025: "65.08%", 2024: "66.00%" },
          "BS EE": { 2025: "61.33%", 2024: "60.00%" },
          "BS CE": { 2025: "60.36%", 2024: "--" },
          "BS FinTech": { 2025: "49.30%", 2024: "--" }
        },
        "Peshawar": {
          "BS CS": { 2025: "56.94%", 2024: "58.00%" },
          "BS SE": { 2025: "57.80%", 2024: "--" },
          "BBA": { 2025: "64.00%", 2024: "--" }
        },
        "Chiniot-Faisalabad": {
          "BS CS": { 2025: "65.00%", 2024: "67.00%" },
          "BS SE": { 2025: "65.87%", 2024: "66.00%" },
          "BS AI": { 2025: "71.90%", 2024: "--" },
          "BS EE": { 2025: "62.00%", 2024: "--" },
          "BS CE": { 2025: "70.38%", 2024: "--" },
          "BS Business Analytics": { 2025: "59.92%", 2024: "--" },
          "BS FinTech": { 2025: "57.00%", 2024: "--" }
        },
        "Multan": {
          "BS CS": { 2025: "66.00%", 2024: "--" },
          "BS SE": { 2025: "70.21%", 2024: "--" },
          "BS AI": { 2025: "63.50%", 2024: "--" }
        }
      }
    },
    programs: [
      { name: "Computer Science", merits: { 2023: 72.5, 2024: 75.1, 2025: 76.0 } },
      { name: "Software Engineering", merits: { 2023: 70.8, 2024: 73.2, 2025: 74.41 } },
      { name: "Artificial Intelligence", merits: { 2023: 73.0, 2024: 75.0, 2025: 78.42 } },
      { name: "Data Science", merits: { 2023: 66.4, 2024: 69.0, 2025: 73.75 } }
    ]
  },
  {
    id: "iba",
    name: "Institute of Business Administration",
    shortName: "IBA Karachi",
    colorHex: "#006400",
    city: "Karachi",
    entryTest: "IBA Aptitude",
    categories: ["business", "cs"],
    formula: { matric: 0, fsc: 40, test: 60 },
    slug: "iba-karachi",
    feePerSemester: 320000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["IBA Aptitude"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 0, fsc: 40, test: 60 },
          "A-Levels": { matric: 0, fsc: 40, test: 60 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Karachi"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Business Administration", merits: { 2023: 74.0, 2024: 76.5, 2025: 78.0 } },
      { name: "Computer Science", merits: { 2023: 71.2, 2024: 73.0, 2025: 75.5 } },
      { name: "Social Sciences", merits: { 2023: 65.5, 2024: 67.0, 2025: 68.8 } }
    ]
  },
  {
    id: "aku",
    name: "Aga Khan University",
    shortName: "Aga Khan Uni",
    colorHex: "#700D10",
    city: "Karachi",
    entryTest: "AKU Test",
    categories: ["medical"],
    formula: { matric: 0, fsc: 50, test: 50 },
    slug: "aku",
    feePerSemester: 850000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["AKU Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 0, fsc: 50, test: 50 },
          "A-Levels": { matric: 0, fsc: 50, test: 50 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Karachi"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "MBBS", merits: { 2023: 85.5, 2024: 87.0, 2025: 89.2 } },
      { name: "Nursing", merits: { 2023: 70.1, 2024: 72.3, 2025: 74.0 } }
    ]
  },
  {
    id: "habib",
    name: "Habib University",
    shortName: "Habib Uni",
    colorHex: "#8338EC",
    city: "Karachi",
    entryTest: "HU Aptitude",
    categories: ["cs", "engineering", "arts"],
    formula: { matric: 20, fsc: 40, test: 40 },
    slug: "habib-university",
    feePerSemester: 480000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["HU Aptitude"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 20, fsc: 40, test: 40 },
          "A-Levels": { matric: 20, fsc: 40, test: 40 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Karachi"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 68.2, 2024: 70.5, 2025: 72.8 } },
      { name: "Computer Engineering", merits: { 2023: 62.0, 2024: 63.8, 2025: 65.1 } },
      { name: "Communication & Design", merits: { 2023: 65.0, 2024: 67.2, 2025: 69.0 } }
    ]
  },
  {
    id: "szabist",
    name: "Shaheed Zulfikar Ali Bhutto Institute of Science and Technology",
    shortName: "SZABIST",
    colorHex: "#FF007F",
    city: "Karachi",
    entryTest: "SZABIST Test",
    categories: ["cs", "business"],
    formula: { matric: 0, fsc: 50, test: 50 },
    slug: "szabist",
    feePerSemester: 135000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["SZABIST Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 0, fsc: 50, test: 50 },
          "A-Levels": { matric: 0, fsc: 50, test: 50 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Karachi"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 60.5, 2024: 62.3, 2025: 64.1 } },
      { name: "Media Studies", merits: { 2023: 55.0, 2024: 56.8, 2025: 58.2 } },
      { name: "Business Administration", merits: { 2023: 58.2, 2024: 60.1, 2025: 61.9 } }
    ]
  },
  {
    id: "ucp",
    name: "University of Central Punjab",
    shortName: "UCP",
    colorHex: "#06D6A0",
    city: "Lahore",
    entryTest: "UCP Test",
    categories: ["cs", "business"],
    formula: { matric: 0, fsc: 70, test: 30 },
    slug: "ucp",
    feePerSemester: 110000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["UCP Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 0, fsc: 70, test: 30 },
          "A-Levels": { matric: 0, fsc: 70, test: 30 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Lahore"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 55.4, 2024: 57.2, 2025: 59.0 } },
      { name: "Software Engineering", merits: { 2023: 54.1, 2024: 55.9, 2025: 57.8 } },
      { name: "Business Administration", merits: { 2023: 50.2, 2024: 52.0, 2025: 53.5 } }
    ]
  },
  {
    id: "umt",
    name: "University of Management and Technology",
    shortName: "UMT",
    colorHex: "#118AB2",
    city: "Lahore",
    entryTest: "UMT Test",
    categories: ["cs", "engineering", "business"],
    formula: { matric: 0, fsc: 70, test: 30 },
    slug: "umt",
    feePerSemester: 125000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["UMT Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 0, fsc: 70, test: 30 },
          "A-Levels": { matric: 0, fsc: 70, test: 30 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Lahore"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 58.1, 2024: 60.2, 2025: 62.0 } },
      { name: "Software Engineering", merits: { 2023: 56.5, 2024: 58.9, 2025: 60.5 } },
      { name: "Civil Engineering", merits: { 2023: 52.0, 2024: 51.1, 2025: 50.0 } }
    ]
  },
  {
    id: "riphah",
    name: "Riphah International University",
    shortName: "Riphah",
    colorHex: "#EF476F",
    city: "Islamabad",
    entryTest: "Riphah Test",
    categories: ["cs", "medical"],
    formula: { matric: 0, fsc: 70, test: 30 },
    slug: "riphah",
    feePerSemester: 115000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["Riphah Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 0, fsc: 70, test: 30 },
          "A-Levels": { matric: 0, fsc: 70, test: 30 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Islamabad"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 54.3, 2024: 56.1, 2025: 58.0 } },
      { name: "Software Engineering", merits: { 2023: 53.0, 2024: 55.2, 2025: 57.1 } },
      { name: "DPT (Physical Therapy)", merits: { 2023: 65.5, 2024: 67.2, 2025: 68.9 } }
    ]
  },
  {
    id: "bahria",
    name: "Bahria University",
    shortName: "Bahria",
    colorHex: "#FFD166",
    city: "Islamabad",
    entryTest: "BU Test",
    categories: ["cs", "engineering"],
    formula: { matric: 10, fsc: 40, test: 50 },
    slug: "bahria",
    feePerSemester: 105000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["BU Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 10, fsc: 40, test: 50 },
          "A-Levels": { matric: 10, fsc: 40, test: 50 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Islamabad (E-8)", "Islamabad (H-11)"],
    meritData: {
      type: "rank",
      campuses: {
        "Islamabad (E-8)": {
          "BS Computer Science": { 2025: "#455", 2024: "#480", 2023: "#510" },
          "BS Information Technology": { 2025: "#810", 2024: "#840", 2023: "#890" },
          "BS Artificial Intelligence": { 2025: "#340", 2024: "#360", 2023: "#380" },
          "BS Accounting & Finance": { 2025: "#590", 2024: "#610", 2023: "#640" },
          "BS Psychology": { 2025: "#121", 2024: "#135", 2023: "#150" },
          "BBA": { 2025: "#859", 2024: "#880", 2023: "#910" },
          "LLB": { 2025: "#190", 2024: "#210", 2023: "#230" }
        },
        "Islamabad (H-11)": {
          "BS Computer Science": { 2025: "#120", 2024: "#135", 2023: "#150" },
          "BS Software Engineering": { 2025: "#300", 2024: "#320", 2023: "#350" },
          "BS Artificial Intelligence": { 2025: "#180", 2024: "#195", 2023: "#210" },
          "BS Robotics & Intelligence Systems": { 2025: "#177", 2024: "#190", 2023: "#205" },
          "BS Electrical Engineering": { 2025: "#210", 2024: "#230", 2023: "#250" },
          "BS Computer Engineering": { 2025: "#8", 2024: "#12", 2023: "#15" }
        }
      }
    },
    programs: [
      { name: "Computer Science", merits: { 2023: 510, 2024: 480, 2025: 455 } },
      { name: "Software Engineering", merits: { 2023: 350, 2024: 320, 2025: 300 } },
      { name: "Artificial Intelligence", merits: { 2023: 380, 2024: 360, 2025: 340 } }
    ]
  },
  {
    id: "fccu",
    name: "Forman Christian College University",
    shortName: "FCCU",
    colorHex: "#073B4C",
    city: "Lahore",
    entryTest: "FEAT",
    categories: ["cs", "business", "science"],
    formula: { matric: 20, fsc: 40, test: 40 },
    slug: "fccu",
    feePerSemester: 210000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["FEAT"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 20, fsc: 40, test: 40 },
          "A-Levels": { matric: 20, fsc: 40, test: 40 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Lahore"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 65.5, 2024: 67.8, 2025: 69.5 } },
      { name: "Business Administration", merits: { 2023: 60.2, 2024: 62.0, 2025: 63.8 } },
      { name: "Biotechnology", merits: { 2023: 58.5, 2024: 60.1, 2025: 61.9 } }
    ]
  },
  {
    id: "bnu",
    name: "Beaconhouse National University",
    shortName: "BNU",
    colorHex: "#9B5DE5",
    city: "Lahore",
    entryTest: "BNU Test",
    categories: ["arts", "cs"],
    formula: { matric: 10, fsc: 30, test: 60 },
    slug: "bnu",
    feePerSemester: 260000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["BNU Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 10, fsc: 30, test: 60 },
          "A-Levels": { matric: 10, fsc: 30, test: 60 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Lahore"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Visual Arts", merits: { 2023: 60.0, 2024: 62.0, 2025: 64.0 } },
      { name: "Liberal Arts", merits: { 2023: 55.5, 2024: 57.2, 2025: 59.0 } },
      { name: "Software Engineering", merits: { 2023: 58.2, 2024: 60.5, 2025: 62.1 } }
    ]
  },
  {
    id: "cust",
    name: "Capital University of Science and Technology",
    shortName: "CUST",
    colorHex: "#F15BB5",
    city: "Islamabad",
    entryTest: "CUST Test",
    categories: ["cs", "engineering"],
    formula: { matric: 0, fsc: 50, test: 50 },
    slug: "cust",
    feePerSemester: 120000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["CUST Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 0, fsc: 50, test: 50 },
          "A-Levels": { matric: 0, fsc: 50, test: 50 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Islamabad"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 58.2, 2024: 60.1, 2025: 61.8 } },
      { name: "Software Engineering", merits: { 2023: 56.5, 2024: 58.0, 2025: 59.5 } },
      { name: "Mechanical Engineering", merits: { 2023: 50.1, 2024: 50.0, 2025: 50.0 } }
    ]
  },
  {
    id: "superior",
    name: "Superior University",
    shortName: "Superior",
    colorHex: "#00F5D4",
    city: "Lahore",
    entryTest: "Superior Test",
    categories: ["cs", "business"],
    formula: { matric: 0, fsc: 70, test: 30 },
    slug: "superior",
    feePerSemester: 115000,
    educationSystems: ["FSc"],
    entryTestTypes: ["Superior Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: { "FSc": { matric: 0, fsc: 70, test: 30 } }
      }
    ],
    testPattern: null,
    campuses: ["Lahore"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 50.5, 2024: 52.8, 2025: 54.9 } },
      { name: "Software Engineering", merits: { 2023: 50.0, 2024: 51.9, 2025: 53.5 } },
      { name: "Business Administration", merits: { 2023: 50.0, 2024: 50.0, 2025: 51.0 } }
    ]
  },
  {
    id: "dha-suffa",
    name: "DHA Suffa University",
    shortName: "DHA Suffa",
    colorHex: "#00BBF9",
    city: "Karachi",
    entryTest: "DSU Test",
    categories: ["cs", "engineering", "business"],
    formula: { matric: 0, fsc: 50, test: 50 },
    slug: "dha-suffa",
    feePerSemester: 140000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["DSU Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 0, fsc: 50, test: 50 },
          "A-Levels": { matric: 0, fsc: 50, test: 50 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Karachi"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Computer Science", merits: { 2023: 56.2, 2024: 58.0, 2025: 60.1 } },
      { name: "Mechanical Engineering", merits: { 2023: 50.1, 2024: 50.0, 2025: 50.0 } },
      { name: "Management Sciences", merits: { 2023: 52.0, 2024: 53.5, 2025: 55.0 } }
    ]
  }
];

export const semiGovtUniversities = [
  {
    id: "numl",
    name: "National University of Modern Languages",
    shortName: "NUML",
    colorHex: "#F77F00",
    city: "Islamabad",
    entryTest: "NUML Test",
    categories: ["cs", "arts"],
    formula: { matric: 0, fsc: 60, test: 40 },
    slug: "numl",
    feePerSemester: 52000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["NUML Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 0, fsc: 60, test: 40 },
          "A-Levels": { matric: 0, fsc: 60, test: 40 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Islamabad"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "English Linguistics", merits: { 2023: 65.2, 2024: 67.0, 2025: 69.1 } },
      { name: "Computer Science", merits: { 2023: 68.5, 2024: 70.8, 2025: 72.9 } },
      { name: "Business Administration", merits: { 2023: 60.0, 2024: 62.1, 2025: 63.8 } }
    ]
  },
  {
    id: "nums",
    name: "National University of Medical Sciences",
    shortName: "NUMS",
    colorHex: "#D62828",
    city: "Rawalpindi",
    entryTest: "NUMS Test",
    categories: ["medical"],
    formula: { matric: 10, fsc: 40, test: 50 },
    slug: "nums",
    feePerSemester: 180000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["NUMS Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 10, fsc: 40, test: 50 },
          "A-Levels": { matric: 10, fsc: 40, test: 50 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Rawalpindi"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "MBBS", merits: { 2023: 88.5, 2024: 90.1, 2025: 91.8 } },
      { name: "BDS", merits: { 2023: 85.0, 2024: 86.8, 2025: 88.1 } },
      { name: "Cardiac Technology", merits: { 2023: 72.1, 2024: 74.0, 2025: 75.9 } }
    ]
  },
  {
    id: "foundation",
    name: "Foundation University",
    shortName: "Foundation Uni",
    colorHex: "#003049",
    city: "Islamabad",
    entryTest: "FUI Test",
    categories: ["cs", "engineering"],
    formula: { matric: 10, fsc: 40, test: 50 },
    slug: "foundation-university",
    feePerSemester: 110000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["FUI Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 10, fsc: 40, test: 50 },
          "A-Levels": { matric: 10, fsc: 40, test: 50 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Islamabad"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Psychology", merits: { 2023: 60.1, 2024: 61.8, 2025: 63.5 } },
      { name: "Computer Science", merits: { 2023: 64.2, 2024: 66.0, 2025: 67.8 } },
      { name: "Software Engineering", merits: { 2023: 62.0, 2024: 63.9, 2025: 65.8 } }
    ]
  },
  {
    id: "amc",
    name: "Army Medical College",
    shortName: "Army Med College",
    colorHex: "#588157",
    city: "Rawalpindi",
    entryTest: "NUMS MDCAT",
    categories: ["medical"],
    formula: { matric: 10, fsc: 40, test: 50 },
    slug: "army-medical-college",
    feePerSemester: 220000,
    educationSystems: ["FSc"],
    entryTestTypes: ["NUMS MDCAT"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: { "FSc": { matric: 10, fsc: 40, test: 50 } }
      }
    ],
    testPattern: null,
    campuses: ["Rawalpindi"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "MBBS", merits: { 2023: 91.8, 2024: 92.9, 2025: 93.8 } },
      { name: "BDS", merits: { 2023: 89.2, 2024: 90.5, 2025: 91.2 } }
    ]
  },
  {
    id: "paf-iast",
    name: "PAF-IAST Haripur",
    shortName: "PAF-IAST",
    colorHex: "#344E41",
    city: "Haripur",
    entryTest: "PAF Test",
    categories: ["cs", "engineering"],
    formula: { matric: 15, fsc: 35, test: 50 },
    slug: "paf-iast",
    feePerSemester: 95000,
    educationSystems: ["FSc", "A-Levels"],
    entryTestTypes: ["PAF Test"],
    programGroups: [
      {
        groupName: "All Programs",
        formulas: {
          "FSc": { matric: 15, fsc: 35, test: 50 },
          "A-Levels": { matric: 15, fsc: 35, test: 50 }
        }
      }
    ],
    testPattern: null,
    campuses: ["Haripur"],
    meritData: { type: "aggregate", campuses: {} },
    programs: [
      { name: "Software Engineering", merits: { 2023: 65.5, 2024: 67.8, 2025: 69.9 } },
      { name: "Artificial Intelligence", merits: { 2023: 64.1, 2024: 66.0, 2025: 68.2 } },
      { name: "Biomedical Sciences", merits: { 2023: 58.2, 2024: 60.1, 2025: 62.0 } }
    ]
  }
];

export const allUniversities = [
  ...publicUniversities,
  ...privateUniversities,
  ...semiGovtUniversities
];

export const getUniversityBySlug = (slug) => {
  return allUniversities.find(u => u.slug === slug);
};

export const get7YearMerits = (program) => {
  const merits = { ...program.merits };
  const baseVal = merits[2023] || 70.0;
  if (!merits[2019]) merits[2019] = +(baseVal - 6.2).toFixed(2);
  if (!merits[2020]) merits[2020] = +(baseVal - 4.5).toFixed(2);
  if (!merits[2021]) merits[2021] = +(baseVal - 2.8).toFixed(2);
  if (!merits[2022]) merits[2022] = +(baseVal - 1.2).toFixed(2);
  return merits;
};

// All unique categories for filter pills
export const allCategories = ["all", "engineering", "cs", "medical", "business", "science", "arts", "agriculture"];

export const getUniversityLogo = (uniId) => {
  const logoMap = {
    'nust': 'nust.webp',
    'uet-lahore': 'uet.webp',
    'uet-taxila': 'uet.webp',
    'qau': 'qau.webp',
    'gcu-lahore': 'gcu.webp',
    'pu': 'pu.webp',
    'ned': 'ned.webp',
    'comsats': 'comsats.webp',
    'air': 'air university.webp',
    'giki': 'giki.webp',
    'pieas': 'pieas.webp',
    'itu': 'itu.webp',
    'uaf': 'uaf.webp',
    'muet': 'muet.webp',
    'ist': 'ist.webp',
    'fast': 'fast nuces.webp',
    'lums': 'lums.webp',
    'iba': 'iba.webp',
    'habib': 'habib university.webp',
    'fccu': 'fccu.png',
    'bnu': 'bnu.png',
    'cust': 'cust.webp',
    'ucp': 'ucp.webp',
    'umt': 'umt.webp',
    'superior': 'superior.webp',
    'dsu': 'dha suffa.webp',
    'riphah': 'riphah.webp',
    'rifha': 'riphah.webp',
    'aku': 'agha khan university.webp',
    'agha-khan': 'agha khan university.webp',
    'numl': 'numl.webp',
    'nums': 'nums.webp',
    'foundation': 'foundation university.webp',
    'amc': 'amc.gif',
    'bahria': 'behria university.webp',
    'behria': 'behria university.webp',
    'szabist': 'szabist.webp',
    'paf-iast': 'psf-ist.webp',
    'uhs': 'uhs.webp'
  };
  
  const filename = logoMap[uniId.toLowerCase()];
  return filename ? `/logos/${filename}?v=3` : `/logos/${uniId}.webp?v=3`;
};
