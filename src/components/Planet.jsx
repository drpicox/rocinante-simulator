import { Sphere, Html, useCursor } from '@react-three/drei'
import { useState, forwardRef } from 'react'
import { Moon } from './Moon'
import { useDispatch, useSelector } from 'react-redux'
import { selectOrigin, setOrigin } from '../features/origin/originSlice'

export const Planet = forwardRef(({ position, size, color, name, onClick, labelsVisible = true, moons = [] }, ref) => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const dispatch = useDispatch()
  const origin = useSelector(selectOrigin)
  const isOrigin = origin?.name === name

  const handleClick = (e) => {
    e.stopPropagation()
    if (e.shiftKey) {
      dispatch(setOrigin({ name, kind: 'planet' }))
      return
    }
    onClick && onClick()
  }

  return (
    <group position={position} ref={ref}>
      <Sphere
        args={[size * 0.2, 24, 24]}
        onClick={handleClick}
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

      {/* Render moons belonging to this planet */}
      {moons.map((moon) => (
        <Moon
          key={moon.name}
          size={moon.size * 1.5}
          color={moon.color}
          name={moon.name}
          onClick={moon.onClick}
          labelsVisible={false}
          orbitRadius={moon.distance * 250}
          orbitSpeed={0.3}
          planetRef={ref}
        />
      ))}
    </group>
  )
})
