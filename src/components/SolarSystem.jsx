import { Sphere, Html, Billboard } from '@react-three/drei'
import { useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { planets } from '../data/spaceData'
import { Planet } from './Planet'
import { Star } from './Star'
import { OrbitRing } from './OrbitRing'
import { CelestialBody } from './CelestialBody'
import { useDispatch, useSelector } from 'react-redux'
import { selectOrigin, setOrigin } from '../features/origin/originSlice'
import { AdditiveBlending, DoubleSide } from 'three'

export function SolarSystem({ onSelect }) {
  const [showDetailed, setShowDetailed] = useState(true)
  const { camera } = useThree()
  const planetRefs = useRef({})
  const dispatch = useDispatch()
  const origin = useSelector(selectOrigin)
  const isSunOrigin = origin?.name === 'Sun'

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
        <group position={[0, 0, 0]}>
          <Sphere args={[0.8, 32, 32]} onClick={(e) => {
            e.stopPropagation()
            if (e.shiftKey) {
              dispatch(setOrigin({ name: 'Sun', kind: 'star' }))
            } else {
              onSelect('Sun')
            }
          }}>
            <meshStandardMaterial emissive="#ffdd44" emissiveIntensity={1.2} color="#ffcc33" />
          </Sphere>

          {isSunOrigin && (
            <>
              {/* Soft glow sphere */}
              <mesh>
                <sphereGeometry args={[0.8 * 1.6, 24, 24]} />
                <meshBasicMaterial
                  color="#4caf50"
                  transparent
                  opacity={0.2}
                  depthWrite={false}
                  blending={AdditiveBlending}
                />
              </mesh>
              {/* Camera-facing ring */}
              <Billboard>
                <mesh>
                  <ringGeometry args={[0.8 * 1.2, 0.8 * 1.9, 48]} />
                  <meshBasicMaterial
                    color="#4caf50"
                    transparent
                    opacity={0.55}
                    side={DoubleSide}
                    depthWrite={false}
                  />
                </mesh>
              </Billboard>

              <Html center style={{ pointerEvents: 'none' }}>
                <div style={{
                  marginTop: 18,
                  padding: '2px 6px',
                  background: 'rgba(76, 175, 80, 0.9)',
                  color: 'white',
                  fontSize: 10,
                  borderRadius: 4,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 0 6px rgba(76,175,80,0.7)'
                }}>Origin</div>
              </Html>
            </>
          )}
        </group>

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
