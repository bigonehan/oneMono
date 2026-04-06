"use client";

import { useFrame, useThree } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { Vector3 } from "three";
import type { Camera, Object3D } from "three";

export type ThirdPersonCameraOptions = {
  distance?: number;
  height?: number;
  lookAtHeight?: number;
  smoothing?: number;
};

const DEFAULT_OPTIONS: Required<ThirdPersonCameraOptions> = {
  distance: 4,
  height: 2,
  lookAtHeight: 1,
  smoothing: 10,
};

const backward = new Vector3();
const desiredPosition = new Vector3();
const lookAtPoint = new Vector3();

export const updateThirdPersonCamera = (
  camera: Camera,
  target: Object3D,
  delta: number,
  options?: ThirdPersonCameraOptions,
) => {
  const resolved = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  backward.set(0, 0, 1).applyQuaternion(target.quaternion).normalize();
  desiredPosition.copy(target.position).addScaledVector(backward, resolved.distance);
  desiredPosition.y = target.position.y + resolved.height;

  const lerpFactor = 1 - Math.exp(-resolved.smoothing * delta);
  camera.position.lerp(desiredPosition, lerpFactor);

  lookAtPoint.copy(target.position);
  lookAtPoint.y += resolved.lookAtHeight;
  camera.lookAt(lookAtPoint);
};

export const useThirdPersonCamera = (
  targetRef: MutableRefObject<Object3D | null>,
  options?: ThirdPersonCameraOptions,
  enabled = true,
) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!enabled || !targetRef.current) {
      return;
    }

    updateThirdPersonCamera(camera, targetRef.current, delta, options);
  });
};
