# Global Styles Guide

This guide explains how to use the global styles system throughout the app.

## Import

```javascript
import globalStyles from '../theme/globalStyles';
// or
import { globalStyles } from '../theme';
```

## Usage Examples

### Basic Container

```javascript
<SafeAreaView style={globalStyles.safeArea}>
  <View style={[globalStyles.content, globalStyles.paddedContainerXXXL]}>
    {/* Your content */}
  </View>
</SafeAreaView>
```

### Text Styles

```javascript
// Headings
<Text style={globalStyles.h1}>Main Title</Text>
<Text style={globalStyles.h2}>Section Title</Text>
<Text style={globalStyles.h3}>Subsection</Text>

// Body text
<Text style={globalStyles.body}>Regular text</Text>
<Text style={globalStyles.bodySmall}>Small text</Text>

// Secondary text
<Text style={globalStyles.textSecondary}>Secondary information</Text>
<Text style={globalStyles.caption}>Caption text</Text>
```

### Layout Helpers

```javascript
// Rows
<View style={globalStyles.row}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>

<View style={globalStyles.rowBetween}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>

// Columns
<View style={globalStyles.column}>
  <Text>Top</Text>
  <Text>Bottom</Text>
</View>
```

### Spacing

```javascript
// Margin
<View style={globalStyles.marginTopLG}>
  <Text>Content with top margin</Text>
</View>

// Padding
<View style={[globalStyles.paddingHorizontalXXXL, globalStyles.paddingVerticalLG]}>
  <Text>Padded content</Text>
</View>
```

### Cards

```javascript
// Basic card
<View style={globalStyles.card}>
  <Text>Card content</Text>
</View>

// Elevated card (with shadow)
<View style={globalStyles.cardElevated}>
  <Text>Elevated card</Text>
</View>

// Black card
<View style={globalStyles.cardBlack}>
  <Text style={{ color: '#FFFFFF' }}>Black card</Text>
</View>
```

### Dividers

```javascript
<View style={globalStyles.divider} />
<View style={globalStyles.dividerThick} />
```

### Combining Styles

```javascript
// Combine multiple styles
<View style={[
  globalStyles.container,
  globalStyles.paddedContainerXXXL,
  globalStyles.justifyCenter
]}>
  <Text style={[globalStyles.h1, globalStyles.textCenter]}>
    Centered Title
  </Text>
</View>
```

### Common Patterns

```javascript
// Section header
<View style={globalStyles.sectionHeader}>
  <Text style={globalStyles.sectionTitle}>Section</Text>
  <Button title="Action" />
</View>

// List item
<View style={[globalStyles.listItem, globalStyles.listItemLast]}>
  <Text>List item content</Text>
</View>

// Empty state
<View style={globalStyles.emptyState}>
  <Text style={globalStyles.emptyStateText}>No items found</Text>
</View>
```

### Helper Functions

```javascript
import { getSpacing, getRadius, combineStyles } from '../theme/globalStyles';

// Get spacing value
const margin = getSpacing(3); // returns 16

// Get radius value
const borderRadius = getRadius('md'); // returns 12

// Combine styles
const combinedStyle = combineStyles(
  globalStyles.container,
  customStyle,
  condition && globalStyles.hidden
);
```

## Best Practices

1. **Always use global styles first** - Only create custom styles when absolutely necessary
2. **Combine styles** - Use arrays to combine multiple global styles
3. **Use semantic names** - `h1`, `body`, `textSecondary` are more meaningful than `text1`, `text2`
4. **Consistent spacing** - Use spacing helpers (`marginTopLG`, `paddingHorizontalXXXL`) instead of hardcoded values
5. **Theme colors** - Access colors via `useTheme()` hook when you need dynamic colors

## Available Styles

### Containers
- `container`, `safeArea`, `content`, `centeredContent`
- `paddedContainer`, `paddedContainerLarge`

### Text
- `h1`, `h2`, `h3`, `h4`
- `bodyLarge`, `body`, `bodySmall`
- `textSecondary`, `textSecondarySmall`
- `caption`, `captionBold`
- `textCenter`, `textLeft`, `textRight`

### Layout
- `row`, `rowBetween`, `rowCenter`
- `column`, `spaceBetween`, `spaceAround`
- `alignCenter`, `alignStart`, `alignEnd`
- `justifyCenter`, `justifyStart`, `justifyEnd`

### Cards & Surfaces
- `card`, `cardElevated`, `cardBlack`

### Dividers
- `divider`, `dividerVertical`, `dividerThick`

### Spacing (Margin)
- `marginTopXS` through `marginTopXXXL`
- `marginBottomXS` through `marginBottomXXXL`
- `marginLeftXS` through `marginLeftXL`
- `marginRightXS` through `marginRightXL`

### Spacing (Padding)
- `paddingXS` through `paddingXXXL`
- `paddingHorizontalXS` through `paddingHorizontalXXXL`
- `paddingVerticalXS` through `paddingVerticalXXXL`

### Common Patterns
- `sectionHeader`, `sectionTitle`
- `listItem`, `listItemLast`
- `inputContainer`, `inputLabel`
- `badge`, `badgeText`, `tag`, `tagText`
- `emptyState`, `emptyStateText`
- `loadingContainer`

### Utilities
- `fullWidth`, `fullHeight`
- `absoluteFill`, `hidden`, `overflowHidden`

