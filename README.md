# Raad 🚌

**Always know where the bus is.** School bus GPS tracking for parents, drivers and school admins.
"Raad" is Somali for _trace / track_.

| Role         | App                | What they do                                                                        |
| ------------ | ------------------ | ----------------------------------------------------------------------------------- |
| Driver       | Flutter driver app | Starts and ends trips; the phone sends GPS every 10–15 s during an active trip      |
| Parent       | Flutter parent app | Sees the bus live on a map, the ETA to their stop, and push alerts                  |
| School admin | Next.js dashboard  | Manages buses, drivers, routes, stops, students and parents; watches all buses live |

## Folder structure

```
raad/
├── app/              Mobile apps (Flutter)
│   ├── driver_app/   Driver app
│   ├── parent_app/   Parent app
│   └── raad_core/    Shared Flutter package
├── backend/          Node.js + Express + Socket.IO API (TypeScript)
├── frontend/         Next.js admin dashboard
├── shared/           @raad/shared — zod schemas + socket event types
├── turbo.json        Turborepo task pipeline
└── package.json      npm workspaces (backend, frontend, shared)
```

## Requirements

Git, Node.js 24+ (npm included), Flutter stable + Android SDK, GitHub CLI, Firebase CLI, FlutterFire CLI. No Docker.

## Running

Always install from the repo root (never inside a workspace folder):

```bash
npm install
npm run dev        # backend + frontend side by side
npm run build
npm run lint
npm run typecheck
npm test
```

Add a dependency to one workspace: `npm install zod -w backend`.

Flutter apps:

```bash
cd app/driver_app && flutter run
cd app/parent_app && flutter run
```

## Conventions

- Branches describe the work only, with no task ID: `feat/save-bus-location`.
- Commit and PR titles describe the change, with no task ID: `feat(api): save latest bus position`.
- `main` only accepts pull requests with green CI.
