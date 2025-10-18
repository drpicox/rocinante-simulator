import { Sphere } from '@react-three/drei'

export function Star({ position, size = 0.05, color, name, onClick }) {
  return (
    <Sphere args={[size, 8, 8]} position={position} onClick={onClick}>
      <meshBasicMaterial color={color} />
    </Sphere>
  )
}
