// Quick sanity check for RangeSphere size mapping (exponential ramp)

const AU = 149597870700 // meters
const LY = 9.461e15 // meters

function mapRangeMetersToUnits(rangeMeters) {
  const sceneUnitsPerAU = 10
  const sceneUnitsPerLY = 2000

  const rangeAU = rangeMeters / AU
  const rangeLY = rangeMeters / LY
  const sizeAU = rangeAU * sceneUnitsPerAU
  const sizeLY = rangeLY * sceneUnitsPerLY

  const startUnits = 5000 // 500 AU
  const startLY = (500 * AU) / LY
  const endLY = 3.5

  if (sizeAU <= startUnits) return sizeAU
  if (rangeLY >= endLY) return sizeLY

  const tRaw = (rangeLY - startLY) / (endLY - startLY)
  const t = Math.min(1, Math.max(0, tRaw))

  // Exponential ramp
  const k = 3
  const denom = 1 - Math.exp(-k)
  const s = denom === 0 ? t : (1 - Math.exp(-k * t)) / denom

  return 5000 + 2000 * s
}

function fmt(n) { return n.toFixed(6) }

function run() {
  const cases = []
  const AUv = (n) => n * AU
  const LYv = (n) => n * LY

  cases.push(['499 AU    ', AUv(499)])
  cases.push(['500 AU    ', AUv(500)])
  cases.push(['500.1 AU  ', AUv(500.1)])
  cases.push(['501 AU    ', AUv(501)])
  cases.push(['0.1 LY    ', LYv(0.1)])
  cases.push(['0.5 LY    ', LYv(0.5)])
  cases.push(['1.0 LY    ', LYv(1.0)])
  cases.push(['2.5 LY    ', LYv(2.5)])
  cases.push(['3.0 LY    ', LYv(3.0)])
  cases.push(['3.49 LY   ', LYv(3.49)])
  cases.push(['3.5 LY    ', LYv(3.5)])
  cases.push(['4.0 LY    ', LYv(4.0)])

  let prevUnits = -Infinity
  for (const [label, meters] of cases) {
    const units = mapRangeMetersToUnits(meters)
    const monotonic = units >= prevUnits
    console.log(`${label} => ${fmt(units)} units ${monotonic ? '' : '(! non-monotonic !)'} `)
    prevUnits = units
  }
}

run()
