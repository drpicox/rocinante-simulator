import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export function CelestialBody({ children, rotationSpeed = 0.1, orbitSpeed = 0.5, orbitRadius = 10 }) {
  const groupRef = useRef();
  const bodyRef = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(elapsedTime * orbitSpeed) * orbitRadius;
      groupRef.current.position.z = Math.cos(elapsedTime * orbitSpeed) * orbitRadius;
    }
    if (bodyRef.current) {
      bodyRef.current.rotation.y += rotationSpeed * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {children(bodyRef)}
    </group>
  );
}

