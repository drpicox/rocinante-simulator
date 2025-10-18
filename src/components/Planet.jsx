import { Sphere, Html, useCursor } from '@react-three/drei'
import { useState, forwardRef } from 'react'

export const Planet = forwardRef(({ position, size, color, name, onClick, labelsVisible = true }, ref) => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  return (
    <group position={position} ref={ref}>
      <Sphere
        args={[size * 0.2, 24, 24]}
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
})
