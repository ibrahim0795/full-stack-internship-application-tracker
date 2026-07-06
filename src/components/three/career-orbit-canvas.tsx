"use client";

import { Float, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { ReactNode, RefObject } from "react";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export interface CareerOrbitCanvasProps {
  active: boolean;
  compact: boolean;
  pointer: RefObject<{ x: number; y: number }>;
  progress: RefObject<number>;
}

function rangeStrength(
  progress: number,
  start: number,
  peak: number,
  end: number,
) {
  const fadeIn = THREE.MathUtils.smoothstep(progress, start, peak);
  const fadeOut = 1 - THREE.MathUtils.smoothstep(progress, peak, end);
  return Math.min(fadeIn, fadeOut);
}

function SceneRig({
  pointer,
  progress,
}: Pick<CareerOrbitCanvasProps, "pointer" | "progress">) {
  const cameraCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.2, 8.8),
        new THREE.Vector3(-0.7, 0.45, 7.6),
        new THREE.Vector3(0.9, 0.2, 7.2),
        new THREE.Vector3(1.3, 0.7, 7.8),
        new THREE.Vector3(-0.5, -0.2, 7.1),
        new THREE.Vector3(0, 0, 6.2),
      ]),
    [],
  );
  const cameraTarget = useRef(new THREE.Vector3());

  useFrame(({ camera }, delta) => {
    const pathPosition = cameraCurve.getPoint(
      THREE.MathUtils.clamp(progress.current, 0, 1),
    );
    const pointerPosition = pointer.current;
    cameraTarget.current.set(
      pathPosition.x + pointerPosition.x * 0.24,
      pathPosition.y + pointerPosition.y * 0.16,
      pathPosition.z,
    );
    camera.position.lerp(cameraTarget.current, 1 - Math.exp(-delta * 2.6));
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneWorld({
  children,
  compact,
  progress,
}: Pick<CareerOrbitCanvasProps, "compact" | "progress"> & {
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const chapterOffsets = useMemo(
    () => [1.55, -1.4, 1.35, 1.2, -1.45, 1.4, 0],
    [],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    const chapterPosition =
      THREE.MathUtils.clamp(progress.current, 0, 0.999) * 6;
    const chapterIndex = Math.floor(chapterPosition);
    const chapterProgress = chapterPosition - chapterIndex;
    const targetX = THREE.MathUtils.lerp(
      chapterOffsets[chapterIndex],
      chapterOffsets[Math.min(chapterIndex + 1, chapterOffsets.length - 1)],
      THREE.MathUtils.smoothstep(chapterProgress, 0, 1),
    );
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      targetX * (compact ? 0.35 : 1),
      3,
      delta,
    );
  });

  return <group ref={group}>{children}</group>;
}

function Satellite({ progress }: Pick<CareerOrbitCanvasProps, "progress">) {
  const group = useRef<THREE.Group>(null);
  const scaleTarget = useRef(new THREE.Vector3(1, 1, 1));

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const destinationShift = THREE.MathUtils.smoothstep(
      progress.current,
      0.82,
      1,
    );
    const targetScale = THREE.MathUtils.lerp(1, 0.58, destinationShift);
    scaleTarget.current.setScalar(targetScale);
    group.current.scale.lerp(scaleTarget.current, 1 - Math.exp(-delta * 3));
    group.current.rotation.y =
      clock.elapsedTime * 0.12 + progress.current * Math.PI * 1.4;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.35) * 0.08;
  });

  return (
    <Float floatIntensity={0.35} rotationIntensity={0.14} speed={1.1}>
      <group ref={group}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.72, 2]} />
          <meshStandardMaterial
            color="#0f2940"
            metalness={0.72}
            roughness={0.23}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#22d3ee"
            emissiveIntensity={1.8}
            roughness={0.18}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0.2, 0]}>
          <torusGeometry args={[1.08, 0.025, 12, 128]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.72} />
        </mesh>
        <mesh rotation={[Math.PI / 2, -0.5, 0]}>
          <torusGeometry args={[1.35, 0.012, 8, 128]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.4} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 1.18, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.92, 0.08, 0.5]} />
              <meshStandardMaterial
                color="#182b54"
                emissive="#2563eb"
                emissiveIntensity={0.25}
                metalness={0.55}
              />
            </mesh>
            <mesh position={[-side * 0.55, 0, 0]}>
              <boxGeometry args={[0.22, 0.12, 0.12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.88, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.55, 10]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.75} />
        </mesh>
        <mesh position={[0, 1.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 0.12, 20]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#22d3ee"
            emissiveIntensity={1}
          />
        </mesh>
      </group>
    </Float>
  );
}

const opportunityColors = [
  "#67e8f9",
  "#a78bfa",
  "#6ee7b7",
  "#60a5fa",
  "#f0abfc",
];

function OpportunityNode({
  index,
  progress,
}: Pick<CareerOrbitCanvasProps, "progress"> & { index: number }) {
  const group = useRef<THREE.Group>(null);
  const chaoticPosition = useMemo(
    () =>
      new THREE.Vector3(
        Math.sin(index * 2.1) * (2.2 + (index % 2) * 0.7),
        Math.cos(index * 1.4) * 1.75,
        -0.7 + (index % 3) * 0.45,
      ),
    [index],
  );
  const orbitalPosition = useMemo(() => {
    const angle = (index / 7) * Math.PI * 2 + 0.3;
    const radius = 2.3 + (index % 2) * 0.6;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.62,
      -0.4,
    );
  }, [index]);
  const target = useRef(new THREE.Vector3());
  const targetScale = useRef(new THREE.Vector3());

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const order = THREE.MathUtils.smoothstep(progress.current, 0.24, 0.4);
    const visibility = rangeStrength(progress.current, 0.08, 0.28, 0.7);
    target.current.lerpVectors(chaoticPosition, orbitalPosition, order);
    target.current.y += Math.sin(clock.elapsedTime * 0.65 + index) * 0.08;
    group.current.position.lerp(target.current, 1 - Math.exp(-delta * 4));
    targetScale.current.setScalar(Math.max(0.001, visibility));
    group.current.scale.lerp(targetScale.current, 1 - Math.exp(-delta * 5));
    group.current.rotation.y = clock.elapsedTime * 0.18 + index;
    group.current.rotation.z = order * 0.25;
  });

  return (
    <group ref={group} scale={0.001}>
      <mesh castShadow>
        <boxGeometry args={[0.66, 0.42, 0.12]} />
        <meshStandardMaterial
          color="#101a2b"
          emissive={opportunityColors[index % opportunityColors.length]}
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.2, 0.08, 0.07]}>
        <boxGeometry args={[0.16, 0.035, 0.01]} />
        <meshBasicMaterial
          color={opportunityColors[index % opportunityColors.length]}
        />
      </mesh>
      <mesh position={[0, -0.06, 0.07]}>
        <boxGeometry args={[0.42, 0.025, 0.01]} />
        <meshBasicMaterial color="#64748b" />
      </mesh>
    </group>
  );
}

function FeatureStations({
  progress,
}: Pick<CareerOrbitCanvasProps, "progress">) {
  const group = useRef<THREE.Group>(null);
  const targetScale = useRef(new THREE.Vector3());

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const strength = rangeStrength(progress.current, 0.34, 0.52, 0.72);
    targetScale.current.setScalar(Math.max(0.001, strength));
    group.current.scale.lerp(targetScale.current, 1 - Math.exp(-delta * 4));
    group.current.rotation.y =
      -progress.current * 1.2 + clock.elapsedTime * 0.05;
  });

  return (
    <group ref={group} scale={0.001}>
      {opportunityColors.map((color, index) => {
        const angle = (index / opportunityColors.length) * Math.PI * 2;
        return (
          <group
            key={color}
            position={[Math.cos(angle) * 2.65, Math.sin(angle) * 1.45, -0.25]}
          >
            <mesh>
              <octahedronGeometry args={[0.34, 0]} />
              <meshStandardMaterial
                color="#111c30"
                emissive={color}
                emissiveIntensity={0.75}
                metalness={0.45}
                roughness={0.28}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.54, 0.012, 8, 64]} />
              <meshBasicMaterial color={color} transparent opacity={0.55} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function WorkflowRoute({ progress }: Pick<CareerOrbitCanvasProps, "progress">) {
  const group = useRef<THREE.Group>(null);
  const targetScale = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!group.current) return;
    const strength = rangeStrength(progress.current, 0.55, 0.69, 0.86);
    targetScale.current.setScalar(Math.max(0.001, strength));
    group.current.scale.lerp(targetScale.current, 1 - Math.exp(-delta * 5));
  });

  return (
    <group ref={group} position={[0, -0.3, 0.1]} scale={0.001}>
      {Array.from({ length: 5 }, (_, index) => (
        <group
          key={index}
          position={[(index - 2) * 1.05, Math.sin(index * 0.9) * 0.42, 0]}
        >
          <mesh>
            <sphereGeometry args={[0.16 + index * 0.025, 20, 20]} />
            <meshStandardMaterial
              color={opportunityColors[index]}
              emissive={opportunityColors[index]}
              emissiveIntensity={1.15}
            />
          </mesh>
          {index < 4 ? (
            <mesh
              position={[0.52, Math.sin((index + 1) * 0.9) * 0.2, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.018, 0.018, 0.92, 8]} />
              <meshBasicMaterial color="#67e8f9" transparent opacity={0.5} />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  );
}

function DashboardHologram({
  progress,
}: Pick<CareerOrbitCanvasProps, "progress">) {
  const group = useRef<THREE.Group>(null);
  const targetScale = useRef(new THREE.Vector3());

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const strength = rangeStrength(progress.current, 0.7, 0.82, 0.95);
    targetScale.current.setScalar(Math.max(0.001, strength));
    group.current.scale.lerp(targetScale.current, 1 - Math.exp(-delta * 5));
    group.current.rotation.y =
      -0.18 + Math.sin(clock.elapsedTime * 0.4) * 0.025;
  });

  return (
    <group
      ref={group}
      position={[0.2, 0, 0]}
      rotation={[0.08, -0.18, 0]}
      scale={0.001}
    >
      <mesh>
        <boxGeometry args={[4.4, 2.65, 0.08]} />
        <meshStandardMaterial
          color="#0b1628"
          emissive="#2563eb"
          emissiveIntensity={0.16}
          metalness={0.42}
          roughness={0.18}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[-1.45, 0.7, 0.08]}>
        <boxGeometry args={[0.85, 0.55, 0.04]} />
        <meshBasicMaterial color="#164e63" />
      </mesh>
      <mesh position={[-0.35, 0.7, 0.08]}>
        <boxGeometry args={[0.85, 0.55, 0.04]} />
        <meshBasicMaterial color="#312e81" />
      </mesh>
      <mesh position={[0.75, 0.7, 0.08]}>
        <boxGeometry args={[0.85, 0.55, 0.04]} />
        <meshBasicMaterial color="#064e3b" />
      </mesh>
      {Array.from({ length: 6 }, (_, index) => (
        <mesh
          key={index}
          position={[-1.45 + index * 0.54, -0.55 + (index % 3) * 0.13, 0.1]}
        >
          <boxGeometry args={[0.24, 0.45 + (index % 3) * 0.25, 0.05]} />
          <meshBasicMaterial
            color={opportunityColors[index % opportunityColors.length]}
          />
        </mesh>
      ))}
    </group>
  );
}

function DestinationPortal({
  progress,
}: Pick<CareerOrbitCanvasProps, "progress">) {
  const group = useRef<THREE.Group>(null);
  const targetScale = useRef(new THREE.Vector3());

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const strength = THREE.MathUtils.smoothstep(progress.current, 0.86, 0.98);
    targetScale.current.setScalar(Math.max(0.001, strength));
    group.current.scale.lerp(targetScale.current, 1 - Math.exp(-delta * 4));
    group.current.rotation.z = clock.elapsedTime * 0.08;
  });

  return (
    <group ref={group} position={[0, 0, -0.5]} scale={0.001}>
      <mesh>
        <torusGeometry args={[2, 0.12, 24, 160]} />
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#67e8f9"
          emissiveIntensity={3}
          transparent
          opacity={0.82}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[1.7, 0.035, 12, 128]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.72} />
      </mesh>
      <pointLight color="#67e8f9" distance={12} intensity={8} />
    </group>
  );
}

function CareerScene({
  compact,
  pointer,
  progress,
}: Omit<CareerOrbitCanvasProps, "active">) {
  return (
    <>
      <color attach="background" args={["#030711"]} />
      <fog attach="fog" args={["#030711", 7, 18]} />
      <ambientLight intensity={0.42} />
      <directionalLight
        castShadow={!compact}
        color="#dbeafe"
        intensity={2.6}
        position={[4, 5, 6]}
      />
      <pointLight
        color="#a78bfa"
        distance={10}
        intensity={5}
        position={[-3, 1, 2]}
      />
      <Stars
        count={compact ? 750 : 1600}
        depth={35}
        factor={compact ? 2.2 : 3.2}
        fade
        radius={18}
        saturation={0.25}
        speed={0.18}
      />
      <SceneRig pointer={pointer} progress={progress} />
      <SceneWorld compact={compact} progress={progress}>
        <Satellite progress={progress} />
        {Array.from({ length: compact ? 5 : 7 }, (_, index) => (
          <OpportunityNode index={index} key={index} progress={progress} />
        ))}
        <FeatureStations progress={progress} />
        <WorkflowRoute progress={progress} />
        <DashboardHologram progress={progress} />
        <DestinationPortal progress={progress} />
      </SceneWorld>
    </>
  );
}

export function CareerOrbitCanvas({
  active,
  compact,
  pointer,
  progress,
}: CareerOrbitCanvasProps) {
  return (
    <Canvas
      camera={{
        far: 40,
        fov: compact ? 52 : 45,
        near: 0.1,
        position: [0, 0.2, 8.8],
      }}
      dpr={compact ? [1, 1] : [1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{
        alpha: false,
        antialias: !compact,
        powerPreference: "high-performance",
      }}
      performance={{ debounce: 240, max: 1, min: 0.5 }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      shadows={!compact}
    >
      <CareerScene compact={compact} pointer={pointer} progress={progress} />
    </Canvas>
  );
}
