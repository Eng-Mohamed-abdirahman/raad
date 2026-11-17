# Raad 🚌

**Always know where the bus is.** School bus GPS tracking for parents, drivers and school admins.
"Raad" is Somali for *trace / track*.

| Role | App | What they do |
| --- | --- | --- |
| Driver | Flutter driver app | Starts and ends trips; the phone sends GPS every 10–15 s during an active trip |
| Parent | Flutter parent app | Sees the bus live on a map, the ETA to their stop, and push alerts |
| School admin | Next.js dashboard | Manages buses, drivers, routes, stops, students and parents; watches all buses live |

## Folder structure

```
raad/
├── apps/
│   ├── api/          Node.js + Express + Socket.IO (TypeScript)
│   ├── admin/        Next.js admin dashboard
│   ├── driver_app/   Flutter driver app
│   └── parent_app/   Flutter parent app
├── packages/
│   ├── shared/       @raad/shared — zod schemas + socket event types
│   └── raad_core/    Shared Flutter package
├── turbo.json        Turborepo task pipeline
└── package.json      npm workspaces (api, admin, shared)
```

## Requirements

Git, Node.js 24+ (npm included), Flutter stable + Android SDK, GitHub CLI, Firebase CLI, FlutterFire CLI. No Docker.

## Running

Always install from the repo root (never inside a workspace folder):

```bash
npm install
npm run dev        # API + admin side by side
npm run build
npm run lint
npm run typecheck
npm test
```

Add a dependency to one workspace: `npm install zod -w apps/api`.

Flutter apps:

```bash
cd apps/driver_app && flutter run
cd apps/parent_app && flutter run
```

## Conventions

- Branches are named after the task: `p1-03-save-location`.
- Commit and PR titles end with the task ID: `feat(api): save latest bus position [P1-03]`.
- `main` only accepts pull requests with green CI.
