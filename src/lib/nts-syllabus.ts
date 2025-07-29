
export type Chapter = {
    id: string;
    name: string;
}

export type Subject = {
  id: string;
  name: string;
  chapters: Chapter[];
};

export type NtsCategory = {
  id: string;
  name: string;
  description: string;
  subjects: Subject[];
};

export const ntsSyllabus: Record<string, NtsCategory> = {
    "nat-ie": {
        id: "nat-ie",
        name: "NAT-IE (Pre-Engineering)",
        description: "For students with an FSc Pre-Engineering background.",
        subjects: [
            { id: "phy", name: "Physics", chapters: [
                { id: "phy-1", name: "Measurements" },
                { id: "phy-2", name: "Vectors and Equilibrium" },
                { id: "phy-3", name: "Motion and Force" },
                { id: "phy-4", name: "Work and Energy" },
                { id: "phy-5", name: "Circular Motion" },
                { id: "phy-6", name: "Fluid Dynamics" },
                { id: "phy-7", name: "Oscillations" },
                { id: "phy-8", name: "Waves" },
                { id: "phy-9", name: "Physical Optics" },
                { id: "phy-10", name: "Thermodynamics" },
                { id: "phy-11", name: "Electrostatics" },
                { id: "phy-12", name: "Current Electricity" },
                { id: "phy-13", name: "Electromagnetism" },
                { id: "phy-14", name: "Electronics" },
                { id: "phy-15", name: "Dawn of Modern Physics" },
                { id: "phy-16", name: "Atomic Spectra" },
                { id: "phy-17", name: "Nuclear Physics" },
            ]},
            { id: "chem", name: "Chemistry", chapters: [
                { id: "chem-1", name: "Fundamental Concepts" },
                { id: "chem-2", name: "Atomic Structure" },
                { id: "chem-3", name: "Chemical Bonding" },
                { id: "chem-4", name: "States of Matter" },
                { id: "chem-5", name: "Thermochemistry" },
                { id: "chem-6", name: "Chemical Equilibrium" },
                { id: "chem-7", name: "Reaction Kinetics" },
                { id: "chem-8", name: "Solutions" },
                { id: "chem-9", name: "Electrochemistry" },
                { id: "chem-10", name: "Periodic Classification" },
                { id: "chem-11", name: "Transition Elements" },
                { id: "chem-12", name: "Organic Chemistry Principles" },
                { id: "chem-13", name: "Hydrocarbons" },
                { id: "chem-14", name: "Alcohols, Phenols, Aldehydes, Ketones" },
                { id: "chem-15", name: "Carboxylic Acids" },
                { id: "chem-16", name: "Macromolecules" },
                { id: "chem-17", name: "Environmental Chemistry" },
            ]},
            { id: "math", name: "Mathematics", chapters: [
                { id: "math-1", name: "Number Systems" },
                { id: "math-2", name: "Sets, Functions, and Groups" },
                { id: "math-3", name: "Matrices and Determinants" },
                { id: "math-4", name: "Quadratic Equations" },
                { id: "math-5", name: "Partial Fractions" },
                { id: "math-6", name: "Sequences and Series" },
                { id: "math-7", name: "Permutations, Combinations, Probability" },
                { id: "math-8", name: "Trigonometry" },
                { id: "math-9", name: "Functions and Limits" },
                { id: "math-10", name: "Differentiation" },
                { id: "math-11", name: "Integration" },
                { id: "math-12", name: "Conic Sections" },
                { id: "math-13", name: "Vectors" },
            ]},
        ],
    },
    "nat-im": {
        id: "nat-im",
        name: "NAT-IM (Pre-Medical)",
        description: "For students with an FSc Pre-Medical background.",
        subjects: [
            { id: "phy", name: "Physics", chapters: [
                 { id: "phy-1", name: "Measurements" },
                 { id: "phy-2", name: "Vectors and Equilibrium" },
                 { id: "phy-3", name: "Motion and Force" },
                 { id: "phy-4", name: "Work and Energy" },
                 { id: "phy-5", name: "Circular Motion" },
                 { id: "phy-7", name: "Oscillations" },
                 { id: "phy-8", name: "Waves" },
                 { id: "phy-11", name: "Electrostatics" },
                 { id: "phy-12", name: "Current Electricity" },
                 { id: "phy-13", name: "Electromagnetism" },
                 { id: "phy-14", name: "Electronics" },
            ]},
            { id: "chem", name: "Chemistry", chapters: [
                { id: "chem-1", name: "Fundamental Concepts" },
                { id: "chem-2", name: "Atomic Structure" },
                { id: "chem-3", name: "Chemical Bonding" },
                { id: "chem-4", name: "States of Matter" },
                { id: "chem-5", name: "Thermochemistry" },
                { id: "chem-6", name: "Chemical Equilibrium" },
                { id: "chem-13", name: "Organic Chemistry" },
                { id: "chem-14", name: "Hydrocarbons" },
            ]},
            { id: "bio", name: "Biology", chapters: [
                { id: "bio-1", name: "Introduction to Biology" },
                { id: "bio-2", name: "Biological Molecules" },
                { id: "bio-3", name: "Enzymes" },
                { id: "bio-4", name: "The Cell" },
                { id: "bio-5", name: "Cell Cycle" },
                { id: "bio-6", name: "Variety of Life" },
                { id: "bio-7", name: "Kingdom Animalia & Plantae" },
                { id: "bio-8", name: "Bioenergetics" },
                { id: "bio-9", name: "Nutrition" },
                { id: "bio-10", name: "Transport" },
                { id: "bio-11", name: "Respiration" },
                { id: "bio-12", name: "Excretion" },
                { id: "bio-13", name: "Coordination and Control" },
                { id: "bio-14", name: "Reproduction" },
                { id: "bio-15", name: "Genetics" },
                { id: "bio-16", name: "Evolution" },
                { id: "bio-17", name: "Homeostasis" },
                { id: "bio-18", name: "Support and Movement" },
                { id: "bio-19", name: "Immunity" },
                { id: "bio-20", name: "Biotechnology" },
                { id: "bio-21", name: "Ecosystem" },
                { id: "bio-22", name: "Man and His Environment" },
            ]},
        ],
    },
    "nat-ics": {
        id: "nat-ics",
        name: "NAT-ICS (Computer Science)",
        description: "For students with an ICS background.",
        subjects: [
            { id: "phy", name: "Physics", chapters: [
                 { id: "phy-1", name: "Measurements" },
                 { id: "phy-2", name: "Vectors and Equilibrium" },
                 { id: "phy-3", name: "Motion and Force" },
                 { id: "phy-4", name: "Work and Energy" },
                 { id: "phy-12", name: "Current Electricity" },
                 { id: "phy-13", name: "Electromagnetism" },
                 { id: "phy-14", name: "Electronics" },
            ]},
            { id: "math", name: "Mathematics", chapters: [
                { id: "math-1", name: "Number Systems" },
                { id: "math-2", name: "Sets, Functions, and Groups" },
                { id: "math-3", name: "Matrices and Determinants" },
                { id: "math-9", name: "Functions and Limits" },
                { id: "math-10", name: "Differentiation" },
                { id: "math-11", name: "Integration" },
            ]},
            { id: "cs", name: "Computer Science", chapters: [
                { id: "cs-1", name: "Introduction to Computer" },
                { id: "cs-2", name: "Computer Components" },
                { id: "cs-3", name: "Data Representation" },
                { id: "cs-4", name: "Boolean Algebra and Logic Gates" },
                { id: "cs-6", name: "Programming Concepts" },
                { id: "cs-7", name: "Flowcharts and Algorithms" },
                { id: "cs-8", name: "Arrays" },
                { id: "cs-9", name: "Control Structures" },
                { id: "cs-10", name: "Functions" },
                { id: "cs-13", name: "Data Communication" },
                { id: "cs-15", name: "Database Concepts" },
                { id: "cs-16", name: "Programming in C/C++" },
            ]},
        ],
    },
    "nat-icom": {
        id: "nat-icom",
        name: "NAT-ICOM (Commerce)",
        description: "For students with an I.Com background.",
        subjects: [
            { id: "acc", name: "Accounting", chapters: [
                { id: "acc-1", name: "Introduction to Accounting" },
                { id: "acc-2", name: "Accounting Equation" },
                { id: "acc-3", name: "Journal & Ledger" },
                { id: "acc-4", name: "Trial Balance" },
                { id: "acc-5", name: "Bank Reconciliation" },
                { id: "acc-6", name: "Final Accounts" },
                { id: "acc-7", name: "Depreciation" },
                { id: "acc-9", name: "Partnership Accounts" },
            ]},
            { id: "bmath", name: "Business Math / Statistics", chapters: [
                { id: "bmath-1", name: "Percentages" },
                { id: "bmath-2", name: "Profit and Loss" },
                { id: "bmath-3", name: "Ratios and Proportions" },
                { id: "bmath-4", name: "Interest and Discount" },
                { id: "bmath-5", name: "Linear Equations" },
                { id: "bmath-6", name: "Matrices" },
                { id: "bmath-7", name: "Averages and Graphs" },
            ]},
            { id: "eco", name: "Economics", chapters: [
                { id: "eco-1", name: "Introduction to Economics" },
                { id: "eco-2", name: "Demand and Supply" },
                { id: "eco-3", name: "Utility and Elasticity" },
                { id: "eco-4", name: "Market Structures" },
                { id: "eco-5", name: "Factors of Production" },
                { id: "eco-6", name: "Money and Banking" },
                { id: "eco-7", name: "National Income" },
            ]},
        ]
    },
    "nat-ia": {
        id: "nat-ia",
        name: "NAT-IA (Arts/Humanities)",
        description: "For students with an FA/Arts background.",
        subjects: [
            { id: "is", name: "Islamic Studies", chapters: [
                { id: "is-1", name: "Pillars of Islam" },
                { id: "is-2", name: "Life of the Prophet (SAW)" },
                { id: "is-3", name: "Beliefs in Islam" },
                { id: "is-4", name: "Islamic Society" },
                { id: "is-5", name: "Quranic Teachings" },
                { id: "is-6", name: "Hadiths and Sunnah" },
            ]},
            { id: "ps", name: "Pakistan Studies", chapters: [
                { id: "ps-1", name: "Ideology of Pakistan" },
                { id: "ps-2", name: "History of Pakistan Movement" },
                { id: "ps-3", name: "Constitution of Pakistan" },
                { id: "ps-4", name: "Geography of Pakistan" },
                { id: "ps-5", name: "Economic Development" },
            ]},
            { id: "gk", name: "General Knowledge", chapters: [
                { id: "gk-1", name: "World Geography" },
                { id: "gk-2", name: "Basic Current Affairs" },
                { id: "gk-3", name: "International Organizations" },
                { id: "gk-4", name: "Science and Inventions" },
                { id: "gk-5", name: "Capitals & Currencies" },
            ]},
        ],
    },
};
