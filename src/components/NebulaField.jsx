import { useMemo } from 'react'
import * as THREE from 'three'

// Create a circular gradient texture for nebula sprites
function createNebulaTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)')
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

function Nebula({ center, radius, color, secondaryColor, particleCount = 1500 }) {
  const [geometry, material] = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []
    const scales = []

    for (let i = 0; i < particleCount; i++) {
      // Generate points within the nebula using spherical distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.pow(Math.random(), 0.7) * radius

      const x = center[0] + r * Math.sin(phi) * Math.cos(theta)
      const y = center[1] + r * Math.sin(phi) * Math.sin(theta)
      const z = center[2] + r * Math.cos(phi)

      positions.push(x, y, z)

      // Mix between primary and secondary color based on distance from center
      const distanceFromCenter = r / radius
      const mixedColor = new THREE.Color(color).lerp(new THREE.Color(secondaryColor), distanceFromCenter)
      colors.push(mixedColor.r, mixedColor.g, mixedColor.b)

      // Vary scales - much larger clouds with more variation
      const scale = (1 - distanceFromCenter * 0.3) * (2000 + Math.random() * 3000)
      scales.push(scale)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute('scale', new THREE.Float32BufferAttribute(scales, 1))

    const material = new THREE.PointsMaterial({
      size: 3500,
      map: createNebulaTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.005,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })

    return [geometry, material]
  }, [center, radius, color, secondaryColor, particleCount])

  return <points geometry={geometry} material={material} />
}

export function NebulaField() {
  // Define nebula regions with different colors, distributed evenly around the scene
  // Some nebulae are paired closely together to create beautiful blended regions
  const nebulae = [
    // PAIR 1: Pink + Purple blend (close together on the right side)
    {
      center: [15000, 8000, -20000],
      radius: 12000,
      color: '#ff6b9d', // Pink
      secondaryColor: '#c44569'
    },
    {
      center: [17000, 6000, -18000], // Very close to pink nebula
      radius: 11000,
      color: '#4834df', // Purple - will blend with pink
      secondaryColor: '#6c5ce7'
    },

    // PAIR 2: Cyan + Teal blend (overlapping at the bottom)
    {
      center: [8000, -12000, -25000],
      radius: 15000,
      color: '#0abde3', // Cyan
      secondaryColor: '#00d2d3'
    },
    {
      center: [6000, -13500, -22000], // Very close to cyan nebula
      radius: 13000,
      color: '#10ac84', // Teal/Green - will blend with cyan
      secondaryColor: '#1dd1a1'
    },

    // Individual nebulae for balance
    {
      center: [-18000, -5000, 22000],
      radius: 10000,
      color: '#ee5a6f', // Red
      secondaryColor: '#f368e0'
    },
    {
      center: [20000, -8000, 5000],
      radius: 13000,
      color: '#feca57', // Orange/Yellow
      secondaryColor: '#ff9ff3'
    },
    {
      center: [5000, 18000, 15000],
      radius: 10000,
      color: '#a29bfe', // Light Purple
      secondaryColor: '#6c5ce7'
    },
  ]

  return (
    <>
      {nebulae.map((nebula, index) => (
        <Nebula
          key={index}
          center={nebula.center}
          radius={nebula.radius}
          color={nebula.color}
          secondaryColor={nebula.secondaryColor}
        />
      ))}
    </>
  )
}

