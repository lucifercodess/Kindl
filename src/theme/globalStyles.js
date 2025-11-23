import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, radius, typography } from './theme';


export const globalStyles = StyleSheet.create({
  // ==================== CONTAINERS ====================
  container: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.primaryWhite,
  },
  content: {
    flex: 1,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paddedContainer: {
    paddingHorizontal: spacing[5], // 20
  },
  paddedContainerLarge: {
    paddingHorizontal: spacing[6], // 32
  },

  // ==================== TEXT STYLES ====================
  // Headings
  h1: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 34,
  },
  h3: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 24,
  },

  // Body text
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 20,
  },

  // Secondary text
  textSecondary: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  textSecondarySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Captions
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 16,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    lineHeight: 16,
  },

  // Text alignment
  textCenter: {
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },

  // ==================== LAYOUT ====================
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },

  // ==================== CARDS & SURFACES ====================
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing[4], // 16
  },
  cardElevated: {
    backgroundColor: colors.primaryWhite,
    borderRadius: radius.md,
    padding: spacing[4],
    ...Platform.select({
      ios: {
        shadowColor: colors.primaryBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardBlack: {
    backgroundColor: colors.primaryBlack,
    borderRadius: radius.md,
    padding: spacing[4],
  },

  // ==================== DIVIDERS ====================
  divider: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
  },
  dividerVertical: {
    width: 1,
    backgroundColor: colors.border,
    height: '100%',
  },
  dividerThick: {
    height: 2,
    backgroundColor: colors.border,
    width: '100%',
  },

  // ==================== SPACING HELPERS ====================
  // Vertical spacing
  marginTopXS: { marginTop: spacing[0] }, // 4
  marginTopSM: { marginTop: spacing[1] }, // 8
  marginTopMD: { marginTop: spacing[2] }, // 12
  marginTopLG: { marginTop: spacing[3] }, // 16
  marginTopXL: { marginTop: spacing[4] }, // 20
  marginTopXXL: { marginTop: spacing[5] }, // 24
  marginTopXXXL: { marginTop: spacing[6] }, // 32

  marginBottomXS: { marginBottom: spacing[0] },
  marginBottomSM: { marginBottom: spacing[1] },
  marginBottomMD: { marginBottom: spacing[2] },
  marginBottomLG: { marginBottom: spacing[3] },
  marginBottomXL: { marginBottom: spacing[4] },
  marginBottomXXL: { marginBottom: spacing[5] },
  marginBottomXXXL: { marginBottom: spacing[6] },

  // Horizontal spacing
  marginLeftXS: { marginLeft: spacing[0] },
  marginLeftSM: { marginLeft: spacing[1] },
  marginLeftMD: { marginLeft: spacing[2] },
  marginLeftLG: { marginLeft: spacing[3] },
  marginLeftXL: { marginLeft: spacing[4] },

  marginRightXS: { marginRight: spacing[0] },
  marginRightSM: { marginRight: spacing[1] },
  marginRightMD: { marginRight: spacing[2] },
  marginRightLG: { marginRight: spacing[3] },
  marginRightXL: { marginRight: spacing[4] },

  // Padding
  paddingXS: { padding: spacing[0] },
  paddingSM: { padding: spacing[1] },
  paddingMD: { padding: spacing[2] },
  paddingLG: { padding: spacing[3] },
  paddingXL: { padding: spacing[4] },
  paddingXXL: { padding: spacing[5] },
  paddingXXXL: { padding: spacing[6] },

  paddingHorizontalXS: { paddingHorizontal: spacing[0] },
  paddingHorizontalSM: { paddingHorizontal: spacing[1] },
  paddingHorizontalMD: { paddingHorizontal: spacing[2] },
  paddingHorizontalLG: { paddingHorizontal: spacing[3] },
  paddingHorizontalXL: { paddingHorizontal: spacing[4] },
  paddingHorizontalXXL: { paddingHorizontal: spacing[5] },
  paddingHorizontalXXXL: { paddingHorizontal: spacing[6] },

  paddingVerticalXS: { paddingVertical: spacing[0] },
  paddingVerticalSM: { paddingVertical: spacing[1] },
  paddingVerticalMD: { paddingVertical: spacing[2] },
  paddingVerticalLG: { paddingVertical: spacing[3] },
  paddingVerticalXL: { paddingVertical: spacing[4] },
  paddingVerticalXXL: { paddingVertical: spacing[5] },
  paddingVerticalXXXL: { paddingVertical: spacing[6] },

  // ==================== COMMON PATTERNS ====================
  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // List items
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },

  // Input containers
  inputContainer: {
    marginBottom: spacing[4],
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing[1],
  },

  // Badge/Tag styles
  badge: {
    backgroundColor: colors.primaryBlack,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0],
    borderRadius: radius.sm,
  },
  badgeText: {
    color: colors.primaryWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  tag: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textPrimary,
  },

  // Empty states
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[3],
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ==================== UTILITY ====================
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hidden: {
    display: 'none',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
});

/**
 * Helper function to combine multiple styles
 * Usage: style={[globalStyles.container, globalStyles.paddedContainer, customStyle]}
 */
export const combineStyles = (...styles) => {
  return styles.filter(Boolean);
};

/**
 * Spacing helper function
 * Usage: marginTop={getSpacing(3)} // returns 16
 */
export const getSpacing = (index) => {
  return spacing[index] || spacing[2];
};

/**
 * Radius helper function
 * Usage: borderRadius={getRadius('md')} // returns 12
 */
export const getRadius = (size) => {
  return radius[size] || radius.md;
};

export default globalStyles;

