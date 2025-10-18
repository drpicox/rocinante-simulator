import { Sphere } from '@react-three/drei'
import { useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { planets } from '../data/spaceData'
import { Planet } from './Planet'
import { Star } from './Star'
import { OrbitRing } from './OrbitRing'
import { CelestialBody } from './CelestialBody'

export function SolarSystem({ onSelect }) {
  const [showDetailed, setShowDetailed] = useState(true)
  const { camera } = useThree()
  const planetRefs = useRef({})

  // Check camera distance and switch between detailed and simple view
  useFrame(() => {
    const cameraDistance = camera.position.length()
    const shouldShowDetailed = cameraDistance < 8000
    if (shouldShowDetailed !== showDetailed) {
      setShowDetailed(shouldShowDetailed)
    }
  })

  if (showDetailed) {
    // Detailed view: Sun, planets, and orbits
    return (
      <>
        {/* Sun */}
        <Sphere args={[0.8, 32, 32]} position={[0, 0, 0]} onClick={() => onSelect('Sun')}>
          <meshStandardMaterial emissive="#ffdd44" emissiveIntensity={1.2} color="#ffcc33" />
        </Sphere>

        {/* Orbits */}
        {planets.map((planet) => (
          <OrbitRing key={`${planet.name}-orbit`} radius={planet.distance * 10} />
        ))}

        {/* Planets */}
        {planets.map((planet) => (
          <CelestialBody key={planet.name} orbitRadius={planet.distance * 10} orbitSpeed={0.1 / planet.distance}>
            {(bodyRef) => {
              planetRefs.current[planet.name] = bodyRef
              return (
                <Planet
                  ref={bodyRef}
                  size={planet.size}
                  color={planet.color}
                  name={planet.name}
                  onClick={() => onSelect(planet.name)}
                  labelsVisible={false}
                  moons={planet.moons?.map(moon => ({
                    ...moon,
                    onClick: () => onSelect(moon.name)
                  }))}
                />
              )
            }}
          </CelestialBody>
        ))}
      </>
    )
  } else {
    // Simple view: Just "Sol" as a star
    return (
      <Star
        position={[0, 0, 0]}
        size={8}
        color="#fff3cd"
        name="Sol (Our Sun)"
        onClick={() => onSelect('Sun')}
        labelsVisible={false}
        minVisibleDistance={0}
      />
    )
  }
}

