"use client";

import {
  ContactShadows,
  Environment,
  Float,
  MeshTransmissionMaterial,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type AcrylicPanelProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  accent: string;
  title: string;
  label: string;
  delay?: number;
};

export function DreamGlassScene() {
  return (
    <main className="scene-shell" aria-label="Aurora Glass">
      <Canvas
        className="scene-canvas"
        camera={{ position: [0, 0.55, 7.2], fov: 36, near: 0.1, far: 80 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.18;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.fog = new THREE.FogExp2("#f4ddea", 0.045);
        }}
      >
        <SceneContent />
      </Canvas>
      <div className="soft-grade" />
      <div className="film-grain" />
    </main>
  );
}

function SceneContent() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer, viewport } = useThree();
  const compact = viewport.width < 6;

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.x * 0.08, 0.045);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointer.y * 0.04, 0.045);
    group.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.045;
  });

  return (
    <>
      <color attach="background" args={["#f6dbe7"]} />
      <ambientLight intensity={0.62} color="#fff2f8" />
      <directionalLight
        position={[-4.5, 6, 5]}
        intensity={1.2}
        color="#fff8ef"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <rectAreaLight
        position={[3.2, 3.5, 2.2]}
        rotation={[-0.45, 0.55, 0.1]}
        width={5.5}
        height={4.2}
        intensity={6.4}
        color="#ffd9ea"
      />
      <rectAreaLight
        position={[-4, -0.7, 3.2]}
        rotation={[0.25, -0.55, 0.1]}
        width={4}
        height={3}
        intensity={2.4}
        color="#b7ddff"
      />

      <Environment preset="city" environmentIntensity={0.72} />
      <DreamBackdrop />

      <group ref={groupRef} scale={compact ? 0.72 : 1}>
        <Float speed={1.4} rotationIntensity={0.16} floatIntensity={0.22}>
          <AcrylicPanel
            position={[-1.25, 0.15, 0.15]}
            rotation={[0.04, 0.2, -0.07]}
            scale={[2.45, 3.25, 0.16]}
            color="#ffd1e4"
            accent="#ffffff"
            title="AURORA"
            label="GLASS 01"
          />
        </Float>
        <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.18}>
          <AcrylicPanel
            position={[1.04, -0.24, -0.45]}
            rotation={[-0.03, -0.32, 0.08]}
            scale={[2.15, 2.84, 0.13]}
            color="#f6efff"
            accent="#cfe9ff"
            title="SOFT"
            label="LENS 02"
            delay={0.28}
          />
        </Float>
        <Float speed={1.25} rotationIntensity={0.1} floatIntensity={0.16}>
          <AcrylicPanel
            position={[0.14, 0.92, -1.1]}
            rotation={[0.02, -0.08, 0.03]}
            scale={[3.25, 1.18, 0.1]}
            color="#ffe7f2"
            accent="#f5fbff"
            title="PASTEL"
            label="BLOOM 03"
            delay={0.16}
          />
        </Float>
      </group>

      <ContactShadows
        position={[0, -2.08, 0]}
        opacity={0.22}
        scale={8.5}
        blur={2.7}
        far={5}
        color="#986e91"
      />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.56} luminanceThreshold={0.18} luminanceSmoothing={0.7} mipmapBlur />
        <DepthOfField focusDistance={0.03} focalLength={0.038} bokehScale={2.15} height={540} />
        <Vignette eskil={false} offset={0.12} darkness={0.38} />
      </EffectComposer>
    </>
  );
}

function AcrylicPanel({
  position,
  rotation,
  scale,
  color,
  accent,
  title,
  label,
  delay = 0,
}: AcrylicPanelProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const panel = ref.current;
    if (!panel) return;

    const t = state.clock.elapsedTime + delay;
    panel.position.z = position[2] + Math.sin(t * 0.9) * 0.035;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <RoundedBox args={scale} radius={0.16} smoothness={18} castShadow receiveShadow>
        <MeshTransmissionMaterial
          backside
          samples={8}
          resolution={512}
          transmission={0.82}
          thickness={0.92}
          roughness={0.28}
          ior={1.38}
          chromaticAberration={0.045}
          anisotropy={0.18}
          distortion={0.16}
          distortionScale={0.28}
          temporalDistortion={0.08}
          clearcoat={0.72}
          attenuationColor={color}
          attenuationDistance={1.75}
          color={color}
        />
      </RoundedBox>

      <PanelDetails scale={scale} accent={accent} title={title} label={label} />
    </group>
  );
}

function PanelDetails({
  scale,
  accent,
  title,
  label,
}: {
  scale: [number, number, number];
  accent: string;
  title: string;
  label: string;
}) {
  const z = scale[2] * 0.55 + 0.018;
  const width = scale[0];
  const height = scale[1];

  return (
    <group position={[0, 0, z]}>
      <Text
        position={[-width * 0.28, height * 0.27, 0.01]}
        fontSize={Math.min(width, height) * 0.14}
        letterSpacing={0}
        color="#fffaff"
        anchorX="left"
        anchorY="middle"
        fillOpacity={0.9}
      >
        {title}
      </Text>
      <Text
        position={[-width * 0.28, height * 0.13, 0.01]}
        fontSize={Math.min(width, height) * 0.045}
        letterSpacing={0}
        color="#f9fdff"
        anchorX="left"
        anchorY="middle"
        fillOpacity={0.62}
      >
        {label}
      </Text>
      <mesh position={[width * 0.16, -height * 0.1, 0]} rotation={[0, 0, 0.16]}>
        <planeGeometry args={[width * 0.5, height * 0.025]} />
        <meshBasicMaterial color={accent} transparent opacity={0.42} />
      </mesh>
      <mesh position={[width * 0.22, -height * 0.19, 0]}>
        <circleGeometry args={[Math.min(width, height) * 0.12, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.28} />
      </mesh>
      <mesh position={[-width * 0.24, -height * 0.24, 0]}>
        <planeGeometry args={[width * 0.32, height * 0.025]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function DreamBackdrop() {
  const cloudTexture = useMemo(() => createCloudTexture(), []);

  return (
    <group>
      <mesh position={[0, 0, -4.7]} scale={[13, 8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#f9dfea" transparent opacity={0.72} depthWrite={false} />
      </mesh>
      <CloudPlane texture={cloudTexture} position={[-2.9, 0.9, -2.7]} scale={[6.8, 2.25, 1]} opacity={0.38} />
      <CloudPlane texture={cloudTexture} position={[2.4, -0.15, -3.2]} scale={[7.4, 2.65, 1]} opacity={0.3} />
      <CloudPlane texture={cloudTexture} position={[0.4, -1.45, -2.1]} scale={[8.3, 2.1, 1]} opacity={0.24} />
      <mesh position={[-2.2, 1.7, -1.35]}>
        <sphereGeometry args={[0.68, 48, 48]} />
        <meshBasicMaterial color="#fff9fb" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh position={[2.8, 1.35, -1.85]}>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshBasicMaterial color="#cce8ff" transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CloudPlane({
  texture,
  position,
  scale,
  opacity,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  scale: [number, number, number];
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;

    mesh.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.18 + position[0]) * 0.08;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        color="#ffffff"
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

function createCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  const base = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  base.addColorStop(0, "rgba(255,255,255,0)");
  base.addColorStop(0.5, "rgba(255,255,255,0.42)");
  base.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = base;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const puffs = [
    [94, 142, 92, 0.48],
    [166, 116, 116, 0.58],
    [258, 134, 142, 0.46],
    [352, 108, 116, 0.42],
    [420, 146, 90, 0.34],
  ] as const;

  for (const [x, y, radius, alpha] of puffs) {
    const gradient = context.createRadialGradient(x, y, radius * 0.12, x, y, radius);
    gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
    gradient.addColorStop(0.58, `rgba(255,245,252,${alpha * 0.5})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}
