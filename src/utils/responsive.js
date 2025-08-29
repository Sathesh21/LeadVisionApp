import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (design reference)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Responsive width
export const wp = (percentage) => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive height
export const hp = (percentage) => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive font size
export const rf = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Device type detection
export const isTablet = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
  
  return (adjustedWidth >= 1000 || adjustedHeight >= 1000);
};

// Screen size categories
export const getScreenSize = () => {
  if (SCREEN_WIDTH < 350) return 'small';
  if (SCREEN_WIDTH < 414) return 'medium';
  return 'large';
};

// Responsive spacing
export const spacing = {
  xs: wp(1),
  sm: wp(2),
  md: wp(4),
  lg: wp(6),
  xl: wp(8),
  xxl: wp(12),
};

// Responsive border radius
export const borderRadius = {
  sm: wp(2),
  md: wp(3),
  lg: wp(4),
  xl: wp(6),
};

// Responsive font sizes
export const fontSize = {
  xs: rf(10),
  sm: rf(12),
  md: rf(14),
  lg: rf(16),
  xl: rf(18),
  xxl: rf(20),
  xxxl: rf(24),
};

export default {
  wp,
  hp,
  rf,
  isTablet,
  getScreenSize,
  spacing,
  borderRadius,
  fontSize,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};