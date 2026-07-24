"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

interface OutfitColors {
  top: string | null;
  bottom: string | null;
  shoes: string | null;
  accessory: string | null;
}

export type AccessoryType = "cap" | "sunglasses" | "chain" | "bag" | "watch" | "belt" | "other";

// ── Constants ──────────────────────────────────────────────────────
const CREAM = "#f2ebe0";
const GOLD  = "#c8a97e";

// ── Ref-based rotation (no React state → zero re-renders on drag) ──
interface RotInput { velocity: number; dragging: boolean }

// ── Pose arm rotations [l, r] for each pose index ─────────────────
const POSE_ARM_ROT: Array<{ l: [number,number,number]; r: [number,number,number] }> = [
  { l: [0, 0, 0.10], r: [0, 0, -0.10] },           // 0: Stehend
  { l: [0.45, 0, 0.62], r: [0.45, 0, -0.62] },      // 1: Hände in den Hüften
  { l: [0, 0, 0.24], r: [0, 0, -0.24] },             // 2: Locker
  { l: [-0.52, 0, 0.85], r: [-0.52, 0, -0.85] },    // 3: Cross-Arms
];

// ── Hand position offsets per pose [x-out, y, z] ──────────────────
const POSE_HAND_OFF: [number,number,number][] = [
  [0, 0, 0],
  [0.07, 0.22, 0.09],
  [0.05, -0.04, 0],
  [0.12, 0.36, 0.12],
];

// ── Head tilt per face index ──────────────────────────────────────
const FACE_HEAD_ROT: [number,number,number][] = [
  [0, 0, 0],         // 0: Neutral
  [0, 0, 0.07],      // 1: Lächeln — slight tilt
  [-0.09, 0, 0],     // 2: Cool — head back
  [0.12, 0, 0],      // 3: Nachdenklich — head down
];

// ── LatheGeometry profile helpers ──────────────────────────────────
const TORSO_PTS = {
  female: [
    [0.21, 1.40], [0.18, 1.52], [0.15, 1.62], [0.22, 1.74],
    [0.27, 1.84], [0.30, 1.93], [0.32, 1.98], [0.18, 2.08], [0.09, 2.13],
  ],
  male: [
    [0.24, 1.40], [0.23, 1.52], [0.21, 1.62], [0.26, 1.74],
    [0.31, 1.84], [0.35, 1.93], [0.38, 1.98], [0.22, 2.08], [0.09, 2.13],
  ],
} as const;

const HIP_PTS = {
  female: [
    [0.13, 1.10], [0.24, 1.22], [0.30, 1.32], [0.21, 1.40],
  ],
  male: [
    [0.13, 1.10], [0.22, 1.22], [0.26, 1.32], [0.24, 1.40],
  ],
} as const;

function toV2(pts: readonly (readonly [number, number])[]): THREE.Vector2[] {
  return pts.map(([x, y]) => new THREE.Vector2(x, y));
}

// ── Pulsing glow ring — leuchtet im Akzentton des Bühnen-Themes ────
function GlowRing({ color = GOLD }: { color?: string }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.45 + Math.sin(clock.elapsedTime * 1.8) * 0.28;
    }
  });
  return (
    <mesh position={[0, -1.245, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.30, 0.032, 16, 64]} />
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.45}
        roughness={0.20}
        metalness={0.72}
      />
    </mesh>
  );
}

// ── Platform ───────────────────────────────────────────────────────
function Platform({ accent = GOLD }: { accent?: string }) {
  return (
    <group>
      <mesh position={[0, -1.28, 0]} receiveShadow>
        <cylinderGeometry args={[1.30, 1.30, 0.08, 64]} />
        <meshStandardMaterial color="#e0d5c0" roughness={0.30} metalness={0.18} />
      </mesh>
      <mesh position={[0, -1.238, 0]}>
        <cylinderGeometry args={[1.28, 1.28, 0.005, 64]} />
        <meshStandardMaterial color="#f0e8c5" roughness={0.10} metalness={0.48} />
      </mesh>
      <GlowRing color={accent} />
    </group>
  );
}

// ── Background mannequin (with arms + random Y rotation) ──────────
function BackgroundMannequin({
  position,
  scale = 1,
  opacity = 0.75,
  rotY = 0,
}: {
  position: [number, number, number];
  scale?: number;
  opacity?: number;
  rotY?: number;
}) {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#b0a090",
      roughness: 1,
      metalness: 0,
      transparent: true,
      opacity,
    }),
    [opacity]
  );

  return (
    <group position={position} scale={scale} rotation={[0, rotY, 0]}>
      {/* Head */}
      <mesh position={[0, 2.55, 0]} material={mat}>
        <sphereGeometry args={[0.18, 10, 10]} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 2.28, 0]} material={mat}>
        <cylinderGeometry args={[0.07, 0.085, 0.22, 8]} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.75, 0]} material={mat}>
        <cylinderGeometry args={[0.26, 0.22, 0.95, 10]} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.31, 1.68, 0]} rotation={[0, 0, 0.14]} material={mat}>
        <cylinderGeometry args={[0.065, 0.052, 0.80, 8]} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.31, 1.68, 0]} rotation={[0, 0, -0.14]} material={mat}>
        <cylinderGeometry args={[0.065, 0.052, 0.80, 8]} />
      </mesh>
      {/* Hips */}
      <mesh position={[0, 1.26, 0]} material={mat}>
        <cylinderGeometry args={[0.26, 0.22, 0.35, 10]} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.13, 0.70, 0]} material={mat}>
        <cylinderGeometry args={[0.10, 0.080, 1.05, 8]} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.13, 0.70, 0]} material={mat}>
        <cylinderGeometry args={[0.10, 0.080, 1.05, 8]} />
      </mesh>
    </group>
  );
}

// ── Accessory shapes ───────────────────────────────────────────────
function Accessory({ type, color, hipWidth }: { type: AccessoryType; color: string; hipWidth: number }) {
  if (type === "cap") {
    return (
      <group>
        <mesh position={[0, 2.70, 0]} castShadow>
          <sphereGeometry args={[0.20, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.62, 0.18]} rotation={[0.15, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.78, 0.02]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
    );
  }

  if (type === "sunglasses") {
    return (
      <group position={[0, 2.55, 0.16]}>
        <mesh position={[-0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.10, 0.07, 0.02]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
        </mesh>
        <mesh position={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.10, 0.07, 0.02]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.005, 0]}>
          <boxGeometry args={[0.05, 0.012, 0.012]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  }

  if (type === "chain") {
    return (
      <group>
        <mesh position={[0, 2.18, 0.07]} rotation={[1.6, 0, 0]} castShadow>
          <torusGeometry args={[0.13, 0.012, 12, 32]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.85} />
        </mesh>
        <mesh position={[0, 2.00, 0.18]} castShadow>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.85} />
        </mesh>
      </group>
    );
  }

  if (type === "bag") {
    return (
      <group position={[hipWidth + 0.18, 1.20, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.26, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <torusGeometry args={[0.08, 0.012, 12, 24, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <boxGeometry args={[0.06, 0.04, 0.01]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>
    );
  }

  if (type === "watch") {
    return (
      <mesh position={[-(hipWidth + 0.04), 1.32, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>
    );
  }

  if (type === "belt") {
    return (
      <mesh position={[0, 1.40, 0]} castShadow>
        <torusGeometry args={[0.24, 0.022, 12, 32]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    );
  }

  return (
    <mesh position={[hipWidth + 0.05, 1.18, 0.18]} castShadow>
      <boxGeometry args={[0.16, 0.18, 0.08]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  );
}

// ── Main mannequin ─────────────────────────────────────────────────
function ClassicMannequin({
  gender,
  outfitColors,
  accessoryType,
  rotInputRef,
  faceIdx = 0,
  poseIdx = 0,
}: {
  gender: "female" | "male";
  outfitColors: OutfitColors;
  accessoryType: AccessoryType | null;
  rotInputRef: React.MutableRefObject<RotInput>;
  faceIdx?: number;
  poseIdx?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isFemale = gender === "female";

  const torsoProfile = useMemo(() => toV2(TORSO_PTS[gender]), [gender]);
  const hipProfile   = useMemo(() => toV2(HIP_PTS[gender]),   [gender]);

  const shoulderWidth = isFemale ? 0.32 : 0.38;
  const hipWidth      = isFemale ? 0.30 : 0.26;
  const legHeight     = 1.05;

  const torsoColor = outfitColors.top    ?? CREAM;
  const legColor   = outfitColors.bottom ?? CREAM;
  const shoeColor  = outfitColors.shoes  ?? "#c0a880";

  // Premium physical material for skin/body parts
  const creamMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: CREAM,
      roughness: 0.85,
      metalness: 0.02,
      clearcoat: 0.18,
      clearcoatRoughness: 0.82,
    }),
    []
  );

  const poseRot = POSE_ARM_ROT[poseIdx % POSE_ARM_ROT.length];
  const headRot = FACE_HEAD_ROT[faceIdx % FACE_HEAD_ROT.length];
  const handOff = POSE_HAND_OFF[poseIdx % POSE_HAND_OFF.length];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const inp = rotInputRef.current;
    groupRef.current.rotation.y += inp.velocity * 0.012;
    if (!inp.dragging) inp.velocity *= 0.92;
    // Subtle idle float
    groupRef.current.position.y = -1.25 + Math.sin(clock.elapsedTime * 0.50) * 0.012;
  });

  return (
    <group ref={groupRef} position={[0, -1.25, 0]}>

      {/* ── Head — pose-driven tilt ── */}
      <mesh position={[0, 2.55, 0]} rotation={headRot} castShadow material={creamMat}>
        <sphereGeometry args={[0.18, 64, 64]} />
      </mesh>

      {/* ── Neck ── */}
      <mesh position={[0, 2.25, 0]} castShadow material={creamMat}>
        <cylinderGeometry args={[0.07, 0.085, 0.22, 32]} />
      </mesh>

      {/* ── Torso — smooth LatheGeometry + physical material ── */}
      <mesh key={`torso-${gender}`} castShadow>
        <latheGeometry args={[torsoProfile, 36]} />
        <meshPhysicalMaterial color={torsoColor} roughness={0.72} metalness={0} clearcoat={0.10} clearcoatRoughness={0.88} />
      </mesh>

      {/* ── Hips — LatheGeometry ── */}
      <mesh key={`hips-${gender}`} castShadow>
        <latheGeometry args={[hipProfile, 36]} />
        <meshPhysicalMaterial color={legColor} roughness={0.72} metalness={0} clearcoat={0.10} clearcoatRoughness={0.88} />
      </mesh>

      {/* ── Left arm — with elbow sphere ── */}
      <group position={[-(shoulderWidth - 0.01), 1.65, 0]} rotation={poseRot.l}>
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.058, 0.78, 24]} />
          <meshStandardMaterial color={torsoColor} roughness={0.72} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <sphereGeometry args={[0.062, 16, 16]} />
          <meshStandardMaterial color={torsoColor} roughness={0.72} />
        </mesh>
      </group>

      {/* ── Right arm — with elbow sphere ── */}
      <group position={[shoulderWidth - 0.01, 1.65, 0]} rotation={poseRot.r}>
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.058, 0.78, 24]} />
          <meshStandardMaterial color={torsoColor} roughness={0.72} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <sphereGeometry args={[0.062, 16, 16]} />
          <meshStandardMaterial color={torsoColor} roughness={0.72} />
        </mesh>
      </group>

      {/* ── Hands — offset per pose ── */}
      <mesh
        position={[-(shoulderWidth - 0.01) - handOff[0], 1.22 + handOff[1], handOff[2]]}
        castShadow material={creamMat}>
        <sphereGeometry args={[0.068, 24, 24]} />
      </mesh>
      <mesh
        position={[(shoulderWidth - 0.01) + handOff[0], 1.22 + handOff[1], handOff[2]]}
        castShadow material={creamMat}>
        <sphereGeometry args={[0.068, 24, 24]} />
      </mesh>

      {/* ── Legs ── */}
      <mesh position={[-0.13, 0.70, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.085, legHeight, 32]} />
        <meshStandardMaterial color={legColor} roughness={0.72} />
      </mesh>
      <mesh position={[0.13, 0.70, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.085, legHeight, 32]} />
        <meshStandardMaterial color={legColor} roughness={0.72} />
      </mesh>

      {/* ── Knees ── */}
      <mesh position={[-0.13, 0.85, 0.04]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={legColor} roughness={0.72} />
      </mesh>
      <mesh position={[0.13, 0.85, 0.04]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={legColor} roughness={0.72} />
      </mesh>

      {/* ── Ankles ── */}
      <mesh position={[-0.13, 0.215, 0]}>
        <sphereGeometry args={[0.072, 16, 16]} />
        <meshStandardMaterial color={legColor} roughness={0.72} />
      </mesh>
      <mesh position={[0.13, 0.215, 0]}>
        <sphereGeometry args={[0.072, 16, 16]} />
        <meshStandardMaterial color={legColor} roughness={0.72} />
      </mesh>

      {/* ── Shoes — body + dark sole ── */}
      <group position={[-0.13, 0.16, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.065, 0.28]} />
          <meshStandardMaterial color={shoeColor} roughness={0.42} />
        </mesh>
        <mesh position={[0, -0.040, 0]}>
          <boxGeometry args={[0.135, 0.016, 0.30]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>
      <group position={[0.13, 0.16, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.065, 0.28]} />
          <meshStandardMaterial color={shoeColor} roughness={0.42} />
        </mesh>
        <mesh position={[0, -0.040, 0]}>
          <boxGeometry args={[0.135, 0.016, 0.30]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Accessory ── */}
      {outfitColors.accessory && accessoryType && (
        <Accessory type={accessoryType} color={outfitColors.accessory} hipWidth={hipWidth} />
      )}
    </group>
  );
}

// ── Avatar3D — Canvas shell ────────────────────────────────────────
interface Props {
  gender: "female" | "male";
  outfitColors: OutfitColors;
  accessoryType: AccessoryType | null;
  nudgeRef?: React.MutableRefObject<(dir: number) => void>;
  faceIdx?: number;
  poseIdx?: number;
  fogColor?: string;    // Nebelfarbe passend zum Bühnen-Theme
  accentColor?: string; // Rim-Licht-Farbe passend zum Bühnen-Theme
}

export default function Avatar3D({
  gender,
  outfitColors,
  accessoryType,
  nudgeRef,
  faceIdx = 0,
  poseIdx = 0,
  fogColor = "#f0e5d5",
  accentColor = "#d4a860",
}: Props) {
  const inputRef = useRef<RotInput>({ velocity: 0, dragging: false });
  const lastXRef = useRef(0);

  // Wire up external nudge so AvatarStage buttons can spin the avatar
  useEffect(() => {
    if (nudgeRef) {
      nudgeRef.current = (dir: number) => {
        inputRef.current.velocity = dir * 7;
      };
    }
  }, [nudgeRef]);

  function onPointerDown(e: React.PointerEvent) {
    inputRef.current.dragging = true;
    lastXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!inputRef.current.dragging) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    inputRef.current.velocity = dx;
  }
  function onPointerUp(e: React.PointerEvent) {
    inputRef.current.dragging = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  return (
    <Canvas
      camera={{ position: [0, 0.4, 5], fov: 38 }}
      shadows
      dpr={[1, 2]}
      style={{ background: "transparent", touchAction: "none", cursor: "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Tighter fog — bg mannequins bleed into themed haze faster */}
      <fog attach="fog" args={[fogColor, 4.0, 9.0]} />

      {/* ── Cinematic lighting ── */}
      {/* Low ambient for contrast */}
      <ambientLight intensity={0.38} color="#fff5ec" />

      {/* Main spotlight — high intensity, tight cone */}
      <spotLight
        position={[0, 7, 1.5]}
        intensity={20}
        angle={0.28}
        penumbra={0.76}
        color="#fffaf0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.001}
      />

      {/* Front fill — warm, soft */}
      <pointLight position={[0, 2, 4.5]} intensity={1.8} color="#fff5e8" />

      {/* Akzent-Rim von hinten — Silhouetten-Glow im Theme-Ton */}
      <pointLight position={[0, 3.5, -3.5]} intensity={7} color={accentColor} />

      {/* Zweites Akzent-Rim — oben links für Tiefe */}
      <pointLight position={[-2.5, 4.5, -2.0]} intensity={4} color={accentColor} />

      {/* Warm side fills */}
      <pointLight position={[-3, 2.5, 1.5]} intensity={1.4} color="#ffd5a5" />
      <pointLight position={[ 3, 2.5, 1.5]} intensity={1.4} color="#ffd5a5" />

      {/* ── Mannequin ── */}
      <ClassicMannequin
        gender={gender}
        outfitColors={outfitColors}
        accessoryType={accessoryType}
        rotInputRef={inputRef}
        faceIdx={faceIdx}
        poseIdx={poseIdx}
      />

      {/* ── Platform + glow ring ── */}
      <Platform accent={accentColor} />

      {/* ── Background mannequins — varied rotations, deep in fog ── */}
      <BackgroundMannequin position={[-2.6, -1.27, -3.0]} scale={0.92} opacity={0.68} rotY={0.4} />
      <BackgroundMannequin position={[ 2.6, -1.27, -3.0]} scale={0.92} opacity={0.68} rotY={-0.5} />
      <BackgroundMannequin position={[-4.2, -1.27, -4.8]} scale={0.82} opacity={0.42} rotY={1.2} />
      <BackgroundMannequin position={[ 4.2, -1.27, -4.8]} scale={0.82} opacity={0.42} rotY={-0.8} />

      {/* ── Contact shadow on platform ── */}
      <ContactShadows
        position={[0, -1.24, 0]}
        opacity={0.70}
        scale={7}
        blur={2.5}
        far={4}
      />
    </Canvas>
  );
}
