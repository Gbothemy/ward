# 🎨 Design System

## Color Palette

### Primary Colors
- **Purple Gradient**: `#667eea` → `#764ba2`
- **Pink Accent**: `#f093fb` → `#f5576c`
- **Success Green**: `#66BB6A` → `#4CAF50`

### Background
- **Body**: Purple gradient (`#667eea` → `#764ba2` → `#f093fb`)
- **Container**: White to light blue gradient
- **Cards**: Pure white with subtle shadows

## Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Headings**: 700 weight, uppercase with letter-spacing
- **Body**: 400-600 weight

## Components

### Cards
- Border radius: 18-24px
- Shadow: `0 4px 20px rgba(0,0,0,0.08)`
- Hover effect: Lift with increased shadow
- Border: 2px transparent, colored on hover

### Buttons
- Border radius: 25-30px
- Gradient backgrounds
- Box shadow: `0 4px 15px rgba(102, 126, 234, 0.3)`
- Hover: Scale 1.05-1.08 + translateY(-2px)
- Text: Uppercase, bold, letter-spacing

### Icons
- Size: 32-48px
- Float animation (3s ease-in-out)
- Circular backgrounds with gradients

### Progress Bars
- Height: 8-12px
- Border radius: 10px
- Gradient fill with shimmer animation
- Box shadow on fill

## Animations

### Float
```css
0%, 100% { translateY(0px) }
50% { translateY(-8px to -10px) }
```

### Pulse
```css
0%, 100% { scale(1) }
50% { scale(1.05) }
```

### Shimmer
```css
Background position animation for gradient effect
```

### Rotate
```css
360deg rotation for background effects
```

## Layout

### Mobile-First
- Max width: 480px
- Centered container
- Fixed bottom navigation
- Responsive padding: 20px

### Navigation
- Bottom: 4 tabs with icons
- Active state: Purple color + scale effect
- Top bar indicator on active tab

### Spacing
- Card margins: 15-25px
- Padding: 18-30px
- Gap between elements: 12-15px

## Special Effects

### Glassmorphism
- `backdrop-filter: blur(10px)`
- Semi-transparent backgrounds

### Gradient Overlays
- Radial gradients for depth
- Rotating background animations

### Hover States
- Transform: translateY(-3px to -5px)
- Scale: 1.03-1.08
- Enhanced shadows
- Border color transitions

## Accessibility
- High contrast text
- Clear focus states
- Readable font sizes (14-24px)
- Touch-friendly button sizes (min 44px)
