# 🎨 CommitCanvas — Interactive Git Workflow Visualizer

> **An Interactive Digital Electronics & Version Control Visual Lab Simulator for Mastering Git Workflows in Real-Time.**  
> *Developed as an Academic / Portfolio Computer Science Project.*

---

## 📌 Project Overview

**CommitCanvas** is a web-based, interactive version control visualizer built to bridge the gap between abstract Command Line Interface (CLI) Git commands and GUI spatial clarity. Traditional version control concepts like staging areas, commit object nodes, and remote pushing often present a steep learning curve for beginner developers. 

CommitCanvas solves this problem by rendering real-time animated graph nodes, interactive terminal simulations, dynamic neon visualizers, and step-by-step guidance in a glassmorphic dashboard interface.

---

## ✨ Key Features

- **🚀 Interactive Live Git Visualizer**:
  - Dynamically renders commit hash nodes connected by glowing pipeline links in real-time as commands are executed.
  - Live node state changes (e.g., node glow color shifts from Cyan to Neon Green upon executing `git push`).

- **💻 Interactive Simulated Terminal CLI**:
  - Full client-side terminal engine processing real-world Git CLI syntax (`git init`, `git add .`, `git commit -m "msg"`, `git push`).
  - Provides realistic bash terminal console output and error handling for invalid or out-of-sequence commands.

- **🌌 Glassmorphism Aesthetics & Particle FX**:
  - **Shattered Cubes Canvas**: Interactive 100 3D neon floating cube explosion with auto-fade dissolving animations.
  - **Sticky Shrinking Navbar**: Smooth scroll-triggered header navigation that dynamically compacts length and height when scrolling.
  - **Animated Ambient Background**: Morphing CSS gradient blobs providing a rich dark-mode aesthetic.

- **📊 4-Tab Interactive Learning Sidebar**:
  - **Dashboard**: Live state and workflow indicator (`Repository Status`, `Staging Area`, `HEAD Node`).
  - **Learn / Command Insights**: Detailed technical breakdown of executed commands.
  - **Command**: One-click recommended step launcher for instant command insertion.
  - **About**: Architectural project documentation.

---

## 🛠️ Technology Stack

Strictly constructed using lightweight, native web standards for maximum execution speed and zero unnecessary dependency overhead:

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 19 (Hooks: `useState`, `useEffect`), Vanilla JavaScript (ES6+) |
| **Build Tooling** | Vite 8, Rollup |
| **Styling & FX** | Vanilla CSS3 (CSS Variables, `@keyframes`, Glassmorphism, CSS Gradients) |
| **Markup & SEO** | HTML5 Semantic Architecture |
| **Version Control** | Git & GitHub |

---

## 📁 Repository Structure

```
CommitCanvas/
├── public/
│   ├── favicon1.svg
│   ├── favicon2.png
│   └── icons.svg
├── src/
│   ├── assets/               # Branding graphics & vector assets
│   ├── components/
│   │   ├── Play/             # Git Commit Nodes Visualizer & Terminal Output
│   │   │   ├── Play.jsx
│   │   │   └── Play.css
│   │   └── Playground/       # Interactive Shattered Cubes Canvas & Scroll Prompt
│   │       ├── Playground.jsx
│   │       └── Playground.css
│   ├── utils/
│   │   └── gitLogic.js       # Core Git CLI simulation state machine & command parser
│   ├── App.jsx               # Main application container, scroll states & routing
│   ├── App.css
│   ├── index.css
│   └── main.jsx              # Application DOM entry point
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚙️ Supported Git Commands & Simulation Workflow

| Command | Action | Visual Output |
| :--- | :--- | :--- |
| `git init` | Initializes empty repository | Enables workspace visualizer, creates `.git/` metadata state |
| `git add .` | Stages workspace changes | Updates Staging Area status in live sidebar dashboard |
| `git commit -m "msg"` | Captures staged snapshot | Spawns a new cyan glowing commit node `#hash` with message |
| `git push` | Uploads commits to `origin/main` | Updates commit nodes glow to green and syncs state |

---

## 🚀 Getting Started

Follow these steps to run CommitCanvas locally on your machine:

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation & Execution

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sharvi006/CommitCanvas.git
   cd CommitCanvas
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   Preview production build:
   ```bash
   npm run preview
   ```

---

## 🎓 Academic / Project Context

This project was developed to demonstrate:
1. Pure Frontend state management without external heavy UI abstractions.
2. Advanced CSS3 keyframe animations, glassmorphic rendering, and fluid responsive design principles.
3. Educational software design patterns applied to version control concepts.

---

## 📄 License & Attribution

This project is created for educational purposes. Feel free to fork, experiment, and learn!
