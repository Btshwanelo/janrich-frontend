# Theme System Setup

This application is configured with a comprehensive theme system that allows for easy theme customization and switching.

## Features

- ✅ **Tailwind CSS v4** with custom theme configuration
- ✅ **Inter Font Family** integrated throughout the application
- ✅ **Theme System** with light/dark mode support
- ✅ **Untitled UI Components** structure ready for implementation
- ✅ **Easy Theme Switching** with persistence

## Theme Configuration

### Color System

The theme uses CSS custom properties for all colors, making it easy to customize:

- **Primary Colors**: Blue-based color palette (50-950 shades)
- **Secondary Colors**: Slate-based color palette (50-950 shades)
- **Gray Colors**: Neutral gray palette (50-950 shades)
- **Semantic Colors**: Background, foreground, border, input, ring, muted, accent, destructive, success, warning

### How to Change Themes

1. **Modify existing themes**: Edit the color values in `src/lib/theme.ts`
2. **Add new themes**: Add new theme objects to the `themes` object
3. **Update CSS variables**: Modify the CSS custom properties in `src/app/globals.css`

### Example: Adding a Custom Theme

```typescript
// In src/lib/theme.ts
export const themes = {
  // ... existing themes
  custom: {
    "--color-primary-500": "#155EEF",
    "--color-background": "#your-bg",
    // ... other color definitions
  },
};
```

### Using the Theme System

```tsx
import { useTheme } from "@/components/theme-provider";

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return <button onClick={toggleTheme}>Current theme: {theme}</button>;
}
```

## Component Structure

The application includes a basic UI component structure:

- `src/components/ui/button.tsx` - Button component with variants
- `src/components/theme-provider.tsx` - Theme context provider
- `src/components/theme-toggle.tsx` - Theme toggle component

## Tailwind Classes

Use the theme colors with Tailwind classes:

```tsx
<div className="bg-primary-500 text-white">
  Primary background
</div>

<div className="bg-background text-foreground">
  Theme-aware background and text
</div>

<div className="border border-border">
  Theme-aware border
</div>
```

## Running the Application

```bash
npm run dev
```

The application will start with the theme system active and you can toggle between light and dark modes using the theme toggle button.

## Next Steps

1. Add more Untitled UI components to `src/components/ui/`
2. Customize the color palette in `src/lib/theme.ts`
3. Add more theme variants as needed
4. Implement component variants that respond to theme changes
