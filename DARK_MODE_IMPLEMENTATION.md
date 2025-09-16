# Dark Mode Implementation for Admin Dashboard

## Overview
This implementation adds a comprehensive dark mode feature to the admin dashboard that allows users to toggle between light and dark themes globally across all admin pages.

## Features
- **Global Theme Management**: Theme state is managed globally using React Context
- **Persistent Storage**: Theme preference is saved to localStorage and persists across sessions
- **Automatic Theme Application**: All admin dashboard components automatically adapt to the selected theme
- **Settings Integration**: Theme can be changed from the Settings page under Appearance section

## Implementation Details

### 1. Theme Context (`src/contexts/ThemeContext.jsx`)
- Provides global theme state management
- Includes theme-aware CSS class helpers
- Handles localStorage persistence
- Supports light, dark, and auto themes

### 2. Updated Components
- **Main Dashboard** (`src/pages/admin/Dashboard/home/index.jsx`): Updated to use theme classes
- **Sidebar** (`src/components/DashBoardcomponents/slideBar/index.jsx`): Theme-aware navigation
- **Settings Page** (`src/pages/admin/Dashboard/settings/index.jsx`): Theme selection interface
- **All Admin Components**: Updated to use theme classes for consistent styling

### 3. Theme Classes
The theme context provides pre-defined classes for common UI elements:
- `bg`: Main background color
- `bgSecondary`: Secondary background color
- `bgCard`: Card background color
- `text`: Primary text color
- `textSecondary`: Secondary text color
- `textMuted`: Muted text color
- `border`: Border color
- `input`: Input field styling
- `buttonPrimary`, `buttonSecondary`, `buttonGhost`: Button variants

## Usage

### For Developers
1. Import the theme context in any admin component:
```jsx
import { useTheme } from '../../../../contexts/ThemeContext';

const MyComponent = () => {
  const { themeClasses, theme, setThemeMode } = useTheme();
  
  return (
    <div className={`${themeClasses.bg} ${themeClasses.text}`}>
      {/* Component content */}
    </div>
  );
};
```

2. Use theme classes instead of hardcoded colors:
```jsx
// Instead of: className="bg-white text-gray-900"
// Use: className={`${themeClasses.bg} ${themeClasses.text}`}
```

### For Users
1. Navigate to the admin dashboard
2. Go to Settings → Appearance
3. Select your preferred theme (Light/Dark/Auto)
4. The theme will be applied immediately and saved for future sessions

## Theme Provider Setup
The ThemeProvider is wrapped around admin routes in `src/Routers/UserRouter.jsx`:
```jsx
<Route path="/admin/dashboard" element={
  <ThemeProvider>
    <DashbaordHome/>
  </ThemeProvider>
} />
```

## CSS Classes Reference
- **Light Theme**: Uses standard Tailwind classes (bg-white, text-gray-900, etc.)
- **Dark Theme**: Uses dark variants (bg-gray-900, text-white, etc.)
- **Auto Theme**: Follows system preference (future enhancement)

## Future Enhancements
- System theme detection for "Auto" mode
- More theme customization options
- Theme-specific color schemes
- Animation transitions between themes
