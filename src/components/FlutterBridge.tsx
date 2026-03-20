import { useFlutterBridge } from '@/hooks/useFlutterBridge';

/** Invisible component — mounts the Flutter ↔ React navigation bridge. */
const FlutterBridge = () => {
  useFlutterBridge();
  return null;
};

export default FlutterBridge;
