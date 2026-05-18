export const colors = {
  background: '#F8F7FC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F0EBF8',
  primary: '#8B7BB5',
  primaryLight: '#C4B5E8',
  primaryDark: '#6B5A9E',
  text: '#1C1830',
  textSecondary: '#6E6A82',
  border: '#E2DBF0',
  error: '#D95F5F',
};

export const typography = {
  heading: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};
