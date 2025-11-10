// Central class catalog used by Management and Brothers page
export const DEFAULT_CLASSES = [
  {
    id: "charter",
    name: "Charter Conquest",
  },
  {
    id: "alpha",
    name: "Alpha Ascension",
  },
  {
    id: "beta",
    name: "Beta Batallion",
  },
  {
    id: "gamma",
    name: "Gamma Guardians",
  },
  {
    id: "delta",
    name: "Delta Dimension",
  },
  {
    id: "epsilon",
    name: "Epsilon Eclipse",
  },
  {
    id: "zeta",
    name: "Zeta Zaibatsu",
  },
  {
    id: "eta",
    name: "Eta Evolution",
  },
  {
    id: "theta",
    name: "Theta Trinity",
  },
  {
    id: "iota",
    name: "Iota Immortals",
  },
  {
    id: "kappa",
    name: "Kappa Kazoku",
  },
  {
    id: "mu",
    name: "Mu Monarchs",
  },
  {
    id: "nu",
    name: "Nu Nen",
  },
  {
    id: "xi",
    name: "Xi Xin",
  },
  {
    id: "omicron",
    name: "Omicron Okami",
  },
  {
    id: "pi",
    name: "Pi Paragons",
  },
];

const STORAGE_KEY = "classesCatalog";

export const loadClasses = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const classes = saved ? JSON.parse(saved) : DEFAULT_CLASSES;
    return Array.isArray(classes) ? classes : DEFAULT_CLASSES;
  } catch {
    return DEFAULT_CLASSES;
  }
};

export const saveClasses = (classes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
    return true;
  } catch {
    return false;
  }
};
