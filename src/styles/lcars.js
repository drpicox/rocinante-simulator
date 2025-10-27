// LCARS (Library Computer Access/Retrieval System) Design System
// Inspired by Star Trek: The Next Generation UI

// LCARS Color Palette
export const LCARS_COLORS = {
  // Primary LCARS Colors
  orange: '#FF9966',
  orangeLight: '#FFCC99',
  orangeBright: '#FF9900',
  
  purple: '#CC99CC',
  purpleLight: '#9999FF',
  purpleDark: '#996699',
  
  blue: '#9999FF',
  blueLight: '#99CCFF',
  blueDark: '#6666CC',
  
  pink: '#FF99CC',
  pinkLight: '#FFCCFF',
  
  peach: '#FFCC99',
  
  // Background colors
  black: '#000000',
  darkGray: '#111111',
  mediumGray: '#333333',
  
  // Text colors
  textPrimary: '#FFCC99',
  textSecondary: '#FF9966',
  textLight: '#FFDDBB',
  
  // Accent colors for specific states
  success: '#99CCFF',
  warning: '#FF9900',
  error: '#FF6666',
}

// LCARS Typography
export const LCARS_FONTS = {
  primary: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif',
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
}

// LCARS Border Radius Values (characteristic rounded corners)
export const LCARS_RADIUS = {
  small: '8px',
  medium: '16px',
  large: '24px',
  pill: '999px', // For pill-shaped elements
}

// LCARS Panel Styles
export const lcarsPanel = {
  background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95), rgba(34, 34, 34, 0.92))',
  backdropFilter: 'blur(10px)',
  border: `2px solid ${LCARS_COLORS.orange}`,
  borderRadius: LCARS_RADIUS.large,
  boxShadow: `0 0 20px rgba(255, 153, 102, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)`,
}

// LCARS Button Styles
export const lcarsButton = {
  background: LCARS_COLORS.orange,
  border: 'none',
  borderRadius: LCARS_RADIUS.pill,
  color: LCARS_COLORS.black,
  fontFamily: LCARS_FONTS.primary,
  fontWeight: LCARS_FONTS.weight.bold,
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  padding: '8px 20px',
  letterSpacing: '1px',
}

// LCARS Divider (horizontal bar)
export const lcarsDivider = {
  height: '3px',
  background: LCARS_COLORS.orange,
  border: 'none',
  borderRadius: LCARS_RADIUS.small,
  margin: '12px 0',
}

// LCARS Input Field
export const lcarsInput = {
  background: LCARS_COLORS.black,
  border: `2px solid ${LCARS_COLORS.orange}`,
  borderRadius: LCARS_RADIUS.medium,
  color: LCARS_COLORS.textPrimary,
  fontFamily: LCARS_FONTS.primary,
  padding: '8px 12px',
}

// LCARS Label
export const lcarsLabel = {
  color: LCARS_COLORS.textSecondary,
  fontFamily: LCARS_FONTS.primary,
  fontWeight: LCARS_FONTS.weight.semibold,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontSize: '11px',
}

// LCARS Header
export const lcarsHeader = {
  color: LCARS_COLORS.orange,
  fontFamily: LCARS_FONTS.primary,
  fontWeight: LCARS_FONTS.weight.bold,
  textTransform: 'uppercase',
  letterSpacing: '2px',
}
