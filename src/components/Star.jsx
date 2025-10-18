import { Sphere, Html, useCursor } from '@react-three/drei'
import { useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

export function Star({ position, size = 0.05, color, name, onClick, labelsVisible = false, minVisibleDistance = 1000 }) {
  const [hovered, setHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(true) // Start visible
  const [scaledSize, setScaledSize] = useState(size)
  const { camera } = useThree()
  useCursor(hovered)

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

  return (
    <group position={position}>
      <Sphere
        args={[scaledSize, 16, 16]}
        onClick={onClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial color={color} />
      </Sphere>
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
    </group>
  )
}
