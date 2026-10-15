// Planetary Math Engine & Astronomical Calculations

export const PLANET_YEAR_DAYS = {
  mercury: { name: 'Mercury', days: 87.97, symbol: '☿', color: '#B5B5B5', desc: 'Solar Scorched' },
  venus: { name: 'Venus', days: 224.70, symbol: '♀', color: '#E3BB7B', desc: 'Sulfur Atmosphere' },
  earth: { name: 'Earth', days: 365.25, symbol: '🜨', color: '#4BA3E3', desc: 'Home Origin' },
  mars: { name: 'Mars', days: 686.98, symbol: '♂', color: '#FF4B2B', desc: 'Red Frontier' },
  jupiter: { name: 'Jupiter', days: 4332.59, symbol: '♃', color: '#D99B66', desc: 'Gas Giant Citadel' },
  saturn: { name: 'Saturn', days: 10759.22, symbol: '♄', color: '#E8D099', desc: 'Ring System Ringmaster' },
  uranus: { name: 'Uranus', days: 30685.40, symbol: '♅', color: '#7DE3E8', desc: 'Cryo Ice Giant' },
  neptune: { name: 'Neptune', days: 60189.00, symbol: '♆', color: '#4B6BFF', desc: 'Deep Void Sentinel' },
};

export const SOL_IN_EARTH_DAYS = 1.02749125; // 24 hours 39 minutes 35.244 seconds

export function calculatePlanetaryAges(birthDateString) {
  if (!birthDateString) return null;
  const birthDate = new Date(birthDateString);
  const now = new Date();
  
  const diffTime = now.getTime() - birthDate.getTime();
  if (isNaN(diffTime) || diffTime <= 0) return null;

  const earthDays = diffTime / (1000 * 60 * 60 * 24);
  const earthYears = earthDays / 365.25;

  const marsAge = earthDays / PLANET_YEAR_DAYS.mars.days;
  const marsSols = earthDays / SOL_IN_EARTH_DAYS;

  // Next Martian Birthday calculation
  const nextMarsAge = Math.floor(marsAge) + 1;
  const nextMarsDayTotal = nextMarsAge * PLANET_YEAR_DAYS.mars.days;
  const targetDateMs = birthDate.getTime() + (nextMarsDayTotal * 24 * 60 * 60 * 1000);
  const msUntilNextMarsBday = Math.max(0, targetDateMs - now.getTime());
  const daysUntilNextMarsBday = msUntilNextMarsBday / (1000 * 60 * 60 * 24);
  const solsUntilNextMarsBday = daysUntilNextMarsBday / SOL_IN_EARTH_DAYS;

  // Other planets
  const planetaryAges = Object.entries(PLANET_YEAR_DAYS).map(([key, planet]) => {
    const age = earthDays / planet.days;
    return {
      id: key,
      name: planet.name,
      symbol: planet.symbol,
      color: planet.color,
      desc: planet.desc,
      orbitDays: planet.days,
      ageFormatted: age < 1 ? age.toFixed(2) : age.toFixed(1),
      exactAge: age
    };
  });

  // Viral Status computation
  const statusInfo = getMartianStatus(marsAge);

  // Sol of birth (arbitrary epoch calculation relative to Curiosity/Perseverance landing base epoch)
  const marsBirthSol = Math.floor(birthDate.getTime() / (88775.244 * 1000) % 100000);

  return {
    earthDays: Math.floor(earthDays),
    earthYears: earthYears.toFixed(1),
    marsAge: marsAge.toFixed(2),
    marsAgeFloat: marsAge,
    marsSols: Math.floor(marsSols),
    marsBirthSol: Math.abs(marsBirthSol),
    nextMarsAge,
    nextMarsDate: new Date(targetDateMs),
    msUntilNextMarsBday,
    daysUntilNextMarsBday: Math.floor(daysUntilNextMarsBday),
    solsUntilNextMarsBday: solsUntilNextMarsBday.toFixed(1),
    planetaryAges,
    status: statusInfo,
    licenseNumber: generateLicenseNumber(birthDateString)
  };
}

export function getMartianStatus(marsAge) {
  if (marsAge < 2.0) {
    return {
      title: "TODDLER ROVER PILOT",
      badge: "AGE " + marsAge.toFixed(1),
      summary: "CRADLED IN PRESSURIZED BIODOME",
      permit: "CLASS 0 // STROLLER EXOSUIT ONLY",
      tagline: "Legally a baby on Mars. Low-gravity bounce certified."
    };
  } else if (marsAge < 6.0) {
    return {
      title: "ACADEMY CADET",
      badge: "AGE " + marsAge.toFixed(1),
      summary: "OLYMPUS MONS PRESCHOOL DETACHMENT",
      permit: "CLASS K // SUPERVISED OXYGEN RIG",
      tagline: "Still learning orbital mechanics and regolith sandcastles."
    };
  } else if (marsAge < 13.0) {
    return {
      title: "PRE-TEEN ROVER SCOUT",
      badge: "AGE " + marsAge.toFixed(1),
      summary: "CRATER NAVIGATOR GRADE II",
      permit: "CLASS C-PR // DUNE BUGGY SIMULATOR",
      tagline: "Young pioneer. Allowed inside habitat hydroponic gardens."
    };
  } else if (marsAge < 18.0) {
    return {
      title: "LEGALLY A TEENAGER",
      badge: "AGE " + marsAge.toFixed(1),
      summary: "MARS ROVER LEARNER'S PERMIT",
      permit: "CLASS B-MVR // DUNE CRAWLER PROVISIONAL",
      tagline: "Adult on Earth, but freshly a teenager on Mars. Curfew: 22:00 Sol time."
    };
  } else if (marsAge < 21.0) {
    return {
      title: "YOUNG ADULT EXPLORER",
      badge: "AGE " + marsAge.toFixed(1),
      summary: "EXPEDITION CO-PILOT",
      permit: "CLASS A-EXO // UNRESTRICTED CANYON RUNS",
      tagline: "Finally of legal drinking age at the Olympus Mons Crater Bar."
    };
  } else if (marsAge < 35.0) {
    return {
      title: "PRIME MARTIAN COMMANDER",
      badge: "AGE " + marsAge.toFixed(1),
      summary: "CHIEF HABITAT OPERATOR",
      permit: "CLASS S-EXP // SUB-ORBITAL HOPPER & TETHER",
      tagline: "Peak biological and cybernetic prime. Olympus sector veteran."
    };
  } else if (marsAge < 55.0) {
    return {
      title: "SENIOR COLONY ADVISOR",
      badge: "AGE " + marsAge.toFixed(1),
      summary: "FOUNDING SECTOR GOVERNANCE",
      permit: "CLASS MASTER // ALL ROVERS & PRESSURIZED HAULERS",
      tagline: "Witnessed the terraforming domes rise from red dust."
    };
  } else {
    return {
      title: "MARTIAN HIGH ELDER",
      badge: "AGE " + marsAge.toFixed(1),
      summary: "RED PLANET FOUNDING COUNCIL",
      permit: "CLASS DIPLOMATIC // SOLAR SYSTEM WIDE CLEARANCE",
      tagline: "Living legend. Honored across both Earth and Mars hemispheres."
    };
  }
}

// Deterministic aesthetic license number
function generateLicenseNumber(dobString) {
  let hash = 0;
  for (let i = 0; i < dobString.length; i++) {
    hash = (hash << 5) - hash + dobString.charCodeAt(i);
    hash |= 0;
  }
  const cleanHash = Math.abs(hash).toString(16).toUpperCase().padStart(6, '0');
  return `MRS-${cleanHash.slice(0, 3)}-${cleanHash.slice(3, 6)}`;
}
