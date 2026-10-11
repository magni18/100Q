import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, useWindowDimensions } from 'react-native';

const GRAIN_TILE_SIZE = 256;
const GRAIN_OPACITY = 0.08;
const GRAIN_FRAME_MS = 80;
const grainTile = require('../../assets/grain.png');

function randomOffset() {
  return -Math.floor(Math.random() * GRAIN_TILE_SIZE);
}

export function GrainOverlay() {
  const { width, height } = useWindowDimensions();
  const offsetX = useRef(new Animated.Value(0)).current;
  const offsetY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const intervalId = setInterval(() => {
      offsetX.setValue(randomOffset());
      offsetY.setValue(randomOffset());
    }, GRAIN_FRAME_MS);
    return () => clearInterval(intervalId);
  }, [offsetX, offsetY]);

  return (
    <Animated.Image
      source={grainTile}
      resizeMode="repeat"
      pointerEvents="none"
      style={[
        styles.grain,
        { width: width + GRAIN_TILE_SIZE, height: height + GRAIN_TILE_SIZE },
        { transform: [{ translateX: offsetX }, { translateY: offsetY }] },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  grain: { position: 'absolute', top: 0, left: 0, opacity: GRAIN_OPACITY },
});
