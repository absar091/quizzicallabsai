
export type Topic = {
  id: string;
  name: string;
};

export type Subject = {
  name: string;
  slug: string;
  topics: Topic[];
};

export const ecatSyllabus: Record<string, Subject> = {
  physics: {
    name: "Physics",
    slug: "physics",
    topics: [
      { id: "phy-1", name: "Motion and Force (Laws of Motion)" },
      { id: "phy-2", name: "Work and Energy" },
      { id: "phy-3", name: "Circular Motion" },
      { id: "phy-4", name: "Oscillations" },
      { id: "phy-5", name: "Waves" },
      { id: "phy-6", name: "Physical Optics" },
      { id: "phy-7", name: "Heat and Thermodynamics" },
      { id: "phy-8", name: "Electrostatics" },
      { id: "phy-9", name: "Current Electricity" },
      { id: "phy-10", name: "Electromagnetism" },
      { id: "phy-11", name: "Electronics" },
      { id: "phy-12", name: "Modern Physics" },
      { id: "phy-13", name: "Nuclear Physics" },
    ],
  },
  mathematics: {
    name: "Mathematics",
    slug: "mathematics",
    topics: [
      { id: "math-1", name: "Functions and Limits" },
      { id: "math-2", name: "Differentiation and Integration" },
      { id: "math-3", name: "Algebra (Binomial, Series, Sets)" },
      { id: "math-4", name: "Matrices and Determinants" },
      { id: "math-5", name: "Linear Inequalities" },
      { id: "math-6", name: "Trigonometry" },
      { id: "math-7", name: "Coordinate Geometry" },
      { id: "math-8", name: "Vectors" },
      { id: "math-9", name: "Probability" },
      { id: "math-10", name: "Conic Sections" },
      { id: "math-11", name: "Partial Fractions" },
    ],
  },
  english: {
    name: "English",
    slug: "english",
    topics: [
      { id: "eng-1", name: "Grammar (Tenses, Articles, Prepositions)" },
      { id: "eng-2", name: "Vocabulary (Synonyms, Antonyms, Meanings)" },
      { id: "eng-3", name: "Comprehension-based MCQs" },
      { id: "eng-4", name: "Sentence Correction" },
      { id: "eng-5", name: "Sentence Completion" },
    ],
  },
  chemistry: {
    name: "Chemistry",
    slug: "chemistry",
    topics: [
      { id: "chem-1", name: "Atomic Structure" },
      { id: "chem-2", name: "Chemical Bonding" },
      { id: "chem-3", name: "States of Matter" },
      { id: "chem-4", name: "Thermodynamics" },
      { id: "chem-5", name: "Equilibrium" },
      { id: "chem-6", name: "Electrochemistry" },
      { id: "chem-7", name: "Reaction Kinetics" },
      { id: "chem-8", name: "Periodic Table" },
      { id: "chem-9", name: "Organic Chemistry (basic)" },
      { id: "chem-10", name: "Chemical Reactions" },
    ],
  },
  "computer-science": {
    name: "Computer Science",
    slug: "computer-science",
    topics: [
      { id: "cs-1", name: "Basics of Computer" },
      { id: "cs-2", name: "Data types, Operators" },
      { id: "cs-3", name: "Input/Output Functions" },
      { id: "cs-4", name: "Control Structures" },
      { id: "cs-5", name: "Arrays and Loops" },
      { id: "cs-6", name: "Logic Gates and Boolean Algebra" },
      { id: "cs-7", name: "Data Structures (basic)" },
      { id: "cs-8", name: "Computer Architecture" },
    ],
  },
};
