'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect, useMemo } from 'react'
import { useAvatarStore } from '@/store/avatarStore'
import * as THREE from 'three'

// ── Constants ──────────────────────────────────────────────────────
const CREAM  = '#f3ede8'
const GOLD   = '#c8a97e'
const BG     = '#f0ebe4'

// ── Body silhouette: points rotated around Y axis (LatheGeometry) ──
function buildBodyProfile(gender: 'female' | 'male'): THREE.Vector2[] {
  const pts = gender === 'female'
    ? [
        [0.072, 1.02],  // neck base
        [0.148, 0.90],  // shoulder slope
        [0.228, 0.80],  // shoulder width
        [0.216, 0.68],
        [0.220, 0.54],  // bust
        [0.202, 0.42],  // underbust
        [0.140, 0.12],  // waist
        [0.137, 0.00],
        [0.190, -0.18], // upper hip
        [0.228, -0.30], // hip fullest
        [0.188, -0.42],
        [0.096, -0.50], // crotch
      ]
    : [
        [0.075, 1.02],
        [0.118, 0.90],
        [0.272, 0.82],  // broad shoulders
        [0.260, 0.70],
        [0.244, 0.55],  // wide chest
        [0.222, 0.42],
        [0.178, 0.12],  // less narrow waist
        [0.175, 0.00],
        [0.182, -0.18],
        [0.204, -0.30], // narrower hips
        [0.172, -0.42],
        [0.096, -0.50],
      ]
  return pts.map(([x, y]) => new THREE.Vector2(x, y))
}

// ── Mannequin ──────────────────────────────────────────────────────
function Mannequin({ gender }: { gender: 'female' | 'male' }) {
  const profile = useMemo(() => buildBodyProfile(gender), [gender])
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.88, metalness: 0.02 }),
    []
  )
  const armAngle = gender === 'female' ? Math.PI / 5 : Math.PI / 5.5
  const armX = gender === 'female' ? 0.27 : 0.315

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.455, 0]} castShadow material={mat}>
        <sphereGeometry args={[0.118, 32, 24]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.122, 0]} castShadow material={mat}>
        <cylinderGeometry args={[0.062, 0.070, 0.228, 16]} />
      </mesh>

      {/* Torso – LatheGeometry, key forces remount on gender change */}
      <mesh key={`body-${gender}`} castShadow material={mat}>
        <latheGeometry args={[profile, 36]} />
      </mesh>

      {/* Left arm stump */}
      <mesh position={[-armX, 0.80, 0]} rotation={[0, 0, armAngle]} castShadow material={mat}>
        <cylinderGeometry args={[0.048, 0.036, 0.30, 12]} />
      </mesh>

      {/* Right arm stump */}
      <mesh position={[armX, 0.80, 0]} rotation={[0, 0, -armAngle]} castShadow material={mat}>
        <cylinderGeometry args={[0.048, 0.036, 0.30, 12]} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.088, -0.875, 0]} castShadow material={mat}>
        <cylinderGeometry args={[0.068, 0.050, 0.79, 16]} />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.088, -0.875, 0]} castShadow material={mat}>
        <cylinderGeometry args={[0.068, 0.050, 0.79, 16]} />
      </mesh>
    </group>
  )
}

// ── Platform ───────────────────────────────────────────────────────
function Platform() {
  return (
    <mesh position={[0, -1.30, 0]} receiveShadow>
      <cylinderGeometry args={[0.42, 0.48, 0.055, 48]} />
      <meshStandardMaterial color="#ddd5c5" roughness={0.52} metalness={0.18} />
    </mesh>
  )
}

// ── Glow ring under platform ───────────────────────────────────────
function GlowRing() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.52 + Math.sin(clock.elapsedTime * 1.8) * 0.30
    }
  })

  return (
    <mesh position={[0, -1.272, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.43, 0.022, 16, 64]} />
      <meshStandardMaterial
        ref={matRef}
        color={GOLD}
        emissive={GOLD}
        emissiveIntensity={0.52}
        roughness={0.22}
        metalness={0.65}
      />
    </mesh>
  )
}

// ── Background mannequins (blurred via fog + transparency) ────────
function BgMannequin({ position, scale: s }: { position: [number, number, number]; scale: number }) {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#ddd6c8',
      roughness: 0.95,
      metalness: 0,
      transparent: true,
      opacity: 0.38,
    }),
    []
  )

  return (
    <group position={position} scale={s}>
      <mesh position={[0, 1.45, 0]} material={mat}>
        <sphereGeometry args={[0.115, 12, 10]} />
      </mesh>
      <mesh position={[0, 0.28, 0]} material={mat}>
        <cylinderGeometry args={[0.15, 0.205, 1.55, 10]} />
      </mesh>
      <mesh position={[-0.085, -0.68, 0]} material={mat}>
        <cylinderGeometry args={[0.062, 0.046, 0.80, 8]} />
      </mesh>
      <mesh position={[0.085, -0.68, 0]} material={mat}>
        <cylinderGeometry args={[0.062, 0.046, 0.80, 8]} />
      </mesh>
    </group>
  )
}

// ── Scene (runs inside Canvas) ─────────────────────────────────────
interface InputState { velocity: number; dragging: boolean }

function Scene({
  gender,
  inputRef,
}: {
  gender: 'female' | 'male'
  inputRef: React.MutableRefObject<InputState>
}) {
  const pivotRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!pivotRef.current) return
    const inp = inputRef.current
    // Apply drag velocity → rotation
    pivotRef.current.rotation.y += inp.velocity * 0.0085
    // Damp after release
    if (!inp.dragging) inp.velocity *= 0.92
    // Idle float
    pivotRef.current.position.y = Math.sin(clock.elapsedTime * 0.52) * 0.018
  })

  return (
    <>
      {/* Depth fog fades bg mannequins to bg color */}
      <fog attach="fog" args={[BG, 5.5, 12]} />

      {/* Ambient fill */}
      <ambientLight intensity={0.50} color="#fff5ec" />

      {/* Main spotlight from above — soft studio cone */}
      <spotLight
        position={[0, 5.5, 0.5]}
        angle={0.32}
        penumbra={0.88}
        intensity={14}
        color="#fffaf2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
      />

      {/* Front fill — soft warm key */}
      <pointLight position={[0, 1.5, 3.2]} intensity={2.5} color="#fff8f2" />

      {/* Golden rim from behind */}
      <pointLight position={[0.8,  2.2, -2.8]} intensity={4.5} color="#d4a860" />
      <pointLight position={[-0.6, 0.8, -2.5]} intensity={2.0} color="#c89060" />

      {/* Warm side fills for silhouette shaping */}
      <pointLight position={[ 2.5, 0.5, -1.0]} intensity={1.5} color="#f5e8d0" />
      <pointLight position={[-2.0, 0.5, -1.0]} intensity={1.0} color="#f0e4d0" />

      <Platform />
      <GlowRing />

      {/* Background mannequins */}
      <BgMannequin position={[-1.55, 0, -3.2]} scale={0.80} />
      <BgMannequin position={[ 1.70, 0, -3.9]} scale={0.75} />

      {/* Main avatar pivot — rotation + idle float applied here */}
      <group ref={pivotRef}>
        <Mannequin gender={gender} />
      </group>
    </>
  )
}

// ── AvatarStage (DOM shell) ────────────────────────────────────────
export function AvatarStage() {
  const { gender } = useAvatarStore()
  const [mounted, setMounted]   = useState(false)
  const [dragging, setDragging] = useState(false)

  const inputRef  = useRef<InputState>({ velocity: 0, dragging: false })
  const lastXRef  = useRef<number | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const onDown = (x: number) => {
    inputRef.current.dragging = true
    lastXRef.current = x
    setDragging(true)
  }
  const onMove = (x: number) => {
    if (lastXRef.current === null) return
    inputRef.current.velocity = x - lastXRef.current
    lastXRef.current = x
  }
  const onUp = () => {
    inputRef.current.dragging = false
    lastXRef.current = null
    setDragging(false)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: dragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
      }}
      onMouseDown={(e) => onDown(e.clientX)}
      onMouseMove={(e) => { if (e.buttons === 1) onMove(e.clientX) }}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={(e) => onDown(e.touches[0].clientX)}
      onTouchMove={(e) => { e.preventDefault(); onMove(e.touches[0].clientX) }}
      onTouchEnd={onUp}
    >
      {/* Gradient bg — visible before canvas mounts and shows through via alpha */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #faf7f2 0%, #f0e9de 55%, #e4dbd0 100%)',
        pointerEvents: 'none',
      }} />

      {mounted && (
        <Canvas
          camera={{ position: [0, 0.18, 3.85], fov: 42 }}
          shadows
          gl={{ antialias: true, alpha: true }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <Scene gender={gender} inputRef={inputRef} />
        </Canvas>
      )}

      {/* Drag hint — fades when dragging */}
      <div style={{
        position: 'absolute',
        bottom: 28,
        left: 0,
        right: 0,
        textAlign: 'center',
        pointerEvents: 'none',
        opacity: dragging ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}>
        <span style={{
          fontSize: 10,
          letterSpacing: '0.10em',
          color: 'rgba(0,0,0,0.28)',
          textTransform: 'uppercase',
        }}>
          ← ziehen zum drehen →
        </span>
      </div>
    </div>
  )
}
