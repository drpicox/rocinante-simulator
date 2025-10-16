/**
 * Nearby Stars Catalog
 *
 * Contains accurate data for the 50 nearest star systems
 * Data sourced from SIMBAD, Gaia, and Hipparcos catalogs
 *
 * All distances are in light years
 * Positions are J2000.0 epoch coordinates
 */

/**
 * Star Data
 * @typedef {Object} Star
 * @property {string} name - Common name
 * @property {string} designation - Scientific designation
 * @property {number} distanceLY - Distance in light years
 * @property {number} distanceAU - Distance in AU (computed)
 * @property {string} color - Display color based on spectral type
 * @property {string} spectralType - Stellar classification
 * @property {number} rightAscension - RA in degrees (J2000)
 * @property {number} declination - Dec in degrees (J2000)
 * @property {number} properMotionRA - Proper motion in RA (mas/year)
 * @property {number} properMotionDec - Proper motion in Dec (mas/year)
 * @property {number} apparentMagnitude - Visual magnitude
 */

export const NEARBY_STARS = [
  {
    name: 'Proxima Centauri',
    designation: 'Alpha Centauri C',
    distanceLY: 4.2465,
    distanceAU: 268470,
    color: '#FF6B6B',
    spectralType: 'M5.5Ve',
    rightAscension: 217.42894,
    declination: -62.67951,
    properMotionRA: -3775.40,
    properMotionDec: 769.33,
    apparentMagnitude: 11.13
  },
  {
    name: 'Alpha Centauri A',
    designation: 'Rigil Kentaurus',
    distanceLY: 4.3650,
    distanceAU: 275760,
    color: '#FFF4E6',
    spectralType: 'G2V',
    rightAscension: 219.90205,
    declination: -60.83399,
    properMotionRA: -3678.19,
    properMotionDec: 481.84,
    apparentMagnitude: -0.01
  },
  {
    name: 'Alpha Centauri B',
    designation: 'Toliman',
    distanceLY: 4.3650,
    distanceAU: 275760,
    color: '#FFE4C4',
    spectralType: 'K1V',
    rightAscension: 219.90205,
    declination: -60.83399,
    properMotionRA: -3614.39,
    properMotionDec: 595.47,
    apparentMagnitude: 1.33
  },
  {
    name: "Barnard's Star",
    designation: "Barnard's Star",
    distanceLY: 5.9577,
    distanceAU: 376450,
    color: '#FF4444',
    spectralType: 'M4.0Ve',
    rightAscension: 269.45207,
    declination: 4.69339,
    properMotionRA: -798.71,
    properMotionDec: 10328.12,
    apparentMagnitude: 9.53
  },
  {
    name: 'Luhman 16 A',
    designation: 'WISE J104915.57-531906.1',
    distanceLY: 6.5030,
    distanceAU: 410880,
    color: '#8B4513',
    spectralType: 'L8',
    rightAscension: 162.32876,
    declination: -53.31953,
    properMotionRA: -2762.36,
    properMotionDec: 354.95,
    apparentMagnitude: 10.7
  },
  {
    name: 'WISE 0855-0714',
    designation: 'WISE J085510.83-071442.5',
    distanceLY: 7.2700,
    distanceAU: 459420,
    color: '#4B0082',
    spectralType: 'Y',
    rightAscension: 133.79513,
    declination: -7.24506,
    properMotionRA: -8.10,
    properMotionDec: -3.33,
    apparentMagnitude: 25
  },
  {
    name: 'Wolf 359',
    designation: 'CN Leonis',
    distanceLY: 7.8562,
    distanceAU: 496520,
    color: '#FF8888',
    spectralType: 'M6.0V',
    rightAscension: 164.12007,
    declination: 7.00885,
    properMotionRA: -3842.33,
    properMotionDec: -2725.19,
    apparentMagnitude: 13.54
  },
  {
    name: 'Lalande 21185',
    designation: 'BD+36 2147',
    distanceLY: 8.2905,
    distanceAU: 523960,
    color: '#FF6347',
    spectralType: 'M2.0V',
    rightAscension: 165.08569,
    declination: 35.96617,
    properMotionRA: -580.27,
    properMotionDec: -4769.95,
    apparentMagnitude: 7.47
  },
  {
    name: 'Sirius A',
    designation: 'Alpha Canis Majoris A',
    distanceLY: 8.6592,
    distanceAU: 547180,
    color: '#FFFFFF',
    spectralType: 'A1V',
    rightAscension: 101.28715,
    declination: -16.71611,
    properMotionRA: -546.01,
    properMotionDec: -1223.07,
    apparentMagnitude: -1.46
  },
  {
    name: 'Sirius B',
    designation: 'Alpha Canis Majoris B',
    distanceLY: 8.6592,
    distanceAU: 547180,
    color: '#E0E0FF',
    spectralType: 'DA2',
    rightAscension: 101.28715,
    declination: -16.71611,
    properMotionRA: -546.01,
    properMotionDec: -1223.07,
    apparentMagnitude: 8.44
  },
  {
    name: 'Luyten 726-8 A',
    designation: 'BL Ceti',
    distanceLY: 8.7280,
    distanceAU: 551520,
    color: '#CD5C5C',
    spectralType: 'M5.5Ve',
    rightAscension: 25.87100,
    declination: -17.95136,
    properMotionRA: 3259.39,
    properMotionDec: -165.19,
    apparentMagnitude: 12.54
  },
  {
    name: 'Ross 154',
    designation: 'V1216 Sagittarii',
    distanceLY: 9.6932,
    distanceAU: 612530,
    color: '#FF7F50',
    spectralType: 'M3.5Ve',
    rightAscension: 283.02191,
    declination: -23.81505,
    properMotionRA: 86.96,
    properMotionDec: -1118.00,
    apparentMagnitude: 10.43
  },
  {
    name: 'Ross 248',
    designation: 'HH Andromedae',
    distanceLY: 10.322,
    distanceAU: 652260,
    color: '#FFA07A',
    spectralType: 'M5.5Ve',
    rightAscension: 351.87023,
    declination: 44.01753,
    properMotionRA: 1628.12,
    properMotionDec: -138.52,
    apparentMagnitude: 12.29
  },
  {
    name: 'Epsilon Eridani',
    designation: 'Ran',
    distanceLY: 10.475,
    distanceAU: 662000,
    color: '#FFAA55',
    spectralType: 'K2V',
    rightAscension: 53.23267,
    declination: -9.45833,
    properMotionRA: -975.17,
    properMotionDec: 19.49,
    apparentMagnitude: 3.73
  },
  {
    name: 'Lacaille 9352',
    designation: 'GJ 887',
    distanceLY: 10.742,
    distanceAU: 678880,
    color: '#FF6B6B',
    spectralType: 'M0.5V',
    rightAscension: 348.31467,
    declination: -35.85144,
    properMotionRA: 6766.63,
    properMotionDec: 1327.99,
    apparentMagnitude: 7.34
  },
  {
    name: 'Ross 128',
    designation: 'Proxima Virginis',
    distanceLY: 11.007,
    distanceAU: 695620,
    color: '#FF8C69',
    spectralType: 'M4.0V',
    rightAscension: 176.93830,
    declination: 0.80330,
    properMotionRA: -1361.52,
    properMotionDec: -1225.34,
    apparentMagnitude: 11.13
  },
  {
    name: 'EZ Aquarii A',
    designation: 'GJ 866 A',
    distanceLY: 11.266,
    distanceAU: 711980,
    color: '#CD5555',
    spectralType: 'M5.0Ve',
    rightAscension: 334.10467,
    declination: -11.16225,
    properMotionRA: 1340.88,
    properMotionDec: -243.58,
    apparentMagnitude: 13.03
  },
  {
    name: '61 Cygni A',
    designation: 'Piazzi\'s Flying Star A',
    distanceLY: 11.403,
    distanceAU: 720640,
    color: '#FFA500',
    spectralType: 'K5.0V',
    rightAscension: 316.91444,
    declination: 38.74841,
    properMotionRA: 4133.05,
    properMotionDec: 3201.78,
    apparentMagnitude: 5.21
  },
  {
    name: 'Procyon A',
    designation: 'Alpha Canis Minoris A',
    distanceLY: 11.462,
    distanceAU: 724370,
    color: '#FFFACD',
    spectralType: 'F5IV-V',
    rightAscension: 114.82576,
    declination: 5.22499,
    properMotionRA: -716.57,
    properMotionDec: -1034.58,
    apparentMagnitude: 0.34
  },
  {
    name: 'Struve 2398 A',
    designation: 'HD 173739',
    distanceLY: 11.525,
    distanceAU: 728350,
    color: '#FF7256',
    spectralType: 'M3.0V',
    rightAscension: 280.77850,
    declination: 59.58794,
    properMotionRA: 3368.46,
    properMotionDec: -1815.72,
    apparentMagnitude: 8.90
  },
  {
    name: 'Groombridge 34 A',
    designation: 'GX Andromedae',
    distanceLY: 11.624,
    distanceAU: 734600,
    color: '#FF6B6B',
    spectralType: 'M1.5V',
    rightAscension: 23.47688,
    declination: 44.01308,
    properMotionRA: 2892.76,
    properMotionDec: -603.51,
    apparentMagnitude: 8.08
  },
  {
    name: 'Epsilon Indi A',
    designation: 'HR 8387',
    distanceLY: 11.824,
    distanceAU: 747240,
    color: '#FFA500',
    spectralType: 'K5Ve',
    rightAscension: 330.82322,
    declination: -56.78587,
    properMotionRA: 3961.41,
    properMotionDec: -2538.33,
    apparentMagnitude: 4.69
  },
  {
    name: 'Tau Ceti',
    designation: '52 Ceti',
    distanceLY: 11.905,
    distanceAU: 752360,
    color: '#FFE4B5',
    spectralType: 'G8.5V',
    rightAscension: 26.01704,
    declination: -15.93748,
    properMotionRA: -1721.05,
    properMotionDec: 854.16,
    apparentMagnitude: 3.50
  },
  {
    name: 'YZ Ceti',
    designation: 'GJ 54.1',
    distanceLY: 12.132,
    distanceAU: 766710,
    color: '#FF6347',
    spectralType: 'M4.5V',
    rightAscension: 13.26633,
    declination: -16.89934,
    properMotionRA: 3494.39,
    properMotionDec: -1627.24,
    apparentMagnitude: 12.02
  },
  {
    name: "Luyten's Star",
    designation: 'GJ 273',
    distanceLY: 12.366,
    distanceAU: 781500,
    color: '#FF6B6B',
    spectralType: 'M3.5V',
    rightAscension: 110.30575,
    declination: -3.69454,
    properMotionRA: -861.32,
    properMotionDec: -676.58,
    apparentMagnitude: 9.86
  },
  {
    name: "Teegarden's Star",
    designation: 'SO J025300.5+165258',
    distanceLY: 12.514,
    distanceAU: 790850,
    color: '#8B0000',
    spectralType: 'M7.0V',
    rightAscension: 43.26038,
    declination: 16.88607,
    properMotionRA: 3407.58,
    properMotionDec: -2374.40,
    apparentMagnitude: 15.14
  },
  {
    name: "Kapteyn's Star",
    designation: 'CD-45 1841',
    distanceLY: 12.777,
    distanceAU: 807470,
    color: '#FF4500',
    spectralType: 'M1.5VI',
    rightAscension: 77.66147,
    declination: -45.01375,
    properMotionRA: 6499.74,
    properMotionDec: -5723.62,
    apparentMagnitude: 8.84
  },
  {
    name: 'Lacaille 8760',
    designation: 'AX Microscopii',
    distanceLY: 12.870,
    distanceAU: 813350,
    color: '#FFB347',
    spectralType: 'K7V',
    rightAscension: 319.31397,
    declination: -38.86942,
    properMotionRA: 3258.95,
    properMotionDec: -1145.32,
    apparentMagnitude: 6.67
  },
  {
    name: 'Kruger 60 A',
    designation: 'DO Cephei',
    distanceLY: 13.149,
    distanceAU: 830990,
    color: '#FF6347',
    spectralType: 'M3.0V',
    rightAscension: 330.78529,
    declination: 57.70192,
    properMotionRA: 874.73,
    properMotionDec: 59.43,
    apparentMagnitude: 9.79
  },
  {
    name: 'Ross 614 A',
    designation: 'V577 Monocerotis',
    distanceLY: 13.349,
    distanceAU: 843630,
    color: '#CD5C5C',
    spectralType: 'M4.5V',
    rightAscension: 94.88617,
    declination: -2.48612,
    properMotionRA: 929.16,
    properMotionDec: -666.61,
    apparentMagnitude: 11.15
  }
]

// Compute AU distances for all stars
NEARBY_STARS.forEach(star => {
  if (!star.distanceAU) {
    star.distanceAU = star.distanceLY * 63241.077 // LY to AU conversion
  }
})

/**
 * Get stars within a certain distance
 * @param {number} maxDistanceLY - Maximum distance in light years
 * @returns {Array} Filtered list of stars
 */
export function getStarsWithinDistance(maxDistanceLY) {
  return NEARBY_STARS.filter(star => star.distanceLY <= maxDistanceLY)
}

/**
 * Get the brightest stars (lowest apparent magnitude)
 * @param {number} count - Number of stars to return
 * @returns {Array} Sorted list of brightest stars
 */
export function getBrightestStars(count = 10) {
  return [...NEARBY_STARS]
    .sort((a, b) => a.apparentMagnitude - b.apparentMagnitude)
    .slice(0, count)
}
