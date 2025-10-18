import { Sphere, Html, useCursor } from '@react-three/drei'
import { useState } from 'react'

export function Star({ position, size = 0.05, color, name, onClick, labelsVisible = false }) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  return (
    <group position={position}>
      <Sphere
        args={[size, 12, 12]}
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
