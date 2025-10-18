import { Sphere } from '@react-three/drei'

export function Planet({ position, size, color, name, onClick }) {
  return (
    <Sphere args={[size * 0.1, 16, 16]} position={position} onClick={onClick}>
      <meshStandardMaterial color={color} />
    </Sphere>
  )
}
