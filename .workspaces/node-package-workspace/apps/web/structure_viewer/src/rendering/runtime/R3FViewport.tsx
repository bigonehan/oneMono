import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent,
} from "react";
import * as THREE from "three";
import type { RuntimeSelectionState } from "./types";

type Props = {
  selection: RuntimeSelectionState;
  onFunctionSelect?: (functionId: string) => void;
  onDomainSelect?: (domainId: string | null) => void;
};

export function R3FViewport({ selection, onFunctionSelect, onDomainSelect }: Props) {
  const [zoomLevel, setZoomLevel] = useState(0);
  const [isViewportActive, setIsViewportActive] = useState(false);
  const [lookTargetOffset, setLookTargetOffset] = useState<[number, number]>([0, 0]);
  const [pressMoveTarget, setPressMoveTarget] = useState<[number, number]>([0, 0]);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const previousPointerPositionRef = useRef<[number, number] | null>(null);
  const pressTweenDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetCameraZ = useMemo(() => 4.2 + zoomLevel * 0.9, [zoomLevel]);

  const domainLayouts = useMemo(() => {
    const domains = selection.domainEntries;
    if (domains.length === 0) {
      return [] as Array<{ id: string; name: string; functionEntries: Props["selection"]["functionEntries"]; position: [number, number, number] }>;
    }

    const radius = 4.5;
    return domains.map((domain, index) => {
      const angle = (index / domains.length) * Math.PI * 2;
      return {
        ...domain,
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius * 0.4] as [number, number, number],
      };
    });
  }, [selection.domainEntries]);

  const selectedDomainLayout = useMemo(
    () => domainLayouts.find((item) => item.id === selection.selectedDomainId) ?? domainLayouts[0] ?? null,
    [domainLayouts, selection.selectedDomainId],
  );

  const onWheelZoom = useCallback((event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setZoomLevel((prev) => {
      const direction = event.deltaY > 0 ? 1 : -1;
      return Math.min(3, Math.max(0, prev + direction));
    });
  }, []);

  const onViewportPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    setLookTargetOffset([THREE.MathUtils.clamp(nx, -1, 1), THREE.MathUtils.clamp(-ny, -1, 1)]);
    previousPointerPositionRef.current = [event.clientX, event.clientY];
  }, []);

  const startPointerPressTween = useCallback(
    (before: [number, number], pressed: [number, number]) => {
      const deltaX = pressed[0] - before[0];
      const deltaY = pressed[1] - before[1];
      if (pressTweenDelayTimerRef.current) {
        clearTimeout(pressTweenDelayTimerRef.current);
      }
      pressTweenDelayTimerRef.current = setTimeout(() => {
        setPressMoveTarget([
          THREE.MathUtils.clamp(deltaX / 220, -0.4, 0.4),
          THREE.MathUtils.clamp(-deltaY / 220, -0.28, 0.28),
        ]);
      }, 140);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (pressTweenDelayTimerRef.current) {
        clearTimeout(pressTweenDelayTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isViewportActive) {
      return;
    }

    const blockOutsideScroll = (event: globalThis.WheelEvent) => {
      event.preventDefault();
    };

    window.addEventListener("wheel", blockOutsideScroll, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", blockOutsideScroll, { capture: true });
    };
  }, [isViewportActive]);

  return (
    <div
      ref={viewportRef}
      style={{ height: 380, width: "100%" }}
      onWheel={onWheelZoom}
      tabIndex={0}
      onPointerEnter={(event) => {
        setIsViewportActive(true);
        onViewportPointerMove(event);
      }}
      onPointerLeave={() => setIsViewportActive(false)}
      onPointerMove={onViewportPointerMove}
      onPointerDown={(event) => {
        const pressed: [number, number] = [event.clientX, event.clientY];
        const before = previousPointerPositionRef.current ?? pressed;
        startPointerPressTween(before, pressed);
        previousPointerPositionRef.current = pressed;
      }}
      onPointerUp={() => {
        if (pressTweenDelayTimerRef.current) {
          clearTimeout(pressTweenDelayTimerRef.current);
        }
        setPressMoveTarget([0, 0]);
      }}
      onFocus={() => setIsViewportActive(true)}
      onBlur={() => setIsViewportActive(false)}
    >
      <Canvas camera={{ position: [0, 2.2, 4.2], fov: 52 }}>
        <CameraFocusRig
          target={selectedDomainLayout?.position ?? [0, 0, 0]}
          targetZ={targetCameraZ}
          lookTargetOffset={lookTargetOffset}
          pressMoveTarget={pressMoveTarget}
        />

        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 6, 4]} intensity={0.8} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]}>
          <circleGeometry args={[14, 96]} />
          <meshStandardMaterial color="#0b1220" transparent opacity={0.9} />
        </mesh>

        {domainLayouts.map((domain) => (
          <DomainObject
            key={domain.id}
            domainId={domain.id}
            domainName={domain.name}
            selectedDomainId={selection.selectedDomainId}
            selectedFunctionId={selection.selectedFunctionId}
            position={domain.position}
            functionEntries={domain.functionEntries}
            onDomainSelect={onDomainSelect}
            onFunctionSelect={onFunctionSelect}
          />
        ))}
      </Canvas>
    </div>
  );
}

function CameraFocusRig({
  target,
  targetZ,
  lookTargetOffset,
  pressMoveTarget,
}: {
  target: [number, number, number];
  targetZ: number;
  lookTargetOffset: [number, number];
  pressMoveTarget: [number, number];
}) {
  const { camera } = useThree();
  const pressMoveSmoothedRef = useRef(new THREE.Vector2(0, 0));

  useFrame(() => {
    const targetVector = new THREE.Vector3(target[0], target[1], target[2]);
    const frontOffset = new THREE.Vector3(0, 1.6, targetZ);
    const desiredCamera = targetVector.clone().add(frontOffset);
    const pressTweenAlpha = 0.17;
    pressMoveSmoothedRef.current.x = THREE.MathUtils.lerp(
      pressMoveSmoothedRef.current.x,
      pressMoveTarget[0],
      pressTweenAlpha,
    );
    pressMoveSmoothedRef.current.y = THREE.MathUtils.lerp(
      pressMoveSmoothedRef.current.y,
      pressMoveTarget[1],
      pressTweenAlpha,
    );

    camera.position.set(
      desiredCamera.x + pressMoveSmoothedRef.current.x,
      desiredCamera.y + pressMoveSmoothedRef.current.y,
      desiredCamera.z,
    );

    const lookX = targetVector.x + lookTargetOffset[0] * 0.75;
    const lookY = targetVector.y + lookTargetOffset[1] * 0.45;
    camera.lookAt(lookX, lookY, targetVector.z);
    camera.updateProjectionMatrix();
  });

  return null;
}

type DomainObjectProps = {
  domainId: string;
  domainName: string;
  selectedDomainId: string | null;
  selectedFunctionId: string | null;
  position: [number, number, number];
  functionEntries: RuntimeSelectionState["functionEntries"];
  onDomainSelect?: (domainId: string | null) => void;
  onFunctionSelect?: (functionId: string) => void;
};

function DomainObject({
  domainId,
  domainName,
  selectedDomainId,
  selectedFunctionId,
  position,
  functionEntries,
  onDomainSelect,
  onFunctionSelect,
}: DomainObjectProps) {
  const isSelected = selectedDomainId === domainId;

  return (
    <group position={position}>
      <mesh
        onPointerDown={(event) => {
          event.stopPropagation();
          onDomainSelect?.(domainId);
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isSelected ? "#38bdf8" : "#475569"} />
      </mesh>

      <TextSprite
        text={`📦 ${domainName}`}
        position={[0, 0, 0.78]}
        color="#ffffff"
        fontSize={26}
        width={360}
        height={92}
        selected={isSelected}
        onSelect={() => onDomainSelect?.(domainId)}
      />

      {functionEntries.slice(0, 8).map((item, index, all) => {
        const angle = (index / all.length) * Math.PI * 2;
        const radius = 1.85;
        const fx = Math.cos(angle) * radius;
        const fy = Math.sin(angle) * radius * 0.72;

        return (
          <TextSprite
            key={item.id}
            text={`${item.iconGlyph} ${item.name}`}
            position={[fx, fy, 0.2]}
            color="#93c5fd"
            fontSize={18}
            width={300}
            height={70}
            selected={selectedFunctionId === item.id}
            onSelect={() => {
              onDomainSelect?.(domainId);
              onFunctionSelect?.(item.id);
            }}
          />
        );
      })}
    </group>
  );
}

type TextSpriteProps = {
  text: string;
  position: [number, number, number];
  color: string;
  fontSize: number;
  width: number;
  height: number;
  selected?: boolean;
  onSelect?: () => void;
};

function TextSprite({
  text,
  position,
  color,
  fontSize,
  width,
  height,
  selected = false,
  onSelect,
}: TextSpriteProps) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return null;
    }

    context.clearRect(0, 0, width, height);
    context.fillStyle = selected ? "rgba(30,64,175,0.86)" : "rgba(15,23,42,0.72)";
    context.fillRect(0, 0, width, height);
    context.font = `600 ${fontSize}px sans-serif`;
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, width / 2, height / 2);

    const next = new THREE.CanvasTexture(canvas);
    next.needsUpdate = true;
    return next;
  }, [color, fontSize, height, selected, text, width]);

  if (!texture) {
    return null;
  }

  return (
    <sprite
      position={position}
      scale={[1.3, 0.33, 1]}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect?.();
      }}
    >
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}
