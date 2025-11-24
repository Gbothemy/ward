# 🖥️ Desktop Website Features

## Layout Structure

### Desktop View (> 768px)
- **Sticky Header**: Full-width header with logo, user info, and points display
- **Sidebar Navigation**: Fixed left sidebar (280px) with all navigation links
- **Main Content Area**: Flexible content area with max-width 1400px
- **Footer**: Professional footer with links and copyright

### Mobile View (≤ 768px)
- **Compact Header**: Mobile-optimized header with hamburger menu
- **Bottom Navigation**: Fixed bottom tab bar for main sections
- **Slide-out Menu**: Mobile menu overlay for additional options

## Responsive Breakpoints

### Mobile
- `max-width: 768px`
- 2-column grid for cards
- Bottom navigation visible
- Sidebar hidden

### Tablet
- `min-width: 769px`
- 3-column grid for mining cards
- Sidebar navigation visible
- Bottom navigation hidden

### Desktop
- `min-width: 1200px`
- 4-column grid for mining cards
- Full sidebar with all features
- Optimized spacing and layout

## Navigation System

### Desktop Sidebar
- **Primary Links**: Game, Airdrop, Referral, Benefit
- **Secondary Links**: Puzzle Mining, Video Mining, Mini-Games, Spin Mining
- **Settings**: Bottom of sidebar
- **Active State**: Left border indicator + background highlight
- **Hover Effects**: Smooth color transitions

### Mobile Bottom Nav
- 4 main tabs with icons
- Active state with top border
- Icon scale animation on active

## Page Layouts

### Game Page
- **Stats Grid**: 4 stat cards (Points, Tasks, Streak, VIP)
- **Mining Grid**: Responsive grid (2/3/4 columns)
- Desktop: 4 columns, Tablet: 3 columns, Mobile: 2 columns

### Airdrop Page
- **2-column layout** on desktop
- Balance section spans full width
- Claim section and rewards side-by-side

### Referral Page
- **2-column grid** for referral cards on desktop
- Single column on mobile

### Benefit Page
- **Sidebar layout**: Profile card on left (350px)
- Reward packs on right in flexible grid
- Stacked layout on mobile

## Design Elements

### Header
- Gradient background with rotating animation
- User info with points display (desktop only)
- Sticky positioning for easy access

### Sidebar
- White background with subtle border
- Sticky positioning (follows scroll)
- Smooth hover and active states
- Dividers between sections

### Cards
- Consistent 20-24px border radius
- Hover lift effect (translateY -3px to -5px)
- Shadow enhancement on hover
- Border color transitions

### Footer
- Links to Privacy, Terms, Support
- Copyright information
- Responsive layout (row/column)

## Animations

### Smooth Scrolling
- Enabled globally for anchor links
- Custom scrollbar styling

### Page Transitions
- Fade-in animation on content load
- 0.5s ease timing

### Interactive Elements
- Hover: Scale, lift, shadow enhancement
- Active: Border indicators, background colors
- Float: Icons and avatars (3s loop)
- Pulse: Important elements (2s loop)

## Color Scheme

### Primary
- Purple: `#667eea`
- Deep Purple: `#764ba2`
- Pink: `#f093fb`

### Backgrounds
- White: `#ffffff`
- Light: `#f8f9ff`
- Gradient overlays with transparency

### Text
- Headings: `#333`
- Body: `#666`
- Muted: `#999`

## Typography

### Headings
- Page Title: 32px, weight 800
- Section Title: 20px, weight 700
- Card Title: 15-18px, weight 600

### Body
- Regular: 14-16px, weight 400-500
- Small: 12-13px, weight 500

## Accessibility

- High contrast text
- Touch-friendly sizes (min 44px)
- Keyboard navigation support
- Smooth focus indicators
- Readable font sizes

## Performance

- Hot module reloading enabled
- Optimized CSS with media queries
- Minimal JavaScript overhead
- Efficient animations (GPU-accelerated)
