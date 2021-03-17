export const existingPorts = {
  HAM: "Hamina",
  HEL: "Helsinki",
  TUR: "Turku",
  ALA: "Åland",
  POR: "Pori",
  VAA: "Vaasa",
  KOK: "Kokkola",
  OUL: "Oulu",
};

export const allowedPorts = {
  HAM: ["HAM", "HEL"],
  HEL: ["HEL", "HAM", "TUR"],
  TUR: ["TUR", "HEL", "POR"],
  ALA: ["ALA", "TUR"],
  POR: ["POR", "ALA", "VAA", "TUR"],
  VAA: ["VAA", "POR", "KOK"],
  KOK: ["KOK", "VAA", "OUL"],
  OUL: ["OUL", "VAA"],
};
