"use client";

import { ContactShadows, Environment, Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { useRef } from "react";
import * as THREE from "three";

export function DreamGlassScene() {
  return (
    <main className="scene-shell" aria-label="Cube lighting check">
      <Canvas
        className="scene-canvas"
        camera={{ position: [3.1, 2.45, 5.1], fov: 34, near: 0.1, far: 80 }}
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.22;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.fog = new THREE.FogExp2("#7fa9cf", 0.035);
        }}
      >
        <CubeLightCheck />
      </Canvas>
      <div className="soft-grade" />
      <div className="film-grain" />
    </main>
  );
}

function CubeLightCheck() {
  const rigRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    const rig = rigRef.current;
    if (!rig) return;

    rig.rotation.y = THREE.MathUtils.lerp(rig.rotation.y, pointer.x * 0.06, 0.04);
    rig.rotation.x = THREE.MathUtils.lerp(rig.rotation.x, -pointer.y * 0.025, 0.04);
    rig.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.035;
  });

  return (
    <>
      <color attach="background" args={["#80a9cf"]} />

      <ambientLight intensity={0.38} color="#b8d9ff" />
      <directionalLight
        position={[-3.8, 5.2, 4.4]}
        intensity={2.2}
        color="#ffd2c0"
        castShadow
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-mapSize={[2048, 2048]}
      />
      <rectAreaLight
        position={[2.7, 3.6, 2.8]}
        rotation={[-0.42, 0.42, 0.08]}
        width={5.6}
        height={3.8}
        intensity={8.5}
        color="#ff7aa7"
      />
      <rectAreaLight
        position={[-3.2, 1.1, 3.4]}
        rotation={[-0.1, -0.72, 0]}
        width={4.8}
        height={3.6}
        intensity={3.4}
        color="#9bd2ff"
      />
      <pointLight position={[0.2, 2.7, 2.4]} intensity={1.1} color="#ffe18f" distance={6} />

      <Environment preset="sunset" environmentIntensity={0.42} />
      <Backdrop />

      <group ref={rigRef}>
        <Float speed={1.05} rotationIntensity={0.08} floatIntensity={0.13}>
          <mesh position={[0, 0.65, 0]} rotation={[0.12, -0.48, 0.08]} castShadow receiveShadow>
            <boxGeometry args={[1.55, 1.55, 1.55]} />
            <meshPhysicalMaterial
              color="#ffc0d2"
              roughness={0.34}
              metalness={0}
              clearcoat={0.72}
              clearcoatRoughness={0.18}
              sheen={0.42}
              sheenColor="#fff0f7"
              emissive="#ff7fa5"
              emissiveIntensity={0.035}
            />
          </mesh>
        </Float>
      </group>

      <ContactShadows
        position={[0, -0.24, 0]}
        opacity={0.38}
        scale={7.4}
        blur={3.2}
        far={4.6}
        color="#375d88"
      />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.72} luminanceThreshold={0.18} luminanceSmoothing={0.82} mipmapBlur />
        <DepthOfField focusDistance={0.04} focalLength={0.032} bokehScale={1.45} height={540} />
        <Vignette eskil={false} offset={0.08} darkness={0.34} />
      </EffectComposer>
    </>
  );
}

function Backdrop() {
  return (
    <group>
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#7da5cb" roughness={0.68} metalness={0} />
      </mesh>
      <mesh position={[0, 1.65, -5.2]} scale={[18, 8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#8bb4d8" transparent opacity={0.62} depthWrite={false} />
      </mesh>
      <mesh position={[-2.4, 1.2, -2.6]} scale={[5.8, 1.65, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ffd0dc" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <mesh position={[2.1, 1.75, -3.1]} scale={[4.8, 1.2, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ffe09f" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}
