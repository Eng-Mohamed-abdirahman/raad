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

### Development databases

Copy `backend/.env.example` to `backend/.env` and fill in:

- `MONGODB_URI`: a local MongoDB (install MongoDB Community Server; it runs as a Windows service), database `raad-dev`.
- `REDIS_URL`: optional for now. Leave it unset and the API runs without Redis.
- `JWT_SECRET`: required; signs admin sign-in tokens. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Changing it signs every admin out.

Then check that the databases are reachable:

```bash
npm run db:check -w backend
```

The API refuses to start if MongoDB, or Redis when `REDIS_URL` is set, is unreachable.

### Admin accounts

Create the first dashboard admin (the password is typed at a hidden prompt):

```bash
npm run admin:create -w backend -- --name "Full Name" --email you@example.com
npm run admin:create -w backend -- --email you@example.com --reset-password
```

### API

| Resource | Endpoints                                                                                   |
| -------- | ------------------------------------------------------------------------------------------- |
| Auth     | `POST /api/auth/login`, `GET /api/auth/me`                                                  |
| Drivers  | `GET /api/drivers`, `GET/PATCH/DELETE /api/drivers/:id`, `POST /api/drivers`                |
| Routes   | `GET /api/routes`, `GET/PATCH/DELETE /api/routes/:id`, `POST /api/routes` (ordered `stops`) |
| Buses    | `GET /api/buses`, `GET/PATCH/DELETE /api/buses/:id`, `POST /api/buses`                      |

`POST /api/auth/login` with `{ "email", "password" }` returns `{ token, expiresAt, admin }`. Send the token as `Authorization: Bearer <token>` to every other endpoint; it lasts 8 hours. Ten failed sign-ins from one IP in 15 minutes return 429. Disabling an admin (`active: false`) locks them out at once.

Request bodies are validated with the zod schemas in `@raad/shared` (`LoginInput`, `DriverInput`, `RouteInput`, `BusInput` and their `*Update` partials). A bus can have one driver and one route (`null` unassigns), and a driver can drive only one bus. A driver or route still assigned to a bus cannot be deleted. Errors always look like `{ "error": { "code", "message", "details"? } }`.

Backend tests run against an in-memory MongoDB (`mongodb-memory-server`), so they don't touch your local database.

Design tokens: `shared/design/tokens.json` and `shared/design/icons.json` are the single source for colours, type, spacing, radius, shadows, statuses and icons (copied from the Figma design system). After changing them, run `npm run tokens` to regenerate the admin's CSS and icon files and the Flutter theme in `app/raad_core/lib/theme/generated/`. The admin shows everything at `/design-system` (not linked, not indexed); each Flutter app has the same screen behind a debug-only button in its app bar.

TypeScript: `tsc` is TypeScript 7 (installed as `@typescript/native`). The `typescript` package is aliased to `@typescript/typescript6`, because typescript-eslint and Next.js still need the TypeScript 6 API.

Flutter apps:

```bash
cd app/driver_app && flutter run
cd app/parent_app && flutter run
```

Application IDs are `com.example.raad_driver` and `com.example.raad_parent` for now. Set the real reverse-domain prefix before the first Play Store upload: Play rejects `com.example`, and the ID can never change after the first upload.

## Conventions

- Branches describe the work only, with no task ID: `feat/save-bus-location`.
- Commit and PR titles describe the change, with no task ID: `feat(api): save latest bus position`.
- `main` only accepts pull requests with green CI.
