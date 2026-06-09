import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImageManipulator from "expo-image-manipulator";

const { width, height } = Dimensions.get("window");
const FRAME_SIZE = width * 0.82;
const FRAME_TOP  = (height - FRAME_SIZE) / 2 - 40;
const FRAME_LEFT = (width - FRAME_SIZE) / 2;

type Props = {
  onPhotoCaptured: (uri: string) => void;
};

export default function CameraScreen({ onPhotoCaptured }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={48} color="#fff" />
        <Text style={styles.permissionText}>
          Camera access is needed to scan your plant.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePicture() {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (!photo?.uri) return;

    // The photo's pixel dimensions are larger than the screen.
    // Calculate the scale factor between the actual photo and the screen.
    const scaleX = photo.width  / width;
    const scaleY = photo.height / height;

    // Crop coordinates scaled to the actual photo resolution
    const cropX      = FRAME_LEFT * scaleX;
    const cropY      = FRAME_TOP  * scaleY;
    const cropWidth  = FRAME_SIZE * scaleX;
    const cropHeight = FRAME_SIZE * scaleY;

    const cropped = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ crop: { originX: cropX, originY: cropY, width: cropWidth, height: cropHeight } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    onPhotoCaptured(cropped.uri);
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />

      {/* Dark overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[styles.overlay, { height: FRAME_TOP }]} />
        <View style={{ flexDirection: "row", height: FRAME_SIZE }}>
          <View style={[styles.overlay, { flex: 1 }]} />
          <View style={{ width: FRAME_SIZE }} />
          <View style={[styles.overlay, { flex: 1 }]} />
        </View>
        <View style={[styles.overlay, { flex: 1 }]} />
      </View>

      {/* Dashed frame */}
      <View
        pointerEvents="none"
        style={[styles.dashedFrame, {
          width: FRAME_SIZE,
          height: FRAME_SIZE,
          top: FRAME_TOP,
          left: FRAME_LEFT,
        }]}
      />

      <Text style={styles.instruction}>Place within the borders</Text>

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
          style={styles.iconBtn}
        >
          <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.shutterRow}>
        <TouchableOpacity onPress={takePicture} style={styles.shutterOuter} activeOpacity={0.8}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  dashedFrame: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
    borderStyle: "dashed",
    borderRadius: 16,
  },
  instruction: {
    position: "absolute",
    top: FRAME_TOP - 48,
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontFamily: "NataSans-SemiBold",
  },
  topBar: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterRow: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 32,
  },
  permissionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "NataSans-Regular",
  },
  permissionBtn: {
    backgroundColor: "#5ECFBF",
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  permissionBtnText: {
    color: "#fff",
    fontFamily: "NataSans-SemiBold",
    fontSize: 16,
  },
});