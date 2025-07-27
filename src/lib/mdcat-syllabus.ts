// src/lib/mdcat-syllabus.ts

export type Chapter = {
  id: string;
  name: string;
  subtopics: string[];
};

export type Subject = {
  name: string;
  slug: string;
  chapters: Chapter[];
  mcqs: number;
};

export const mdcatSyllabus: Record<string, Subject> = {
  biology: {
    name: "Biology",
    slug: "biology",
    mcqs: 81,
    chapters: [
      { id: "bio-1", name: "Acellular Life", subtopics: ["Viruses: classification, HIV/AIDS"] },
      { id: "bio-2", name: "Bioenergetics", subtopics: ["Respiration of proteins & fats"] },
      { id: "bio-3", name: "Biological Molecules", subtopics: ["Carbs, proteins, lipids, nucleic acids"] },
      { id: "bio-4", name: "Cell Structure & Function", subtopics: ["Organelles, prokaryote vs eukaryote"] },
      { id: "bio-5", name: "Coordination & Control", subtopics: ["Neurons, nerve impulse, brain functions"] },
      { id: "bio-6", name: "Enzymes", subtopics: ["Enzyme mechanism, inhibitors, factors affecting"] },
      { id: "bio-7", name: "Evolution", subtopics: ["Origin of life, Lamarck vs Darwin"] },
      { id: "bio-8", name: "Reproduction", subtopics: ["Reproductive systems, menstrual cycle, STDs"] },
      { id: "bio-9", name: "Support & Movement", subtopics: ["Cartilage, bone, muscle contraction"] },
      { id: "bio-10", name: "Inheritance", subtopics: ["Mendel’s laws, gene linkage, sex-linked traits"] },
      { id: "bio-11", name: "Circulation", subtopics: ["Heart structure, cardiac cycle, blood vessels"] },
      { id: "bio-12", name: "Immunity", subtopics: ["Specific defense mechanisms"] },
      { id: "bio-13", name: "Respiration", subtopics: ["Respiratory system, gas exchange"] },
      { id: "bio-14", name: "Digestion", subtopics: ["Digestive tract, accessory structures"] },
      { id: "bio-15", name: "Homeostasis", subtopics: ["Kidney function, osmoregulation, thermoregulation"] },
      { id: "bio-16", name: "Biotechnology", subtopics: ["Vaccine production, diagnostic tools"] },
    ],
  },
  chemistry: {
    name: "Chemistry",
    slug: "chemistry",
    mcqs: 45,
    chapters: [
      { id: "chem-1", name: "Fundamental Concepts", subtopics: ["Mole ratios, limiting reagents, yield"] },
      { id: "chem-2", name: "Atomic Structure", subtopics: ["Quantum numbers, orbitals, electronic configuration"] },
      { id: "chem-3", name: "Gases", subtopics: ["Kinetic theory, gas laws, ideal vs real gas"] },
      { id: "chem-4", name: "Liquids", subtopics: ["Evaporation, boiling point, hydrogen bonding"] },
      { id: "chem-5", name: "Solids", subtopics: ["Crystal lattice types, ionic vs molecular"] },
      { id: "chem-6", name: "Chemical Equilibrium", subtopics: ["Le Châtelier’s principle, buffers, Ksp"] },
      { id: "chem-7", name: "Reaction Kinetics", subtopics: ["Reaction rates, collision theory"] },
      { id: "chem-8", name: "Thermochemistry", subtopics: ["Energetics of reactions, enthalpy"] },
      { id: "chem-9", name: "Electrochemistry", subtopics: ["Redox, cell potentials, electrochemical cells"] },
      { id: "chem-10", name: "Chemical Bonding", subtopics: ["Molecular bonding, dipole moment"] },
      { id: "chem-11", name: "s- & p-Block Elements", subtopics: ["Group properties, reactions"] },
      { id: "chem-12", name: "Transition Elements", subtopics: ["General properties & reactions"] },
      { id: "chem-13", name: "Principles of Organic Chemistry", subtopics: ["Reaction mechanisms"] },
      { id: "chem-14", name: "Hydrocarbons", subtopics: ["Alkanes, alkenes, alkynes, aromatics"] },
      { id: "chem-15", name: "Alkyl Halides", subtopics: ["Nomenclature, SN1, SN2, E1, E2 reactions"] },
      { id: "chem-16", name: "Alcohols & Phenols", subtopics: ["Structure, properties, reactions"] },
      { id: "chem-17", name: "Aldehydes & Ketones", subtopics: ["Preparation, reactions, nomenclature"] },
      { id: "chem-18", name: "Carboxylic Acids", subtopics: ["Nomenclature, reactivity, derivatives"] },
      { id: "chem-19", name: "Macromolecules", subtopics: ["Proteins, enzymes, polymers"] },
      { id: "chem-20", name: "Industrial Chemistry", subtopics: ["Adhesives, dyes, polymers"] },
    ],
  },
  physics: {
    name: "Physics",
    slug: "physics",
    mcqs: 36,
    chapters: [
        { id: "phy-1", name: "Vectors & Equilibrium", subtopics: ["Vector addition, scalar & vector products"] },
        { id: "phy-2", name: "Force & Motion", subtopics: ["Projectile motion, Newton’s laws, collisions"] },
        { id: "phy-3", name: "Work & Energy", subtopics: ["Kinetic and potential energies, conservation"] },
        { id: "phy-4", name: "Rotational & Circular Motion", subtopics: ["Torque, moment of inertia"] },
        { id: "phy-5", name: "Fluid Dynamics", subtopics: ["Continuity equation, Bernoulli’s principle"] },
        { id: "phy-6", name: "Waves", subtopics: ["Standing waves, organ pipe resonance, Doppler effect"] },
        { id: "phy-7", name: "Thermodynamics", subtopics: ["Laws of thermodynamics, heat engines"] },
        { id: "phy-8", name: "Electrostatics", subtopics: ["Coulomb’s law, electric field, potential"] },
        { id: "phy-9", name: "Current Electricity", subtopics: ["Ohm’s law, circuits, Kirchhoff's laws"] },
        { id: "phy-10", name: "Magnetism & Electromagnetism", subtopics: ["Magnetic fields, forces on charges"] },
        { id: "phy-11", name: "Electromagnetic Induction", subtopics: ["Faraday’s law, Lenz’s law, generators"] },
        { id: "phy-12", name: "Alternating Current", subtopics: ["AC circuits, impedance, resonance"] },
        { id: "phy-13", name: "Electronics", subtopics: ["Diodes, transistors, rectifiers"] },
        { id: "phy-14", name: "Dawn of Modern Physics", subtopics: ["Photoelectric effect, Compton effect"] },
        { id: "phy-15", name: "Atomic Spectra", subtopics: ["Bohr model, hydrogen spectrum"] },
        { id: "phy-16", name: "Nuclear Physics", subtopics: ["Radioactivity, nuclear reactions, fission, fusion"] },
    ],
  },
  english: {
    name: "English",
    slug: "english",
    mcqs: 9,
    chapters: [
        { id: "eng-1", name: "Reading & Thinking Skills", subtopics: ["Context inference, figurative language, vocabulary"] },
        { id: "eng-2", name: "Formal & Lexical Aspects of Language", subtopics: ["Pronouns, tenses, prepositions, punctuation"] },
        { id: "eng-3", name: "Writing Skills", subtopics: ["Proofreading, subject-verb agreement, sentence correction"] },
    ],
  },
  "logical-reasoning": {
    name: "Logical Reasoning",
    slug: "logical-reasoning",
    mcqs: 9,
    chapters: [
        { id: "lr-1", name: "Critical Thinking", subtopics: ["Evaluating arguments, recognizing fallacies"] },
        { id: "lr-2", name: "Letter & Symbol Series", subtopics: ["Alphabetical/numerical patterns"] },
        { id: "lr-3", name: "Logical Deductions", subtopics: ["Reasoning from given premises"] },
        { id: "lr-4", name: "Logical Problems", subtopics: ["Puzzle integration, problem-solving"] },
        { id: "lr-5", name: "Course of Action", subtopics: ["Decision-making and argument analysis"] },
        { id: "lr-6", name: "Cause & Effect", subtopics: ["Identifying causal relationships"] },
    ],
  },
};
