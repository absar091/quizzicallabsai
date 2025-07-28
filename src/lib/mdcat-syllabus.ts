
export type LearningObjective = {
  id: string;
  text: string;
};

export type Subtopic = {
  id: string;
  name: string;
  learningObjectives: LearningObjective[];
};

export type Chapter = {
  id: string;
  name: string;
  subtopics: Subtopic[];
};

export type Subject = {
  name: string;
  slug: string;
  chapters: Chapter[];
};

export const mdcatSyllabus: Record<string, Subject> = {
  biology: {
    name: "Biology",
    slug: "biology",
    chapters: [
      { id: "bio-1", name: "Acellular Life", subtopics: [
          { id: "bio-1-1", name: "Viruses", learningObjectives: [
              { id: "bio-1-1-1", text: "Classify viruses on basis of their structure/ number of strands/diseases/ hosts etc." }
          ]},
          { id: "bio-1-2", name: "AIDS and HIV Infection", learningObjectives: [
              { id: "bio-1-2-1", text: "Identify symptoms, mode of transmission and cause of viral disease (AIDS)." }
          ]}
      ]},
      { id: "bio-2", name: "Bioenergetics", subtopics: [
          { id: "bio-2-1", name: "Respiration", learningObjectives: [
              { id: "bio-2-1-1", text: "Outline the cellular respiration of proteins and fats and correlate these with that of glucose." }
          ]}
      ]},
      { id: "bio-3", name: "Biological Molecules", subtopics: [
          { id: "bio-3-1", name: "Biological molecules", learningObjectives: [
              { id: "bio-3-1-1", text: "Define and classify biological molecules." },
              { id: "bio-3-1-2", text: "Discuss the importance of biological molecules." }
          ]},
          { id: "bio-3-2", name: "Biological Importance of Water", learningObjectives: [
              { id: "bio-3-2-1", text: "Describe biologically important properties of water (polarity, hydrolysis, specific heat, water as solvent and reagent, density, cohesion/ionization)." }
          ]},
          { id: "bio-3-3", name: "Carbohydrates", learningObjectives: [
              { id: "bio-3-3-1", text: "Discuss carbohydrates: monosaccharaides (glucose), oligosaccharides (cane sugar, sucrose, lactose), polysaccharides (starches, cellulose, glycogen)." }
          ]},
          { id: "bio-3-4", name: "Proteins", learningObjectives: [
              { id: "bio-3-4-1", text: "Describe proteins: amino acids, structure of proteins." }
          ]},
          { id: "bio-3-5", name: "Lipids", learningObjectives: [
              { id: "bio-3-5-1", text: "Describe lipids: phospholipids, triglycerides, alcohol and esters (acylglycerol)." }
          ]},
          { id: "bio-3-6", name: "Ribonucleic acid (RNA)", learningObjectives: [
              { id: "bio-3-6-1", text: "Give an account of structure and function RNA." }
          ]},
          { id: "bio-3-7", name: "Conjugated molecules", learningObjectives: [
              { id: "bio-3-7-1", text: "Discuss conjugated molecules (glycol lipids, glycol proteins)." }
          ]},
          { id: "bio-3-8", name: "Structure of DNA", learningObjectives: [
              { id: "bio-3-8-1", text: "Explain the double helical structure of DNA as proposed by Watson and Crick." },
              { id: "bio-3-8-2", text: "Define gene is a sequence of nucleotides as part of DNA, which codes for the formation of a polypeptide." }
          ]}
      ]},
      { id: "bio-4", name: "Cell Structure & Function", subtopics: [
          { id: "bio-4-1", name: "Cell structure", learningObjectives: [
              { id: "bio-4-1-1", text: "Compare the structure of typical animal and plant cell." }
          ]},
          { id: "bio-4-2", name: "Prokaryotic and Eukaryotic cell", learningObjectives: [
              { id: "bio-4-2-1", text: "Compare and contrast the structure of prokaryotic cells with eukaryotic cells." }
          ]},
          { id: "bio-4-3", name: "Cytoplasmic Organelles", learningObjectives: [
              { id: "bio-4-3-1", text: "Outline the structure and function of the following organelles: nucleus, Endoplasmic reticulum, Golgi apparatus a Mitochondria." }
          ]},
          { id: "bio-4-4", name: "Chromosomes", learningObjectives: [
              { id: "bio-4-4-1", text: "Describe the structure, chemical composition and function of chromosomes." }
          ]}
      ]},
      { id: "bio-5", name: "Coordination & Control/Nervous & Chemical Coordination", subtopics: [
          { id: "bio-5-1", name: "Receptors", learningObjectives: [
              { id: "bio-5-1-1", text: "Recognize receptors as transducers sensitive to various stimuli." },
              { id: "bio-5-1-2", text: "Explain the structure of a typical neuron (cell body, dendrites, axon and myelin sheath)." },
              { id: "bio-5-1-3", text: "Define nerve impulse." },
              { id: "bio-5-1-4", text: "Classify reflexes." },
              { id: "bio-5-1-5", text: "Briefly explain the functions of components of a reflex arc." }
          ]},
          { id: "bio-5-2", name: "Brain", learningObjectives: [
              { id: "bio-5-2-1", text: "Discuss the main parts of the brain (e.g., components of brain stem, mid brain, cerebellum, cerebrum)." },
              { id: "bio-5-2-2", text: "Describe the functions of each part." }
          ]}
      ]},
      { id: "bio-6", name: "Enzymes", subtopics: [
          { id: "bio-6-1", name: "Enzymes", learningObjectives: [
              { id: "bio-6-1-1", text: "Describe the distinguishing characteristics of enzymes." }
          ]},
          { id: "bio-6-2", name: "Mode of Enzyme Action", learningObjectives: [
              { id: "bio-6-2-1", text: "Explain mechanism of action of enzymes." }
          ]},
          { id: "bio-6-3", name: "Factors that Affect the Rate of Enzyme Reactions", learningObjectives: [
              { id: "bio-6-3-1", text: "Describe effects of factor on enzyme action (temperature, pH and concentration)." }
          ]},
          { id: "bio-6-4", name: "Inhibitors", learningObjectives: [
              { id: "bio-6-4-1", text: "Describe enzyme inhibitors." }
          ]}
      ]},
      { id: "bio-7", name: "Evolution", subtopics: [
          { id: "bio-7-1", name: "Concept of Evolution", learningObjectives: [
              { id: "bio-7-1-1", text: "Explain origin of life according to concept of evolution." }
          ]},
          { id: "bio-7-2", name: "Lamarckism", learningObjectives: [
              { id: "bio-7-2-1", text: "Describe the theory of inheritance of acquired characters, as proposed by Lamarck." }
          ]},
          { id: "bio-7-3", name: "Darwinism", learningObjectives: [
              { id: "bio-7-3-1", text: "Explain the theory of natural selection as proposed by Darwin." }
          ]}
      ]},
      { id: "bio-8", name: "Reproduction", subtopics: [
          { id: "bio-8-1", name: "Human Reproductive system", learningObjectives: [
              { id: "bio-8-1-1", text: "Describe the functions of various parts of the male & female reproductive systems and the hormones that regulate those functions." }
          ]},
          { id: "bio-8-2", name: "Menstrual cycle", learningObjectives: [
              { id: "bio-8-2-1", text: "Describe the menstrual cycle (female reproductive cycle) emphasizing the role of hormones." }
          ]},
          { id: "bio-8-3", name: "Sexually transmitted diseases", learningObjectives: [
              { id: "bio-8-3-1", text: "List the common sexually transmitted diseases along with their causative agents and main symptoms." }
          ]}
      ]},
      { id: "bio-9", name: "Support & Movement", subtopics: [
          { id: "bio-9-1", name: "Human skeleton", learningObjectives: [
              { id: "bio-9-1-1", text: "Describe cartilage, muscle and bone." },
              { id: "bio-9-1-2", text: "Explain the main characteristics of cartilage and bone along with functions." }
          ]},
          { id: "bio-9-2", name: "Muscles", learningObjectives: [
              { id: "bio-9-2-1", text: "Compare characteristics of smooth muscles, cardiac muscles and skeletal muscles." }
          ]},
          { id: "bio-9-3", name: "Skeletal muscles", learningObjectives: [
              { id: "bio-9-3-1", text: "Explain the ultra-structure of skeletal muscles." }
          ]},
          { id: "bio-9-4", name: "Muscle contraction", learningObjectives: [
              { id: "bio-9-4-1", text: "Describe in brief the process of skeletal muscle contraction." }
          ]},
          { id: "bio-9-5", name: "Joints", learningObjectives: [
              { id: "bio-9-5-1", text: "Classify joints." }
          ]},
          { id: "bio-9-6", name: "Arthritis", learningObjectives: [
              { id: "bio-9-6-1", text: "Define arthritis." }
          ]}
      ]},
      { id: "bio-10", name: "Inheritance", subtopics: [
          { id: "bio-10-1", name: "laws of Inheritance", learningObjectives: [
              { id: "bio-10-1-1", text: "Associate inheritance with the laws of Mendel." },
              { id: "bio-10-1-2", text: "Explain the law of independent assortment, using a suitable example." }
          ]},
          { id: "bio-10-2", name: "Gene linkage and crossing over", learningObjectives: [
              { id: "bio-10-2-1", text: "Describe the terms gene linkage and crossing over." },
              { id: "bio-10-2-2", text: "Explain how gene linkage counters independent assortment and crossing-over modifies the progeny." }
          ]},
          { id: "bio-10-3", name: "X-linked Recessive inheritance", learningObjectives: [
              { id: "bio-10-3-1", text: "Describe the concept of sex-linkage." },
              { id: "bio-10-3-2", text: "Briefly describe Inheritance of sex-linked traits." },
              { id: "bio-10-3-3", text: "Analyze the inheritance of hemophilia." }
          ]}
      ]},
      { id: "bio-11", name: "Circulation", subtopics: [
          { id: "bio-11-1", name: "Human Heart", learningObjectives: [
              { id: "bio-11-1-1", text: "Discuss general structure of human heart." }
          ]},
          { id: "bio-11-2", name: "Cardiac cycle and phases of Heartbeat", learningObjectives: [
              { id: "bio-11-2-1", text: "Describe the phases of heartbeat." }
          ]},
          { id: "bio-11-3", name: "Blood Vessels", learningObjectives: [
              { id: "bio-11-3-1", text: "List the differences and functions of arteries, veins and capillaries." }
          ]},
          { id: "bio-11-4", name: "Lymphatic system", learningObjectives: [
              { id: "bio-11-4-1", text: "Describe lymphatic system (nodes, vessels and organs)." }
          ]}
      ]},
      { id: "bio-12", name: "Immunity", subtopics: [
          { id: "bio-12-1", name: "Specific Defense Mechanism", learningObjectives: [
              { id: "bio-12-1-1", text: "Define and discuss the functions and importance of specific defense mechanisms." }
          ]}
      ]},
      { id: "bio-13", name: "Respiration", subtopics: [
          { id: "bio-13-1", name: "Human Respiratory System", learningObjectives: [
              { id: "bio-13-1-1", text: "Discuss the functions of main part of respiratory system." },
              { id: "bio-13-1-2", text: "Discuss the process of gas exchange in human lungs." },
              { id: "bio-13-1-3", text: "Discuss the effect of smoking on respiratory system." }
          ]}
      ]},
      { id: "bio-14", name: "Digestion", subtopics: [
          { id: "bio-14-1", name: "Human digestive system", learningObjectives: [
              { id: "bio-14-1-1", text: "Describe the parts of human digestive system." },
              { id: "bio-14-1-2", text: "Explain the functions of the main parts of the digestive system including associated structures and glands." }
          ]}
      ]},
      { id: "bio-15", name: "Homeostasis", subtopics: [
          { id: "bio-15-1", name: "Homeostasis", learningObjectives: [
              { id: "bio-15-1-1", text: "Explain different organs of urinary system. Describe the structure of kidney and relate it with its function." },
              { id: "bio-15-1-2", text: "Explain the processes of glomerular filtration, selective re-absorption and tubular secretion as the events in kidney functioning." },
              { id: "bio-15-1-3", text: "Justify the functioning of kidneys as both excretion and osmoregulation." },
              { id: "bio-15-1-4", text: "Compare the function of two major capillary beds in kidney i.e. glomerular capillaries and peritubular capillaries." },
              { id: "bio-15-1-5", text: "Explain the causes and treatments of kidney stones." },
              { id: "bio-15-1-6", text: "Outline the causes of kidney failure." },
              { id: "bio-15-1-7", text: "Describe thermoregulation and explain its needs." },
              { id: "bio-15-1-8", text: "List various nitrogenous compounds excreted during the process of excretion." }
          ]}
      ]},
      { id: "bio-16", name: "Biotechnology and Health Care", subtopics: [
          { id: "bio-16-1", name: "Biotechnology and Health Care", learningObjectives: [
              { id: "bio-16-1-1", text: "Describe how biotechnologists can combat health problems by producing vaccines." },
              { id: "bio-16-1-2", text: "State the role played by biotechnology in disease diagnosis (DNA/RNA probes, monoclonal antibodies)." },
              { id: "bio-16-1-3", text: "Describe what products biotechnologists obtain for use in disease treatment." }
          ]}
      ]}
    ],
  },
  chemistry: {
    name: "Chemistry",
    slug: "chemistry",
    chapters: [
        { id: "chem-1", name: "Introduction to Fundamental Concepts of Chemistry", subtopics: [
            { id: "chem-1-1", name: "Moles and Avogadro's Numbers", learningObjectives: [
                { id: "chem-1-1-1", text: "Construct mole ratios from balanced equations for use as conversion factors in stoichiometric problems." },
                { id: "chem-1-1-2", text: "Perform stoichiometric calculations with balanced equations using moles, representative particles, masses and volumes of the gases (at STP)." }
            ]},
            { id: "chem-1-2", name: "Limiting and Excess Reactants", learningObjectives: [
                { id: "chem-1-2-1", text: "Explain the limiting reagent in reaction." },
                { id: "chem-1-2-2", text: "Calculate the maximum number of products produced and the amount of any un-reacted excess reagent." }
            ]},
            { id: "chem-1-3", name: "Yield", learningObjectives: [
                { id: "chem-1-3-1", text: "Given information from which any two of the following may be determine, calculate the third: theoretical yield, actual yield, percentage yield." },
                { id: "chem-1-3-2", text: "Calculate the theoretical yield and the percent yield when given the balanced equation, the amount of reactants and the actual yield." }
            ]}
        ]},
        { id: "chem-2", name: "Atomic Structure", subtopics: [
            { id: "chem-2-1", name: "Discovery of Proton", learningObjectives: [
                { id: "chem-2-1-1", text: "Describe discovery and properties of proton (Positive rays)." }
            ]},
            { id: "chem-2-2", name: "Planck's Quantum Theory", learningObjectives: [
                { id: "chem-2-2-1", text: "Define Photon as a unit of radiation energy." }
            ]},
            { id: "chem-2-3", name: "Quantum Number", learningObjectives: [
                { id: "chem-2-3-1", text: "Describe the concept of orbitals." },
                { id: "chem-2-3-2", text: "Distinguish among Principal energy level, energy sub-level and atomic orbitals." }
            ]},
            { id: "chem-2-4", name: "Shapes of orbitals", learningObjectives: [
                { id: "chem-2-4-1", text: "Describe the general shapes of S, P and orbitals." }
            ]},
            { id: "chem-2-5", name: "Spectrum of Hydrogen", learningObjectives: [
                { id: "chem-2-5-1", text: "Describe Hydrogen Atom using the quantum theory." }
            ]},
            { id: "chem-2-6", name: "Electronic Configuration", learningObjectives: [
                { id: "chem-2-6-1", text: "Use the Aufbau principle, the Pauli Exclusion Principle and Hund's Rule to write the Electronic Configuration of atoms." },
                { id: "chem-2-6-2", text: "Write electronic configuration of atom." }
            ]}
        ]},
        { id: "chem-3", name: "Gases", subtopics: [
            { id: "chem-3-1", name: "Kinetic Molecular Theory", learningObjectives: [
                { id: "chem-3-1-1", text: "List the postulates of Kinetic Molecular Theory." },
                { id: "chem-3-1-2", text: "Describe the motion of particles of the gas according to kinetic theory." }
            ]},
            { id: "chem-3-2", name: "Standard Temperature and Pressure (STP)", learningObjectives: [
                { id: "chem-3-2-1", text: "State the values of standard temperature and pressure (STP)." }
            ]},
            { id: "chem-3-3", name: "Boyle's Law", learningObjectives: [
                { id: "chem-3-3-1", text: "Describe the effect of change in pressure on the volume of gas." }
            ]},
            { id: "chem-3-4", name: "Charles's Law", learningObjectives: [
                { id: "chem-3-4-1", text: "Describe the effect of change in temperature on the volume of gas." }
            ]},
            { id: "chem-3-5", name: "Absolute Zero", learningObjectives: [
                { id: "chem-3-5-1", text: "Explain the significance of the absolute zero, giving its value in degree." }
            ]},
            { id: "chem-3-6", name: "Ideal Gas Equation", learningObjectives: [
                { id: "chem-3-6-1", text: "Derive Ideal Gas equation using Boyle's Law, Charle's Law and Avogadro's Law." }
            ]},
            { id: "chem-3-7", name: "Unit of 'R'", learningObjectives: [
                { id: "chem-3-7-1", text: "Explain the significance and different units of ideal gas constant." }
            ]},
            { id: "chem-3-8", name: "Real and Ideal Gas", learningObjectives: [
                { id: "chem-3-8-1", text: "Distinguish between Real and Ideal Gases." }
            ]}
        ]},
        { id: "chem-4", name: "Liquids", subtopics: [
            { id: "chem-4-1", name: "Properties Of Liquids based on Kinetic Molecular Theory", learningObjectives: [
                { id: "chem-4-1-1", text: "Describe simple properties of liquids e.g diffusion, compression, expansion, motion of molecules, spaces between them, inter molecular forces and kinetic energy based on kinetic molecular theory." }
            ]},
            { id: "chem-4-2", name: "Evaporation, Boiling point and Vapor Pressure", learningObjectives: [
                { id: "chem-4-2-1", text: "Explain physical properties of liquid such as evaporation, vapor pressure, boiling point." }
            ]},
            { id: "chem-4-3", name: "Hydrogen Bonding", learningObjectives: [
                { id: "chem-4-3-1", text: "Describe the hydrogen bonding in H₂O, NH₃ and HF molecules." }
            ]},
            { id: "chem-4-4", name: "Anomalous behavior of Water", learningObjectives: [
                { id: "chem-4-4-1", text: "Anomalous behavior of water when its density shows maximum at 4 degrees centigrade." }
            ]}
        ]},
        { id: "chem-5", name: "Solids", subtopics: [
            { id: "chem-5-1", name: "Crystalline Solids", learningObjectives: [
                { id: "chem-5-1-1", text: "Describe crystalline solid." }
            ]},
            { id: "chem-5-2", name: "Factors Affecting the Shape of Ionic Crystals", learningObjectives: [
                { id: "chem-5-2-1", text: "Name three factors that affect the shape of the ionic crystals." }
            ]},
            { id: "chem-5-3", name: "Difference between Ionic and Molecular Crystals", learningObjectives: [
                { id: "chem-5-3-1", text: "Give brief description of ionic and molecular crystals." }
            ]},
            { id: "chem-5-4", name: "Crystal lattice", learningObjectives: [
                { id: "chem-5-4-1", text: "Explain the structure of a crystal lattice." }
            ]},
            { id: "chem-5-5", name: "Lattice Energy", learningObjectives: [
                { id: "chem-5-5-1", text: "Define Lattice Energy." }
            ]}
        ]},
        { id: "chem-6", name: "Chemical Equilibrium", subtopics: [
            { id: "chem-6-1", name: "Chemical Equilibrium", learningObjectives: [
                { id: "chem-6-1-1", text: "Define chemical equilibrium in terms of reversible reaction." },
                { id: "chem-6-1-2", text: "Write both forward and reverse. Describe them macroscopic characteristics of each." }
            ]},
            { id: "chem-6-2", name: "Le Chatelier's principle", learningObjectives: [
                { id: "chem-6-2-1", text: "State Le Chatelier's principle and be able to apply it to systems in equilibrium with changes in concentration, pressure, temperature or addition of catalyst." }
            ]},
            { id: "chem-6-3", name: "Solubility Products", learningObjectives: [
                { id: "chem-6-3-1", text: "Define and explain solubility products." }
            ]},
            { id: "chem-6-4", name: "Common Ion Effect", learningObjectives: [
                { id: "chem-6-4-1", text: "Define and explain the common ion effect by giving suitable examples." }
            ]},
            { id: "chem-6-5", name: "Buffer Solution", learningObjectives: [
                { id: "chem-6-5-1", text: "Define buffer solution and explain types of buffers." }
            ]},
            { id: "chem-6-6", name: "Haber's Process", learningObjectives: [
                { id: "chem-6-6-1", text: "Explain synthesis of Ammonia by Haber's process." }
            ]}
        ]},
        { id: "chem-7", name: "Chemical Kinetics", subtopics: [
            { id: "chem-7-1", name: "Chemical Kinetics", learningObjectives: [
                { id: "chem-7-1-1", text: "Define chemical kinetics." },
                { id: "chem-7-1-2", text: "Explain the terms: rate of reaction, rate equation." },
                { id: "chem-7-1-3", text: "Explain qualitatively factors affecting rate of reaction." }
            ]},
            { id: "chem-7-2", name: "Order of Reaction", learningObjectives: [
                { id: "chem-7-2-1", text: "Give the order with respect to the reactant, write the rate of law for reaction." },
                { id: "chem-7-2-2", text: "Explain the meaning of the term 'activation energy' and 'activated complex'." },
                { id: "chem-7-2-3", text: "Relate the ideas of activation energy and the activated complex to the rate of reaction." }
            ]},
            { id: "chem-7-3", name: "Rate Constant", learningObjectives: [
                { id: "chem-7-3-1", text: "Describe the role of the rate constant in the theoretical determination of reaction rate." }
            ]}
        ]},
        { id: "chem-8", name: "Thermochemistry and Energetics of Chemical Reaction", subtopics: [
            { id: "chem-8-1", name: "Thermodynamics", learningObjectives: [
                { id: "chem-8-1-1", text: "Define Thermodynamics." }
            ]},
            { id: "chem-8-2", name: "Exothermic and Endothermic Reaction", learningObjectives: [
                { id: "chem-8-2-1", text: "Classify reactions as exothermic and endothermic." }
            ]},
            { id: "chem-8-3", name: "Different Terms Used", learningObjectives: [
                { id: "chem-8-3-1", text: "Define the terms system, surrounding boundary, state function, heat, heat capacity, internal energy, work done and enthalpy of a substance." }
            ]},
            { id: "chem-8-4", name: "Internal Energies", learningObjectives: [
                { id: "chem-8-4-1", text: "Name and define the units of the Internal energy." }
            ]},
            { id: "chem-8-5", name: "Law of Thermodynamics", learningObjectives: [
                { id: "chem-8-5-1", text: "Explain the first law of thermodynamics of energy conservation." }
            ]},
            { id: "chem-8-6", name: "Hess's Law", learningObjectives: [
                { id: "chem-8-6-1", text: "Apply Hess's Law to construct simple energy cycles." }
            ]},
            { id: "chem-8-7", name: "Enthalpy", learningObjectives: [
                { id: "chem-8-7-1", text: "Describe enthalpy of the reaction." }
            ]}
        ]},
        { id: "chem-9", name: "Electrochemistry", subtopics: [
            { id: "chem-9-1", name: "Redox Reaction", learningObjectives: [
                { id: "chem-9-1-1", text: "Give the characteristics of a redox reaction." }
            ]},
            { id: "chem-9-2", name: "Oxidation and Reduction", learningObjectives: [
                { id: "chem-9-2-1", text: "Define oxidation and reduction in terms of a change in oxidation number." }
            ]},
            { id: "chem-9-3", name: "Balancing Chemical Reaction", learningObjectives: [
                { id: "chem-9-3-1", text: "Use the oxidation number change method to identify atoms being oxidized or reduced in redox reactions." }
            ]},
            { id: "chem-9-4", name: "Standard Hydrogen Electrode (SHE)", learningObjectives: [
                { id: "chem-9-4-1", text: "Define Cathode, anode, electrode potential and S.H.E." },
                { id: "chem-9-4-2", text: "Define the standard electrode potential of an electrode." }
            ]}
        ]},
        { id: "chem-10", name: "Chemical Bonding", subtopics: [
            { id: "chem-10-1", name: "VSEPR Theory", learningObjectives: [
                { id: "chem-10-1-1", text: "Use VSEPR Theory to describe the shapes of the molecules." }
            ]},
            { id: "chem-10-2", name: "Sigma and Pi Bond", learningObjectives: [
                { id: "chem-10-2-1", text: "Describe the features of sigma and pi-bonds." }
            ]},
            { id: "chem-10-3", name: "Hybridization", learningObjectives: [
                { id: "chem-10-3-1", text: "Describe the shapes of simple molecules using orbital hybridization." }
            ]},
            { id: "chem-10-4", name: "Application of VSEPR Theory", learningObjectives: [
                { id: "chem-10-4-1", text: "Determine the shapes of some molecules from the number of the bonded pairs." }
            ]},
            { id: "chem-10-5", name: "Dipole Movement", learningObjectives: [
                { id: "chem-10-5-1", text: "Predict the molecular polarity from the shapes of molecules." }
            ]},
            { id: "chem-10-6", name: "Application of Dipole Movement", learningObjectives: [
                { id: "chem-10-6-1", text: "Explain what is meant by the term ionic character of the covalent bond." },
                { id: "chem-10-6-2", text: "Describe how knowledge of molecular polarity can be used to explain some physical and chemical properties of the molecules." }
            ]},
            { id: "chem-10-7", name: "Bond Energy", learningObjectives: [
                { id: "chem-10-7-1", text: "Define bond energies and explain how they can be used to compare bonds strength of different chemical bonds." }
            ]}
        ]},
        { id: "chem-11", name: "S- and P- Block Elements", subtopics: [
            { id: "chem-11-1", name: "Properties and their Trends", learningObjectives: [
                { id: "chem-11-1-1", text: "Define and explain the terms atomic radii, ionic radii, covalent radii, ionization energy, electron affinity, electro negativity, bond energy and bond length." }
            ]},
            { id: "chem-11-2", name: "S-, P-, D- & F- Block Elements", learningObjectives: [
                { id: "chem-11-2-1", text: "Recognize the demarcation of the periodic table into S-block, P-block, D-block and F-block." }
            ]},
            { id: "chem-11-3", name: "Reaction of Group I elements", learningObjectives: [
                { id: "chem-11-3-1", text: "Describe reactions of Group I elements with water, oxygen and chlorine." }
            ]},
            { id: "chem-11-4", name: "Reaction of Group II elements", learningObjectives: [
                { id: "chem-11-4-1", text: "Describe reactions of Group II elements with water, oxygen and chlorine." }
            ]},
            { id: "chem-11-5", name: "Reaction of Group IV elements", learningObjectives: [
                { id: "chem-11-5-1", text: "Describe reactions of Group IV Elements." }
            ]}
        ]},
        { id: "chem-12", name: "Transition Elements", subtopics: [
            { id: "chem-12-1", name: "Electronic Structure", learningObjectives: [
                { id: "chem-12-1-1", text: "Describe the electronic structures of the elements and ions of d-block Elements." }
            ]}
        ]},
        { id: "chem-13", name: "Fundamental Principles of Organic Chemistry", subtopics: [
            { id: "chem-13-1", name: "Definition and Classification of Organic Compound", learningObjectives: [
                { id: "chem-13-1-1", text: "Define organic chemistry and organic compound." },
                { id: "chem-13-1-2", text: "Classify organic compounds on structural basis." }
            ]},
            { id: "chem-13-2", name: "Functional Group", learningObjectives: [
                { id: "chem-13-2-1", text: "Define functional group." }
            ]},
            { id: "chem-13-3", name: "Isomerism", learningObjectives: [
                { id: "chem-13-3-1", text: "Explain stereoisomerism and its types." }
            ]}
        ]},
        { id: "chem-14", name: "Chemistry of Hydrocarbons", subtopics: [
            { id: "chem-14-1", name: "Nomenclature of Alkanes", learningObjectives: [
                { id: "chem-14-1-1", text: "Describe the nomenclature of Alkanes." }
            ]},
            { id: "chem-14-2", name: "Free Radical Mechanism", learningObjectives: [
                { id: "chem-14-2-1", text: "Define Free Radical Initiation, propagation and termination." },
                { id: "chem-14-2-2", text: "Describe the mechanism of the free radical substitution in alkanes exemplified by Methane and Ethane." }
            ]},
            { id: "chem-14-3", name: "Nomenclature of Alkenes", learningObjectives: [
                { id: "chem-14-3-1", text: "Explain the IUPAC nomenclature of alkenes." }
            ]},
            { id: "chem-14-4", name: "Shapes of Alkenes", learningObjectives: [
                { id: "chem-14-4-1", text: "Explain the shapes of the Ethene molecules in terms of Sigma and Pi C-C Bonds." }
            ]},
            { id: "chem-14-5", name: "Structure and Reactivity of Alkenes", learningObjectives: [
                { id: "chem-14-5-1", text: "Describe the structure and reactivity of Alkenes as exemplified by Ethene." }
            ]},
            { id: "chem-14-6", name: "Preparation of Alkanes", learningObjectives: [
                { id: "chem-14-6-1", text: "Explain Dehydration of Alcohols and Dehydrohalogenation of RX for the preparation of Ethane." }
            ]},
            { id: "chem-14-7", name: "MOT of Benzene", learningObjectives: [
                { id: "chem-14-7-1", text: "Explain the shape of Benzene Molecules (Molecular orbital treatment)." }
            ]},
            { id: "chem-14-8", name: "Resonance and Resonance Energy", learningObjectives: [
                { id: "chem-14-8-1", text: "Define resonance, resonance energy and relative stability." }
            ]},
            { id: "chem-14-9", name: "Reactivity of Benzene", learningObjectives: [
                { id: "chem-14-9-1", text: "Compare the reactivity of benzene with alkanes and alkenes." }
            ]},
            { id: "chem-14-10", name: "Chemical Reactions of Benzenes", learningObjectives: [
                { id: "chem-14-10-1", text: "Define addition reactions of benzene and methylbenzene." },
                { id: "chem-14-10-2", text: "Describe the mechanism of electrophilic substitution in Benzene." },
                { id: "chem-14-10-3", text: "Discuss chemistry of benzene and methylbenzene by nitration, sulphonation, halogenation, Friedal Craft's Alkylation and acylation." }
            ]},
            { id: "chem-14-11", name: "Effect of Substituents", learningObjectives: [
                { id: "chem-14-11-1", text: "Apply the knowledge of positions of substituents in the electrophilic substitution of benzene." }
            ]},
            { id: "chem-14-12", name: "IUPAC System of Alkynes", learningObjectives: [
                { id: "chem-14-12-1", text: "Use the IUPAC naming System of Alkynes." }
            ]},
            { id: "chem-14-13", name: "Preparation of Alkynes", learningObjectives: [
                { id: "chem-14-13-1", text: "Describe the preparation of Alkynes using elimination reactions." }
            ]},
            { id: "chem-14-14", name: "Acidity of Alkynes", learningObjectives: [
                { id: "chem-14-14-1", text: "Describe the acidity of alkynes." }
            ]},
            { id: "chem-14-15", name: "Reactions of Alkynes", learningObjectives: [
                { id: "chem-14-15-1", text: "Discuss chemistry of alkynes by hydrogenation, hydro halogenation and hydration." }
            ]},
            { id: "chem-14-16", name: "Substitution vs Addition", learningObjectives: [
                { id: "chem-14-16-1", text: "Describe and differentiate between substitution and Addition reactions." }
            ]}
        ]},
        { id: "chem-15", name: "Alkyl Halides", subtopics: [
            { id: "chem-15-1", name: "Nomenclature", learningObjectives: [
                { id: "chem-15-1-1", text: "Name Alkyl Halides using IUPAC system." }
            ]},
            { id: "chem-15-2", name: "Structure and Reactivity", learningObjectives: [
                { id: "chem-15-2-1", text: "Discuss the structure and reactivity of RX." }
            ]},
            { id: "chem-15-3", name: "Substitution vs Elimination", learningObjectives: [
                { id: "chem-15-3-1", text: "Describe the mechanism and types of nucleophilic substitution reactions." },
                { id: "chem-15-3-2", text: "Describe the mechanism and types of elimination reactions." }
            ]}
        ]},
        { id: "chem-16", name: "Alcohols and Phenols", subtopics: [
            { id: "chem-16-1", name: "Nomenclature, structure and reactivity of Alcohol", learningObjectives: [
                { id: "chem-16-1-1", text: "Explain nomenclature and structure of Alcohols." },
                { id: "chem-16-1-2", text: "Explain the reactivity of Alcohols." },
                { id: "chem-16-1-3", text: "Describe the chemistry of alcohols by preparation of ethers and esters." }
            ]},
            { id: "chem-16-2", name: "Nomenclature, structure and reactivity of Phenols", learningObjectives: [
                { id: "chem-16-2-1", text: "Explain the nomenclature, structure and reactivity of Alcohol." },
                { id: "chem-16-2-2", text: "Discuss the reactivity of phenol and their chemistry by electrophilic aromatic substitution." }
            ]},
            { id: "chem-16-3", name: "Alcohols and Phenols", learningObjectives: [
                { id: "chem-16-3-1", text: "Differentiate between an alcohol and phenol." }
            ]}
        ]},
        { id: "chem-17", name: "Aldehydes and Ketones", subtopics: [
            { id: "chem-17-1", name: "Nomenclature and structure of Aldehydes and Ketones", learningObjectives: [
                { id: "chem-17-1-1", text: "Explain nomenclature and structure of Aldehydes and Ketones." }
            ]},
            { id: "chem-17-2", name: "Preparation", learningObjectives: [
                { id: "chem-17-2-1", text: "Discuss the preparation of aldehydes and ketones." }
            ]},
            { id: "chem-17-3", name: "Reactivity of Aldehydes and Ketones", learningObjectives: [
                { id: "chem-17-3-1", text: "Describe Reactivity of Aldehydes and Ketones and their comparison." }
            ]},
            { id: "chem-17-4", name: "Reaction of Aldehydes and Ketones", learningObjectives: [
                { id: "chem-17-4-1", text: "Describe Acid and Base catalyzed Nucleophilic addition reactions of aldehydes and ketones." },
                { id: "chem-17-4-2", text: "Discuss the chemistry of Aldehydes and Ketones by their reduction to alcohols." },
                { id: "chem-17-4-3", text: "Describe oxidation reactions of aldehydes and ketones." }
            ]}
        ]},
        { id: "chem-18", name: "Carboxylic Acids", subtopics: [
            { id: "chem-18-1", name: "Nomenclature, Structure and Preparation of Carboxylic Acid", learningObjectives: [
                { id: "chem-18-1-1", text: "Describe nomenclature, Structure and Preparation of Carboxylic Acid." }
            ]},
            { id: "chem-18-2", name: "Chemical Reactions/Reactivity", learningObjectives: [
                { id: "chem-18-2-1", text: "Discuss reactivity of carboxylic acid." }
            ]},
            { id: "chem-18-3", name: "Conversion of Carboxylic Acid", learningObjectives: [
                { id: "chem-18-3-1", text: "Describe the Chemistry of carboxylic acid by conversion to carboxylic acid derivative: acyl halides, an acid hydrides, esters and reaction involving into conversion of these." }
            ]}
        ]},
        { id: "chem-19", name: "Macromolecules", subtopics: [
            { id: "chem-19-1", name: "Classification of Proteins", learningObjectives: [
                { id: "chem-19-1-1", text: "Explain the basis of classification and structure function relationship of proteins." }
            ]},
            { id: "chem-19-2", name: "Importance of Proteins", learningObjectives: [
                { id: "chem-19-2-1", text: "Describe the role of various proteins in maintaining body functions and their Nutritional importance." }
            ]},
            { id: "chem-19-3", name: "Enzymes as Biocatalyst", learningObjectives: [
                { id: "chem-19-3-1", text: "Describe the role of enzymes as Biocatalyst." }
            ]}
        ]},
        { id: "chem-20", name: "Industrial Chemistry", subtopics: [
            { id: "chem-20-1", name: "Adhesive", learningObjectives: [
                { id: "chem-20-1-1", text: "Know about types and application of Adhesive." }
            ]},
            { id: "chem-20-2", name: "Dyes", learningObjectives: [
                { id: "chem-20-2-1", text: "Know about types of dies and their uses." }
            ]},
            { id: "chem-20-3", name: "Polymers", learningObjectives: [
                { id: "chem-20-3-1", text: "Know about condensation and addition polymers and their sub-types." }
            ]}
        ]}
    ],
  },
  physics: {
    name: "Physics",
    slug: "physics",
    chapters: [
        { id: "phy-1", name: "Vectors and Equilibrium", subtopics: [
            { id: "phy-1-1", name: "Addition of Vectors (Rectangular Components)", learningObjectives: [
                { id: "phy-1-1-1", text: "Determine the sum of vectors using perpendicular Components." }
            ]},
            { id: "phy-1-2", name: "Product of Vectors (Scalar Product)", learningObjectives: [
                { id: "phy-1-2-1", text: "Describe Scalar Product of two vectors in term of angle between them." }
            ]},
            { id: "phy-1-3", name: "Product of Vectors (Vector Product)", learningObjectives: [
                { id: "phy-1-3-1", text: "Describe Vector product of two vectors in terms of angle between them." }
            ]}
        ]},
        { id: "phy-2", name: "Force and Motion", subtopics: [
            { id: "phy-2-1", name: "Displacement", learningObjectives: [ { id: "phy-2-1-1", text: "Describe displacement." } ]},
            { id: "phy-2-2", name: "Velocity", learningObjectives: [ { id: "phy-2-2-1", text: "Describe average velocity of objects." } ]},
            { id: "phy-2-3", name: "Displacement-time Graph", learningObjectives: [ { id: "phy-2-3-1", text: "Interpret displacement-time graph of objects moving along the same straight line." } ]},
            { id: "phy-2-4", name: "Acceleration", learningObjectives: [ { id: "phy-2-4-1", text: "Describe acceleration." } ]},
            { id: "phy-2-5", name: "Uniform and variable acceleration", learningObjectives: [ { id: "phy-2-5-1", text: "Distinguish between uniform and variable acceleration." } ]},
            { id: "phy-2-6", name: "Projectile motion", learningObjectives: [
                { id: "phy-2-6-1", text: "Explain that projectile motion is two-dimensional motion in a vertical plane." },
                { id: "phy-2-6-2", text: "Communicate the ideas of a projectile in the absence of air resistance." },
                { id: "phy-2-6-3", text: "Explain Horizontal component (VH) of velocity is constant." },
                { id: "phy-2-6-4", text: "Acceleration is in the vertical direction and is the same as that of a vertically free- falling object." },
                { id: "phy-2-6-5", text: "Differentiate between the characteristics of horizontal motion and vertical motion." },
                { id: "phy-2-6-6", text: "Evaluate, using equations of uniformly accelerated motion for a given initial velocity of frictionless projectile, the following issues: a. How much higher does it go? b. How far would it go along the level land? c. Where would it be after a given time? d. How long will it remain in air? e. Determine the parameters for a projectile launched from ground height. f. Launch angle that results in the maximum range. g. Relation between the launch angles that result in the same range." }
            ]},
            { id: "phy-2-7", name: "Newton's Laws of motion", learningObjectives: [ { id: "phy-2-7-1", text: "Apply Newton's laws to explain the motion of objects in a variety of context." } ]},
            { id: "phy-2-8", name: "Newton's Second Law and Linear momentum", learningObjectives: [ { id: "phy-2-8-1", text: "Describe the Newton's second law of motion as rate of change of momentum." } ]},
            { id: "phy-2-9", name: "Newton's third law of motion", learningObjectives: [ { id: "phy-2-9-1", text: "Correlate Newton's third law of motion and conservation of momentum." } ]},
            { id: "phy-2-10", name: "Collision", learningObjectives: [ { id: "phy-2-10-1", text: "Solve different problems of elastic and inelastic collisions between two bodies in one dimension by using law of conservation of momentum." } ]},
            { id: "phy-2-11", name: "Momentum and Explosive forces", learningObjectives: [ { id: "phy-2-11-1", text: "Describe that momentum is conservational in all situations." } ]},
            { id: "phy-2-12", name: "Perfectly elastic collision in one dimension", learningObjectives: [ { id: "phy-2-12-1", text: "Identify that for a perfectly elastic collision, the relative speed of approach is equal to the relative speed of separation." } ]}
        ]},
        { id: "phy-3", name: "Work and Energy", subtopics: [
            { id: "phy-3-1", name: "Work", learningObjectives: [ { id: "phy-3-1-1", text: "Describe the concept of work in terms of the product of force F and displacement d in the direction of force." } ]},
            { id: "phy-3-2", name: "Energy", learningObjectives: [ { id: "phy-3-2-1", text: "Describe energy." } ]},
            { id: "phy-3-3", name: "Kinetic Energy", learningObjectives: [ { id: "phy-3-3-1", text: "Explain kinetic energy." } ]},
            { id: "phy-3-4", name: "Potential energy", learningObjectives: [ { id: "phy-3-4-1", text: "Explain the difference between potential energy and gravitational potential energy." } ]},
            { id: "phy-3-5", name: "Absolute potential energy", learningObjectives: [ { id: "phy-3-5-1", text: "Describe that the gravitational potential energy is measured from a reference level and can be positive or negative, to denote the orientation from the reference levels." } ]},
            { id: "phy-3-6", name: "Power", learningObjectives: [ { id: "phy-3-6-1", text: "Express power as scalar product of force and velocity." } ]},
            { id: "phy-3-7", name: "Work energy theorem in resistive medium", learningObjectives: [ { id: "phy-3-7-1", text: "Explain that work done against friction is dissipated as heat in the environment." } ]},
            { id: "phy-3-8", name: "Implications of energy losses in practical devices and Efficiency", learningObjectives: [ { id: "phy-3-8-1", text: "State the implications of energy losses in practical devices." } ]}
        ]},
        { id: "phy-4", name: "Rotational and Circular Motion", subtopics: [
            { id: "phy-4-1", name: "Angular displacement", learningObjectives: [
                { id: "phy-4-1-1", text: "Define angular displacement, express angular displacement in radians." },
                { id: "phy-4-1-2", text: "Define revolution, degree and radian." }
            ]},
            { id: "phy-4-2", name: "Angular Velocity", learningObjectives: [ { id: "phy-4-2-1", text: "Describe the term angular velocity." } ]},
            { id: "phy-4-3", name: "Relation between angular and linear quantities", learningObjectives: [ { id: "phy-4-3-1", text: "Find out the relationship between the following: a. Relation between linear and angular variables b. Relation between linear and angular displacements c. Relation between linear and angular velocities d. Relation between linear and angular accelerations." } ]}
        ]},
        { id: "phy-5", name: "Fluid Dynamics", subtopics: [
            { id: "phy-5-1", name: "Terminal Velocity", learningObjectives: [ { id: "phy-5-1-1", text: "Describe the terminal velocity of an object." } ]},
            { id: "phy-5-2", name: "Fluid Drag", learningObjectives: [ { id: "phy-5-2-1", text: "Define and explain the term fluid drag." } ]},
            { id: "phy-5-3", name: "Fluid Flow", learningObjectives: [
                { id: "phy-5-3-1", text: "Define the terms: Steady (Streamline or laminar) flow, Incompressible flow and non-viscous flow as applied to the motion of an ideal fluid." },
                { id: "phy-5-3-2", text: "Explain that at the sufficiently high velocity, the flow of viscous fluid undergoes a transition from laminar to turbulence conditions." },
                { id: "phy-5-3-3", text: "Describe that majority of practical examples of fluid flow and resistance to motion in fluid involve turbulent rather than laminar conditions." }
            ]},
            { id: "phy-5-4", name: "Equation of Continuity", learningObjectives: [
                { id: "phy-5-4-1", text: "Describe equation of continuity Av= constant for the flow of an ideal and incompressible fluid and solve problems using it." },
                { id: "phy-5-4-2", text: "Identify that the equation of continuity is the form of principle of conservation of mass." }
            ]},
            { id: "phy-5-5", name: "Bernoulli's Equation", learningObjectives: [
                { id: "phy-5-5-1", text: "Interpret and apply Bernoulli's effect in Blood physics." },
                { id: "phy-5-5-2", text: "Derive Bernoulli's equation for the case of horizontal tube of flow." },
                { id: "phy-5-5-3", text: "Describe the pressure difference can arise from different rates of flow of fluid (Bernoulli's effect)." }
            ]}
        ]},
        { id: "phy-6", name: "Waves", subtopics: [
            { id: "phy-6-1", name: "Motion of wave", learningObjectives: [ { id: "phy-6-1-1", text: "Describe the meaning of wave motion as illustrated by vibrations in ropes and springs." } ]},
            { id: "phy-6-2", name: "Progressive waves", learningObjectives: [
                { id: "phy-6-2-1", text: "Demonstrate that mechanical waves require a medium for their propagation while electromagnetic waves do not." },
                { id: "phy-6-2-2", text: "Describe that energy is transferred due to a progressive wave." }
            ]},
            { id: "phy-6-3", name: "Characteristics of wave", learningObjectives: [ { id: "phy-6-3-1", text: "Define and apply the following terms to the wave model; medium, displacement, amplitude, period, compression, rarefaction, crest, trough, wavelength, velocity." } ]},
            { id: "phy-6-4", name: "Wave Speed", learningObjectives: [ { id: "phy-6-4-1", text: "Solve problems using the equation: v=f*lambda." } ]},
            { id: "phy-6-5", name: "Classification of progressive waves", learningObjectives: [ { id: "phy-6-5-1", text: "Compare transverse and longitudinal waves." } ]},
            { id: "phy-6-6", name: "Speed of sound, Newton's Formula for speed of sound in air", learningObjectives: [ { id: "phy-6-6-1", text: "Explain that speed of sound depends on the properties of medium in which it propagates and describe Newton's formula of speed of waves." } ]},
            { id: "phy-6-7", name: "Laplace's Correction", learningObjectives: [ { id: "phy-6-7-1", text: "Describe the Laplace correction in Newton's formula for speed of sound in air." } ]},
            { id: "phy-6-8", name: "Effect of various factors on speed of sound", learningObjectives: [ { id: "phy-6-8-1", text: "Identify the factors on which speed of sound in air depends." } ]},
            { id: "phy-6-9", name: "Superposition of waves", learningObjectives: [
                { id: "phy-6-9-1", text: "Describe the principle of super position of two waves from coherent sources." },
                { id: "phy-6-9-2", text: "Explain the principle of Superposition." }
            ]},
            { id: "phy-6-10", name: "Interference of sound waves", learningObjectives: [ { id: "phy-6-10-1", text: "Describe the phenomenon of interference of sound waves." } ]},
            { id: "phy-6-11", name: "Stationary waves", learningObjectives: [
                { id: "phy-6-11-1", text: "Explain the formation of stationary waves using graphical method." },
                { id: "phy-6-11-2", text: "Define the terms, node and antinodes." }
            ]},
            { id: "phy-6-12", name: "Stationary waves in a stretched string", learningObjectives: [ { id: "phy-6-12-1", text: "Describe modes of vibration of strings." } ]},
            { id: "phy-6-13", name: "Organ pipes", learningObjectives: [ { id: "phy-6-13-1", text: "Describe formation of stationary waves in vibrating air columns." } ]},
            { id: "phy-6-14", name: "Simple Harmonic Motion", learningObjectives: [ { id: "phy-6-14-1", text: "Explain Simple Harmonic Motion (S.H.M) and explain the characteristics of S.H.M." } ]},
            { id: "phy-6-15", name: "Circular Motion and SHM", learningObjectives: [ { id: "phy-6-15-1", text: "Describe that when an object moves in a circle, the motion of its projection on the diameter of a circle is SHM." } ]}
        ]},
        { id: "phy-7", name: "Thermodynamics", subtopics: [
            { id: "phy-7-1", name: "Thermal equilibrium, Heat", learningObjectives: [ { id: "phy-7-1-1", text: "Describe that thermal energy is transferred from a region of higher temperature to a region of lower temperature." } ]},
            { id: "phy-7-2", name: "Molar specific heat of gas", learningObjectives: [
                { id: "phy-7-2-1", text: "Differentiate between specific heat and molar specific heat." },
                { id: "phy-7-2-2", text: "Define the terms, specific heat and molar specific heats of a gas." }
            ]},
            { id: "phy-7-3", name: "Work", learningObjectives: [ { id: "phy-7-3-1", text: "Calculate work done by a thermodynamic system during a volume change." } ]},
            { id: "phy-7-4", name: "First law of thermodynamics", learningObjectives: [
                { id: "phy-7-4-1", text: "Describe the first law of thermodynamics expressed in terms of the change in internal energy, the heating of the system and work done on the system." },
                { id: "phy-7-4-2", text: "Explain that first law of thermodynamics expresses the conservation of energy." }
            ]},
            { id: "phy-7-5", name: "Relation between molar specific heat at constant volume and constant pressure", learningObjectives: [ { id: "phy-7-5-1", text: "Apply the first law of thermodynamics to derive the relation C_p−C_v=R for an ideal gas." } ]}
        ]},
        { id: "phy-8", name: "Electrostatics", subtopics: [
            { id: "phy-8-1", name: "Coulomb's Law", learningObjectives: [ { id: "phy-8-1-1", text: "State Coulomb's law and explain that force between two-point charges is reduced in a medium other than free space using Coulomb's law." } ]},
            { id: "phy-8-2", name: "Electric Field", learningObjectives: [ { id: "phy-8-2-1", text: "Describe the concept of an electric field as an example of a field of force." } ]},
            { id: "phy-8-3", name: "Electric field intensity due to a point charge", learningObjectives: [ { id: "phy-8-3-1", text: "Calculate the magnitude and direction of the electric field at a point due to two charges with the same or opposite signs." } ]},
            { id: "phy-8-4", name: "Representation of electric field by lines", learningObjectives: [ { id: "phy-8-4-1", text: "Sketch the electric field lines for two-point charges of equal magnitude with same or opposite signs." } ]},
            { id: "phy-8-5", name: "Electric field intensity due to an infinite sheet of charges", learningObjectives: [ { id: "phy-8-5-1", text: "Describe and draw the electric field due to an infinite size conducting plate of positive or negative charge." } ]},
            { id: "phy-8-6", name: "Electric potential energy and potential due to a point charge", learningObjectives: [
                { id: "phy-8-6-1", text: "Define electric potential at a point in terms of the work done in bringing unit positive charge from infinity to that point." },
                { id: "phy-8-6-2", text: "Derive an expression for electric potential at a point due to a point charge." }
            ]},
            { id: "phy-8-7", name: "Electric potential", learningObjectives: [ { id: "phy-8-7-1", text: "Define the unit of potential." } ]},
            { id: "phy-8-8", name: "Charging and discharging of a capacitor through a resistance", learningObjectives: [ { id: "phy-8-8-1", text: "Demonstrate charging and discharging of a capacitor through a resistance." } ]}
        ]},
        { id: "phy-9", name: "Current Electricity", subtopics: [
            { id: "phy-9-1", name: "Steady current", learningObjectives: [ { id: "phy-9-1-1", text: "Describe the concept of steady current." } ]},
            { id: "phy-9-2", name: "Ohm's Law", learningObjectives: [ { id: "phy-9-2-1", text: "State Ohm's law." } ]},
            { id: "phy-9-3", name: "Factors on which resistance depends, Temperature coefficient of resistivity", learningObjectives: [ { id: "phy-9-3-1", text: "Define resistivity and explain its dependence upon temperature." } ]},
            { id: "phy-9-4", name: "Internal resistance of sources", learningObjectives: [ { id: "phy-9-4-1", text: "Explain the internal resistance of sources and its consequences for external circuits." } ]},
            { id: "phy-9-5", name: "Maximum power Output", learningObjectives: [ { id: "phy-9-5-1", text: "Describe the conditions for maximum power transfer." } ]}
        ]},
        { id: "phy-10", name: "Electromagnetism", subtopics: [
            { id: "phy-10-1", name: "Magnetic flux density/Magnetic field", learningObjectives: [ { id: "phy-10-1-1", text: "Define magnetic flux density and its units." } ]},
            { id: "phy-10-2", name: "Magnetic flux", learningObjectives: [ { id: "phy-10-2-1", text: "Describe the concept of magnetic flux (Phi) as scalar product of magnetic field(B) and area(A)using the relation Phi_B=B_perpA=B.A." } ]},
            { id: "phy-10-3", name: "Motion of charged particle in magnetic field", learningObjectives: [
                { id: "phy-10-3-1", text: "Describe quantitatively the path followed by a charged particle shot into a magnetic field in a direction perpendicular to the field." },
                { id: "phy-10-3-2", text: "Explain that a force may act on a charged particle in a uniform magnetic field." }
            ]}
        ]},
        { id: "phy-11", name: "Electromagnetic Induction", subtopics: [
            { id: "phy-11-1", name: "Faraday's Law of electromagnetic induction", learningObjectives: [ { id: "phy-11-1-1", text: "State Faraday's law of electromagnetic induction." } ]},
            { id: "phy-11-2", name: "Lenz's Law", learningObjectives: [ { id: "phy-11-2-1", text: "Account for Lenz's law to predict the direction of an induced current and relate to the principle of conservation of energy." } ]},
            { id: "phy-11-3", name: "Transformer", learningObjectives: [
                { id: "phy-11-3-1", text: "Describe the construction of a transformer and explain how it works." },
                { id: "phy-11-3-2", text: "Describe how set-up and step-down transformers can be used to ensure efficient transfer of electricity along cables." }
            ]}
        ]},
        { id: "phy-12", name: "Alternating Current", subtopics: [
            { id: "phy-12-1", name: "Phase of Alternating Current", learningObjectives: [ { id: "phy-12-1-1", text: "Describe the phase of Alternating Current and explain how phase lag and phase lead occur in AC circuits." } ]},
            { id: "phy-12-2", name: "AC through a. Resistor b. Capacitor. c. Inductor", learningObjectives: [ { id: "phy-12-2-1", text: "Explain the flow of AC through resistors, Capacitors and Inductor." } ]},
            { id: "phy-12-3", name: "Electromagnetic waves", learningObjectives: [ { id: "phy-12-3-1", text: "Become familiar with EM spectrum (ranging from radio waves to Gamma rays)." } ]}
        ]},
        { id: "phy-13", name: "Electronics", subtopics: [
            { id: "phy-13-1", name: "Rectification", learningObjectives: [ { id: "phy-13-1-1", text: "Define rectification and describe the use of diodes for half and full wave rectifications." } ]},
            { id: "phy-13-2", name: "PN Junction", learningObjectives: [ { id: "phy-13-2-1", text: "Describe the PN Junction and discuss its forward and reverse biasing." } ]}
        ]},
        { id: "phy-14", name: "Dawn of Modern Physics", subtopics: [
            { id: "phy-14-1", name: "Quantum Theory and Radiation", learningObjectives: [ { id: "phy-14-1-1", text: "Explain the particle model of light in terms of photons with energy." } ]}
        ]},
        { id: "phy-15", name: "Atomic Spectra", subtopics: [
            { id: "phy-15-1", name: "Atomic Spectra", learningObjectives: [ { id: "phy-15-1-1", text: "Describe and explain atomic spectra/ line spectrum." } ]}
        ]},
        { id: "phy-16", name: "Nuclear Physics", subtopics: [
            { id: "phy-16-1", name: "Composition of atomic nuclei", learningObjectives: [ { id: "phy-16-1-1", text: "Describe a simple model for the atom to include protons, neutrons and electrons." } ]},
            { id: "phy-16-2", name: "Spontaneous and random nuclear decay", learningObjectives: [ { id: "phy-16-2-1", text: "Identify the spontaneous and random nature of nuclear decay." } ]},
            { id: "phy-16-3", name: "Half-life and rate of decay", learningObjectives: [ { id: "phy-16-3-1", text: "Describe the term half-life and solve problems using the equation lambda = 0.693 / T_1/2." } ]},
            { id: "phy-16-4", name: "Biological and Medical uses of radiation", learningObjectives: [ { id: "phy-16-4-1", text: "Describe biological effects of radiation state and explain the different medical uses of radiation." } ]}
        ]}
    ],
  },
  english: {
    name: "English",
    slug: "english",
    chapters: [
        { id: "eng-1", name: "Reading and Thinking Skills", subtopics: [
            { id: "eng-1-1", name: "Reading and Thinking Skills", learningObjectives: [
                { id: "eng-1-1-1", text: "Scan to answer short Questions." },
                { id: "eng-1-1-2", text: "Deduce the meanings of the context." },
                { id: "eng-1-1-3", text: "Analyze how a writer/poet uses language to apprehend to the senses for figurative language." }
            ]}
        ]},
        { id: "eng-2", name: "Formal and Lexical Aspect of Language", subtopics: [
            { id: "eng-2-1", name: "Formal and Lexical Aspect of Language", learningObjectives: [
                { id: "eng-2-1-1", text: "Deduce the meaning of difficult words from the context using contextual clues." },
                { id: "eng-2-1-2", text: "Explore the use of Synonyms with varying shades of meaning used for irony, parody and satire." },
                { id: "eng-2-1-3", text: "Illustrate use of pronoun-antecedent agreement." },
                { id: "eng-2-1-4", text: "Illustrate use of tenses." },
                { id: "eng-2-1-5", text: "Illustrate use of infinitives and infinitives phrases." },
                { id: "eng-2-1-6", text: "Illustrate the use of gerund and gerund phrases." },
                { id: "eng-2-1-7", text: "Recognize varying position of adverbs in sentences according to their kinds and importance." },
                { id: "eng-2-1-8", text: "Illustrate use of prepositions of position, time, movements and directions." },
                { id: "eng-2-1-9", text: "Use in speech and writing, all the appropriate transitional devices." },
                { id: "eng-2-1-10", text: "Illustrate use of all punctuation marks wherever applicable." },
                { id: "eng-2-1-11", text: "Analyze sentences for different classes and phrases, evaluate how their position in sentences when change meaning and different communication function." },
                { id: "eng-2-1-12", text: "Recognize and use sentence in version for various purposes." },
                { id: "eng-2-1-13", text: "Use active and passive voice appropriately in speech and writing according to the required communicative function." },
                { id: "eng-2-1-14", text: "Use direct and indirect speech appropriately in speech and writing according to the e required communicative function." }
            ]}
        ]},
        { id: "eng-3", name: "Writing Skills", subtopics: [
            { id: "eng-3-1", name: "Writing Skills", learningObjectives: [
                { id: "eng-3-1-1", text: "Proof read and edit their own peers and given text for the error of usage and style." },
                { id: "eng-3-1-2", text: "Faulty sentence structure." },
                { id: "eng-3-1-3", text: "Subject verb agreement." },
                { id: "eng-3-1-4", text: "Errors of functions and spellings." }
            ]}
        ]}
    ],
  },
  "logical-reasoning": {
    name: "Logical Reasoning",
    slug: "logical-reasoning",
    chapters: [
        { id: "lr-1", name: "Critical Thinking", subtopics: [
            { id: "lr-1-1", name: "Critical Thinking", learningObjectives: [
                { id: "lr-1-1-1", text: "Develop logical arguments for the statements to be true or false." },
                { id: "lr-1-1-2", text: "Give reasons for the right beliefs." },
                { id: "lr-1-1-3", text: "Identify and critically evaluate false beliefs using logical reasoning." }
            ]}
        ]},
        { id: "lr-2", name: "Letter and Symbol Series", subtopics: [
            { id: "lr-2-1", name: "Letter and Symbol Series", learningObjectives: [
                { id: "lr-2-1-1", text: "Develop arithmetical operations as per numbers." },
                { id: "lr-2-1-2", text: "Develop geometrical progression as per numbers." },
                { id: "lr-2-1-3", text: "Develop series/sequential orders as per letter and symbols (according to specific rules)." }
            ]}
        ]},
        { id: "lr-3", name: "Logical Deductions", subtopics: [
            { id: "lr-3-1", name: "Logical Deductions", learningObjectives: [
                { id: "lr-3-1-1", text: "Predict new relations on the basis of given relations." },
                { id: "lr-3-1-2", text: "Develop new structure on the basis of information in already drawn structures." }
            ]}
        ]},
        { id: "lr-4", name: "Logical Problems", subtopics: [
            { id: "lr-4-1", name: "Logical Problems", learningObjectives: [
                { id: "lr-4-1-1", text: "Infer result of one problem to resolve another problem." },
                { id: "lr-4-1-2", text: "Develop skills to solve puzzles." }
            ]}
        ]},
        { id: "lr-5", name: "Course of Action", subtopics: [
            { id: "lr-5-1", name: "Course of Action", learningObjectives: [
                { id: "lr-5-1-1", text: "Develop skills to gather parts of information." },
                { id: "lr-5-1-2", text: "Use information for making decisions." },
                { id: "lr-5-1-3", text: "Judge different courses by using arguments." }
            ]}
        ]},
        { id: "lr-6", name: "Cause and Effect", subtopics: [
            { id: "lr-6-1", name: "Cause and Effect", learningObjectives: [
                { id: "lr-6-1-1", text: "Give reasons for incidents/events and accidents." },
                { id: "lr-6-1-2", text: "Reject false beliefs through valid arguments." },
                { id: "lr-6-1-3", text: "Build positive thinking in the society through strong arguments." }
            ]}
        ]}
    ],
  },
};
