"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { use_game_store } from "@store/game-store";

export default function Page() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const loadGame = use_game_store((s) => s.load_game);
  const startGame = use_game_store((s) => s.start_game);
  const endStage = use_game_store((s) => s.end_stage);
  const clickStage = use_game_store((s) => s.click_stage);
  const system = use_game_store((s) => s.system);
  const refreshKey = use_game_store((s) => s.refreshKey);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  useEffect(() => {
    const host = boxRef.current;
    if (!host) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617");

    const camera = new THREE.PerspectiveCamera(70, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 7, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 10, 7);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x94a3b8, 0.55));

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: "#1e293b" })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const character = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 24, 24),
      new THREE.MeshStandardMaterial({ color: "#f97316" })
    );
    character.position.y = 0.45;
    scene.add(character);

    const marker = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.22, 24),
      new THREE.MeshBasicMaterial({ color: "#22d3ee", side: THREE.DoubleSide })
    );
    marker.rotation.x = -Math.PI / 2;
    marker.visible = false;
    scene.add(marker);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onResize = () => {
      if (!host) {
        return;
      }
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(floor);
      if (hits.length === 0) {
        return;
      }
      const hit = hits[0].point;
      clickStage(hit.x, hit.z);
    };

    renderer.domElement.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const { character: stateCharacter } = use_game_store.getState().system.stage;
      character.position.x = stateCharacter.x;
      character.position.z = stateCharacter.z;
      marker.position.x = stateCharacter.x;
      marker.position.z = stateCharacter.z;
      marker.visible = stateCharacter.clickCount > 0;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      renderer.domElement.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      host.removeChild(renderer.domElement);
      renderer.dispose();
      floor.geometry.dispose();
      character.geometry.dispose();
      marker.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      (character.material as THREE.Material).dispose();
      (marker.material as THREE.Material).dispose();
    };
  }, [clickStage]);

  return (
    <main>
      <section className="panel">
        <h1>Clicker Game Base</h1>
        <div className="row">
          <button onClick={startGame} disabled={system.status !== "loaded"}>
            Start
          </button>
          <button onClick={endStage} disabled={system.stage.status !== "started"}>
            End Stage
          </button>
        </div>
        <div className="meta" key={refreshKey}>
          <span>system: {system.status}</span>
          <span>stage: {system.stage.status}</span>
          <span>input: {system.stage.character.inputMode}</span>
          <span>clicks: {system.stage.character.clickCount}</span>
          <span>
            position: ({system.stage.character.x.toFixed(2)}, {system.stage.character.z.toFixed(2)})
          </span>
        </div>
        <div className="canvas-box" ref={boxRef} />
      </section>
    </main>
  );
}
