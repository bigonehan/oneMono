"use client";

import { useFrame } from "@react-three/fiber";
import nipplejs from "nipplejs";
import { useEffect, useRef } from "react";
import { Vector2 } from "three";
import type { Group } from "three";
import type { ThirdPersonCameraOptions } from "../camera/third";
import { useThirdPersonCamera } from "../camera/third";

export type CharacterControllerProps = {
  speed?: number;
  jumpVelocity?: number;
  gravity?: number;
  joystickSize?: number;
  color?: string;
  initialPosition?: [number, number, number];
  thirdPersonCamera?: ThirdPersonCameraOptions | false;
};

const hasTouchSupport = () =>
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export const CharacterController = ({
  speed = 4,
  jumpVelocity = 6,
  gravity = 16,
  joystickSize = 120,
  color = "#7dd3fc",
  initialPosition = [0, 0, 0],
  thirdPersonCamera = {},
}: CharacterControllerProps) => {
  const characterRef = useRef<Group | null>(null);
  const keyStateRef = useRef({ w: false, a: false, s: false, d: false });
  const joystickAxisRef = useRef(new Vector2(0, 0));
  const jumpQueuedRef = useRef(false);
  const groundedRef = useRef(true);
  const verticalVelocityRef = useRef(0);
  const joystickZoneRef = useRef<HTMLDivElement | null>(null);

  useThirdPersonCamera(characterRef, thirdPersonCamera === false ? undefined : thirdPersonCamera, thirdPersonCamera !== false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key in keyStateRef.current) {
        keyStateRef.current[key as "w" | "a" | "s" | "d"] = true;
      }

      if (event.code === "Space") {
        event.preventDefault();
        jumpQueuedRef.current = true;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key in keyStateRef.current) {
        keyStateRef.current[key as "w" | "a" | "s" | "d"] = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!hasTouchSupport()) {
      return;
    }

    const joystickZone = document.createElement("div");
    joystickZone.setAttribute("data-ui-three-joystick", "true");
    Object.assign(joystickZone.style, {
      position: "fixed",
      left: "24px",
      bottom: "24px",
      width: `${joystickSize}px`,
      height: `${joystickSize}px`,
      zIndex: "9999",
      touchAction: "none",
    });

    document.body.appendChild(joystickZone);
    joystickZoneRef.current = joystickZone;

    const manager = nipplejs.create({
      zone: joystickZone,
      mode: "static",
      position: { left: "50%", top: "50%" },
      size: joystickSize,
      color: "white",
    });

    manager.on("move", (_, data) => {
      const angle = data.angle?.radian ?? 0;
      const force = Math.min(data.force ?? 0, 1);
      joystickAxisRef.current.set(Math.cos(angle) * force, Math.sin(angle) * force);
    });

    manager.on("end", () => {
      joystickAxisRef.current.set(0, 0);
    });

    const onTouchStart = (event: TouchEvent) => {
      const targetNode = event.target instanceof Node ? event.target : null;
      if (targetNode && joystickZone.contains(targetNode)) {
        return;
      }

      jumpQueuedRef.current = true;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      joystickAxisRef.current.set(0, 0);
      manager.destroy();
      joystickZone.remove();
      joystickZoneRef.current = null;
    };
  }, [joystickSize]);

  useFrame((_, delta) => {
    const character = characterRef.current;
    if (!character) {
      return;
    }

    let horizontal = 0;
    let vertical = 0;

    if (keyStateRef.current.a) {
      horizontal -= 1;
    }
    if (keyStateRef.current.d) {
      horizontal += 1;
    }
    if (keyStateRef.current.w) {
      vertical += 1;
    }
    if (keyStateRef.current.s) {
      vertical -= 1;
    }

    if (hasTouchSupport() && joystickAxisRef.current.lengthSq() > 0) {
      horizontal = joystickAxisRef.current.x;
      vertical = joystickAxisRef.current.y;
    }

    const movementLength = Math.hypot(horizontal, vertical);
    if (movementLength > 0) {
      const normalizedX = horizontal / movementLength;
      const normalizedY = vertical / movementLength;

      character.position.x += normalizedX * speed * delta;
      character.position.z += -normalizedY * speed * delta;

      character.rotation.y = Math.atan2(normalizedX, -normalizedY);
    }

    if (jumpQueuedRef.current && groundedRef.current) {
      verticalVelocityRef.current = jumpVelocity;
      groundedRef.current = false;
      jumpQueuedRef.current = false;
    }

    verticalVelocityRef.current -= gravity * delta;
    character.position.y += verticalVelocityRef.current * delta;

    if (character.position.y <= 0) {
      character.position.y = 0;
      verticalVelocityRef.current = 0;
      groundedRef.current = true;
    }
  });

  return (
    <group ref={characterRef} position={initialPosition}>
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};
