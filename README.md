# PSUD STUDIO

**BUILD GAMES WITHOUT LIMITS.**

A complete game development environment powered by the PSUD Engine and Scrollforge IDE.

## Features

- ✅ Complete game development suite
- ✅ Integrated AI assistant
- ✅ Powerful scene editor
- ✅ Flexible plugin system
- ✅ Built-in asset pipeline
- ✅ Cross-platform builds
- ✅ Professional installer
- ✅ Active community support

## Project Structure

```
PSUD-Studio/
├── desktop/                 # Electron main process + React app
│   ├── electron/            # Electron main process
│   ├── src/                 # React + TypeScript app
│   ├── public/              # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── electron-builder.yml
├── packages/
│   ├── engine/              # PSUD Engine core
│   ├── editor/              # Scrollforge IDE
│   ├── scene/               # Scene editor
│   ├── assets/              # Asset management
│   ├── plugins/             # Plugin system
│   ├── ai/                  # AI assistant
│   ├── ui/                  # Shared UI components
│   └── utils/               # Common utilities
├── installer/
│   ├── windows/             # Windows installer (NSIS)
│   ├── icons/               # App icons
│   └── scripts/             # Build scripts
├── docs/
│   ├── guides/              # User guides
│   ├── api/                 # API reference
│   ├── tutorials/           # Tutorials
│   └── assets/              # Documentation assets
├── examples/
│   ├── 2d-platformer/       # 2D platformer template
│   ├── 3d-adventure/        # 3D adventure template
│   ├── top-down/            # Top-down template
│   └── fps/                 # FPS template
├── templates/
│   ├── blank-project/       # Empty project template
│   ├── 2d-template/         # 2D template
│   └── 3d-template/         # 3D template
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

## Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Package the application
npm run package
```

## Platforms

- Windows
- macOS
- Linux
- Web

## License

MIT © PSUD Studio Team
