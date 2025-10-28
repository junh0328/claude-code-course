# UI Coding Standards

This document outlines the UI coding standards and guidelines for this project.

## Component Library

### shadcn/ui Components

**CRITICAL RULE**: This project uses **ONLY** shadcn/ui components for all user interface elements.

- ✅ **DO**: Use shadcn/ui components exclusively
- ❌ **DO NOT**: Create custom UI components
- ❌ **DO NOT**: Use other component libraries (Material-UI, Chakra, etc.)
- ❌ **DO NOT**: Build UI components from scratch

### Adding shadcn/ui Components

To add a new shadcn/ui component to the project:

```bash
npx shadcn@latest add [component-name]
```

Examples:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
```

### Available Components

shadcn/ui provides a comprehensive set of components including:
- Accordion
- Alert
- Avatar
- Badge
- Button
- Calendar
- Card
- Checkbox
- Command
- Dialog
- Dropdown Menu
- Form
- Input
- Label
- Popover
- Select
- Sheet
- Table
- Tabs
- Toast
- Tooltip
- And many more...

Refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components) for the complete list.

## Date Formatting

### date-fns Library

All date formatting in this project **MUST** be done using the `date-fns` library.

### Standard Date Format

Dates should be formatted using the following pattern:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

**Format specification**: `ordinal day` + `abbreviated month (3 letters)` + `full year`

### Implementation

```typescript
import { format } from 'date-fns';

// Helper function to get ordinal suffix
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// Format date according to project standards
function formatProjectDate(date: Date): string {
  const day = format(date, 'd');
  const month = format(date, 'MMM');
  const year = format(date, 'yyyy');
  const ordinal = getOrdinalSuffix(Number(day));

  return `${day}${ordinal} ${month} ${year}`;
}

// Example usage
const date = new Date('2025-09-01');
console.log(formatProjectDate(date)); // Output: "1st Sep 2025"
```

### Installation

If not already installed, add date-fns to the project:

```bash
npm install date-fns
```

## Summary

1. **Components**: Use shadcn/ui exclusively, no custom components
2. **Dates**: Format using date-fns in the pattern: `1st Sep 2025`
3. **Consistency**: Follow these standards throughout the entire codebase
