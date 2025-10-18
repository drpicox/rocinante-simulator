import { Line } from '@react-three/drei'
import * as THREE from 'three'

function circlePoints(radius, segments = 128) {
  const pts = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(t) * radius, 0, Math.sin(t) * radius))
  }
  return pts
}

export function OrbitRing({ radius, color = '#444', opacity = 0.6, segments = 128, visible = true }) {
  if (!visible) return null
  return (
    <Line
      points={circlePoints(radius, segments)}
      color={color}
      transparent
      opacity={opacity}
    />
  )
}

