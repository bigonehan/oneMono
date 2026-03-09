import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import type { RuntimeSelectionState } from "./types";

type Props = {
  selection: RuntimeSelectionState;
};

export function R3FViewport({ selection }: Props) {
  const color = useMemo(() => {
    return selection.selectedModuleId ? "#38bdf8" : "#64748b";
  }, [selection.selectedModuleId]);

  return (
    <div style={{ height: 220, width: "100%" }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.6} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </Canvas>
    </div>
  );
}
