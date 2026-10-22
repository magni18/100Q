import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';

const GRAIN_TILE_SIZE = 256;
const GRAIN_OPACITY = 0.025;
const GRAIN_FRAME_MS = 200;
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
    <View pointerEvents="none" style={styles.clip}>
      <Animated.Image
        source={grainTile}
        resizeMode="repeat"
        style={[
          styles.grain,
          { width: width + GRAIN_TILE_SIZE, height: height + GRAIN_TILE_SIZE },
          { transform: [{ translateX: offsetX }, { translateY: offsetY }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  grain: { position: 'absolute', top: 0, left: 0, opacity: GRAIN_OPACITY },
});
