# Reward Game Dashboard

A responsive web application with a dashboard-style UI inspired by mobile reward-based games.

## Features

- 🎮 **Game Page**: Multiple mining modes (Puzzle, Spin, Sticker Packs, Video, Mini-Game)
- 🎁 **Airdrop Page**: View balance in TON, CATI, USDT and claim daily rewards
- 💰 **Referral Page**: Track referrals and earn 10% commission
- 👤 **Benefit Page**: User profile with VIP levels, EXP, and reward packs

## Tech Stack

- React 18
- React Router DOM
- Webpack 5
- Babel
- CSS3 (No external UI libraries)

## Installation

```bash
cd reward-game-dashboard
npm install
```

## Running the App

```bash
npm start
```

The app will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Project Structure

```
reward-game-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.js
│   │   └── Layout.css
│   ├── pages/
│   │   ├── GamePage.js
│   │   ├── GamePage.css
│   │   ├── AirdropPage.js
│   │   ├── AirdropPage.css
│   │   ├── ReferralPage.js
│   │   ├── ReferralPage.css
│   │   ├── BenefitPage.js
│   │   └── BenefitPage.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── webpack.config.js
└── .babelrc
```

## Features to Add (Future)

- User authentication
- Backend API integration
- Real blockchain rewards (TON, USDT, CATI)
- Database for user data
- Real-time referral tracking
- Push notifications
- More mini-games

## Design

- Soft pastel colors (light yellow, orange, cream)
- Rounded buttons and UI elements
- Cartoon-style avatars
- Mobile-first responsive design
- Bottom navigation bar
"# ward" 
