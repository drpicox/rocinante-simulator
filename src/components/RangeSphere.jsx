import { useSelector } from 'react-redux'
import { useFrame } from '@react-three/fiber'
import { selectOrigin } from '../features/origin/originSlice'
import { useMemo, useRef } from 'react'
import { getPosition } from '../utils/positions'
import { calculateMaxRange } from '../utils/range'

export function RangeSphere() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const meshRef = useRef()

  // Calculate max range based on ship parameters
  const maxRange = useMemo(() => {
    const rangeMeters = calculateMaxRange(
      ship.mass,
      ship.fuel,
      ship.efficiency,
      ship.acceleration
    )

    // Convert meters to the scene's scale
    // In the solar system, 1 AU = 149,597,870,700 meters
    // The scene uses distance * 10 for orbit radius (from positions.js)
    // Earth is at 1 AU, so orbitRadius = 1 * 10 = 10 units
    // Therefore: 1 unit = 149,597,870,700 / 10 = 14,959,787,070 meters
    const AU = 149597870700 // meters
    const sceneUnitsPerAU = 10
    const metersPerSceneUnit = AU / sceneUnitsPerAU

    return rangeMeters / metersPerSceneUnit
  }, [ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  // Update sphere position to follow origin
  useFrame(({ clock }) => {
    if (!meshRef.current || !origin?.name) return

    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)

    if (pos) {
      meshRef.current.position.set(pos[0], pos[1], pos[2])
    }
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  return (
    <mesh ref={meshRef}>
      {/* Just wireframe with low opacity and fewer segments */}
      <sphereGeometry args={[maxRange, 24, 24]} />
      <meshBasicMaterial
        color="#00ffff"
        transparent
        opacity={0.06}
        wireframe={true}
        depthWrite={false}
      />
    </mesh>
  )
}

export default RangeSphere
