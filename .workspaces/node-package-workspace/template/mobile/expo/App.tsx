import { StatusBar } from "expo-status-bar";
import { Accelerometer } from "expo-sensors";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Item = {
  id: string;
  title: string;
};

type Tab = "list" | "interaction" | "grid";

type TiltValues = {
  x: number;
  y: number;
  z: number;
};

const DATA: Item[] = [
  { id: "1", title: "Expo + FlashList template" },
  { id: "2", title: "Edit App.tsx to start building screens" },
  { id: "3", title: "Use FlashList for large collections" },
];

const GRID_SIZES = [3, 5, 7, 9] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getGridSize(zoom: number): (typeof GRID_SIZES)[number] {
  if (zoom < 1.8) {
    return 3;
  }
  if (zoom < 2.6) {
    return 5;
  }
  if (zoom < 3.4) {
    return 7;
  }
  return 9;
}

function getPinchDistance(event: GestureResponderEvent): number | null {
  const touches = event.nativeEvent.touches;

  if (!touches || touches.length < 2) {
    return null;
  }

  const first = touches[0];
  const second = touches[1];
  const dx = second.pageX - first.pageX;
  const dy = second.pageY - first.pageY;
  return Math.hypot(dx, dy);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("list");
  const [tilt, setTilt] = useState<TiltValues>({ x: 0, y: 0, z: 0 });
  const [zoom, setZoom] = useState(1.1);
  const [gridSize, setGridSize] = useState<(typeof GRID_SIZES)[number]>(3);

  const cameraDepth = useRef(new Animated.Value(0)).current;
  const zoomRef = useRef(zoom);
  const pinchStartDistance = useRef<number | null>(null);
  const pinchStartZoom = useRef(zoom);

  const cells = useMemo(
    () => Array.from({ length: gridSize * gridSize }, (_, index) => index),
    [gridSize]
  );
  const centerCellIndex = Math.floor(cells.length / 2);
  const zoomProgress = ((zoom - 1) / 3).toFixed(2);

  const cameraScale = cameraDepth.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });
  const cameraTranslateY = cameraDepth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });
  const gridOpacity = cameraDepth.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  useEffect(() => {
    zoomRef.current = zoom;
    setGridSize(getGridSize(zoom));

    Animated.spring(cameraDepth, {
      toValue: clamp((zoom - 1) / 3, 0, 1),
      useNativeDriver: true,
      damping: 18,
      stiffness: 170,
      mass: 0.8,
    }).start();
  }, [cameraDepth, zoom]);

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener?.((data) => {
      setTilt({
        x: data.x,
        y: data.y,
        z: data.z,
      });
    });

    return () => {
      subscription?.remove?.();
    };
  }, []);

  const handlePinchStart = (event: GestureResponderEvent) => {
    const distance = getPinchDistance(event);
    if (!distance) {
      return;
    }

    pinchStartDistance.current = distance;
    pinchStartZoom.current = zoomRef.current;
  };

  const handlePinchMove = (event: GestureResponderEvent) => {
    const distance = getPinchDistance(event);
    if (!distance) {
      return;
    }

    if (!pinchStartDistance.current) {
      pinchStartDistance.current = distance;
      pinchStartZoom.current = zoomRef.current;
      return;
    }

    const distanceDelta = distance - pinchStartDistance.current;
    const nextZoom = clamp(pinchStartZoom.current + distanceDelta / 120, 1, 4);
    setZoom(nextZoom);
  };

  const resetPinch = () => {
    pinchStartDistance.current = null;
    pinchStartZoom.current = zoomRef.current;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native Template</Text>
        <Text style={styles.subtitle}>Expo + FlashList + Sensor</Text>
      </View>

      <View style={styles.content}>
        {activeTab === "list" ? (
          <FlashList
            data={DATA}
            estimatedItemSize={56}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.title}</Text>
              </View>
            )}
          />
        ) : activeTab === "interaction" ? (
          <View style={styles.sensorCard}>
            <Text style={styles.sensorTitle}>Phone Tilt (Realtime)</Text>
            <Text style={styles.sensorValue}>x: {tilt.x.toFixed(3)}</Text>
            <Text style={styles.sensorValue}>y: {tilt.y.toFixed(3)}</Text>
            <Text style={styles.sensorValue}>z: {tilt.z.toFixed(3)}</Text>
            <Text style={styles.sensorHint}>
              {Platform.OS === "web"
                ? "웹에서는 센서 값이 제한될 수 있습니다."
                : "휴대폰을 기울이면 값이 실시간으로 변경됩니다."}
            </Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            <Text style={styles.gridTitle}>Grid Zoom Camera</Text>
            <Text style={styles.gridSubtitle}>
              두 손가락을 벌려서(핀치 아웃) 더 멀리 보세요.
            </Text>

            <View
              style={styles.gridViewport}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={handlePinchStart}
              onResponderMove={handlePinchMove}
              onResponderRelease={resetPinch}
              onResponderTerminate={resetPinch}
            >
              <Animated.View
                style={[
                  styles.gridCamera,
                  {
                    transform: [
                      { translateY: cameraTranslateY },
                      { scale: cameraScale },
                    ],
                  },
                ]}
              >
                <Animated.View style={[styles.gridBoard, { opacity: gridOpacity }]}>
                  {cells.map((cellIndex) => (
                    <View
                      key={cellIndex}
                      style={[
                        styles.gridCell,
                        { width: `${100 / gridSize}%` },
                        cellIndex === centerCellIndex && styles.gridCellCenter,
                      ]}
                    />
                  ))}
                </Animated.View>
              </Animated.View>
            </View>

            <View style={styles.gridMetaRow}>
              <Text style={styles.gridMetaText}>
                Grid: {gridSize} x {gridSize}
              </Text>
              <Text style={styles.gridMetaText}>Zoom: {zoomProgress}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabButton, activeTab === "list" && styles.tabButtonActive]}
          onPress={() => setActiveTab("list")}
        >
          <Text
            style={[styles.tabLabel, activeTab === "list" && styles.tabLabelActive]}
          >
            List
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tabButton,
            activeTab === "interaction" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("interaction")}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "interaction" && styles.tabLabelActive,
            ]}
          >
            Interaction
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === "grid" && styles.tabButtonActive]}
          onPress={() => setActiveTab("grid")}
        >
          <Text
            style={[styles.tabLabel, activeTab === "grid" && styles.tabLabelActive]}
          >
            Grid
          </Text>
        </Pressable>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f8",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#4b5563",
  },
  content: {
    flex: 1,
  },
  item: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  itemText: {
    fontSize: 16,
    color: "#111827",
  },
  sensorCard: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 16,
    marginTop: 8,
  },
  sensorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  sensorValue: {
    fontSize: 22,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  sensorHint: {
    marginTop: 6,
    color: "#4b5563",
    fontSize: 13,
  },
  gridContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 16,
    marginTop: 8,
    flex: 1,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  gridSubtitle: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 13,
    color: "#4b5563",
  },
  gridViewport: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    overflow: "hidden",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  gridCamera: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gridBoard: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
  },
  gridCell: {
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },
  gridCellCenter: {
    backgroundColor: "#dbeafe",
    borderColor: "#60a5fa",
  },
  gridMetaRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gridMetaText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 8,
    marginTop: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#111827",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  tabLabelActive: {
    color: "#f9fafb",
  },
});
