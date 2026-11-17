# Build and Package CapturePlayer

## Prerequisites

- Node.js and npm
- The platform-specific tools required by Electron Builder for the target OS

Install the exact dependencies recorded in the npm lockfile:

```bash
npm ci
```

## Run in Development

```bash
npm run dev
```

## Build the Application

Create the production Vite and Electron bundles:

```bash
npm run build
```

The application bundles are written to `dist-vite/` and `dist-electron/`.

## Create Distributable Packages

Build the bundles and package CapturePlayer for the current platform:

```bash
npm run dist
```

Electron Builder writes distributables to `dist/`. The targets configured in
`package.json` are:

- **Windows x64:** NSIS installer and portable executable
- **Linux x64:** AppImage
- **macOS Apple Silicon (arm64):** DMG

For reliable results, package on the operating system you are targeting.
The macOS build is not code-signed or notarized by the current configuration.
`npm run dist` creates local packages; it does not publish a release.

## Update Dependencies

Check which dependencies have newer versions available:

```bash
npm outdated
```

Update packages within the version ranges in `package.json`:

```bash
npm update
```

To upgrade a specific package and update the manifest and lockfile, install the
desired version. Use `--save-dev` for development/build tools:

```bash
npm install <package>@<version>
npm install --save-dev <package>@<version>
```

After dependency updates, validate the project and create a fresh package:

```bash
npm run lint
npm run build
npm run dist
```

Commit `package.json` and `package-lock.json` together when an update changes
the dependency manifest or lockfile. Use `npm ci` to reproduce the locked
dependency set.
