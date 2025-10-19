import { Sphere, Html, useCursor, Billboard } from '@react-three/drei'
import { useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useDispatch, useSelector } from 'react-redux'
import { selectOrigin, setOrigin } from '../features/origin/originSlice'
import { planets } from '../data/spaceData'
import { AdditiveBlending, DoubleSide } from 'three'

// Precompute solar system body names (Sun + planets + moons)
const SOLAR_SYSTEM_NAMES = (() => {
  const names = new Set(['Sun', 'Sol (Our Sun)'])
  for (const p of planets) {
    names.add(p.name)
    if (Array.isArray(p.moons)) {
      for (const m of p.moons) names.add(m.name)
    }
  }
  return names
})()

export function Star({ position, size = 0.05, color, name, onClick, labelsVisible = false, minVisibleDistance = 1000 }) {
  const [hovered, setHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(true) // Start visible
  const [scaledSize, setScaledSize] = useState(size)
  const { camera } = useThree()
  useCursor(hovered)
  const dispatch = useDispatch()
  const origin = useSelector(selectOrigin)

  // Origin logic: if this star is the Sol proxy, consider any solar-system origin as matching
  const isOrigin = name === 'Sol (Our Sun)'
    ? (origin?.name ? SOLAR_SYSTEM_NAMES.has(origin.name) : false)
    : origin?.name === name

  // Update visibility and size on every frame based on camera distance
  useFrame(() => {
    const cameraDistance = camera.position.length()
    const shouldBeVisible = minVisibleDistance === 0 || cameraDistance >= minVisibleDistance

    if (shouldBeVisible !== isVisible) {
      setIsVisible(shouldBeVisible)
    }

    // Smooth, gradual scaling that starts very small and grows continuously
    // Use a smooth curve instead of sudden thresholds
    let scaleFactor
    if (cameraDistance < 500) {
      // Very close: stars stay tiny
      scaleFactor = 1.5
    } else if (cameraDistance < 5000) {
      // Medium range: smooth gradual growth from 0.5x to ~10x
      const t = (cameraDistance - 500) / 4500 // normalize 500-5000 to 0-1
      scaleFactor = 1.5 + (t * t * 20) // quadratic easing for smooth acceleration
    } else {
      // Far range: continue growing but slower, cap at 50x
      const extraDistance = cameraDistance - 5000
      const extraScale = Math.min(extraDistance / 1000, 30)
      scaleFactor = 20.5 + extraScale
    }

    const newScaledSize = size * scaleFactor
    // Use smaller threshold for smoother updates
    if (Math.abs(newScaledSize - scaledSize) > 0.05) {
      setScaledSize(newScaledSize)
    }
  })

  if (!isVisible) return null

  const handleClick = (e) => {
    e.stopPropagation()
    if (e.shiftKey) {
      // Normalize Sun naming to 'Sun' for origin if applicable
      const canonicalName = name === 'Sol (Our Sun)' ? 'Sun' : name
      dispatch(setOrigin({ name: canonicalName, kind: 'star' }))
      return
    }
    onClick && onClick()
  }

  return (
    <group position={position}>
      <Sphere
        args={[scaledSize, 16, 16]}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial color={color} />
      </Sphere>

      {isOrigin && (
        <>
          {/* Soft glow sphere proportional to apparent size */}
          <mesh>
            <sphereGeometry args={[scaledSize * 2.2, 16, 16]} />
            <meshBasicMaterial
              color="#4caf50"
              transparent
              opacity={0.2}
              depthWrite={false}
              blending={AdditiveBlending}
            />
          </mesh>
          {/* Camera-facing ring around the star */}
          <Billboard>
            <mesh>
              <ringGeometry args={[scaledSize * 1.7, scaledSize * 2.6, 48]} />
              <meshBasicMaterial
                color="#4caf50"
                transparent
                opacity={0.55}
                side={DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </Billboard>
        </>
      )}

      {(labelsVisible || hovered) && (
        <Html center style={{ pointerEvents: 'none' }}>
          <div style={{
            padding: '2px 6px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            fontSize: 12,
            borderRadius: 4,
            whiteSpace: 'nowrap',
          }}>{name}</div>
        </Html>
      )}
      {isOrigin && (
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
      )}
    </group>
  )
}
