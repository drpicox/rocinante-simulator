// filepath: /Volumes/Projects/claude/rocinante-simulator/src/components/OriginIndicator.jsx
import { Html, Billboard } from '@react-three/drei'
import { AdditiveBlending, DoubleSide } from 'three'

// Generic origin indicator: soft glow + camera-facing ring + optional label
// Props:
// - base: numeric base radius/size (world units) to scale the visuals
// - color: glow/ring color
// - glowScale: multiplier for glow sphere radius (default 1.6)
// - ringInner: inner radius multiplier (default 1.2)
// - ringOuter: outer radius multiplier (default 1.9)
// - showLabel: whether to show the "Origin" badge (default true)
// - labelMarginTop: CSS margin-top in px applied to the Html badge (default 16)
export function OriginIndicator({
  base,
  color = '#4caf50',
  glowScale = 1.6,
  ringInner = 1.2,
  ringOuter = 1.9,
  showLabel = true,
  labelMarginTop = 16,
}) {
  if (!base || base <= 0) return null
  return (
    <>
      {/* Soft glow sphere */}
      <mesh>
        <sphereGeometry args={[base * glowScale, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      {/* Camera-facing ring */}
      <Billboard>
        <mesh>
          <ringGeometry args={[base * ringInner, base * ringOuter, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.55}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </Billboard>
      {showLabel && (
        <Html center style={{ pointerEvents: 'none' }}>
          <div style={{
            marginTop: labelMarginTop,
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
    </>
  )
}

export default OriginIndicator

