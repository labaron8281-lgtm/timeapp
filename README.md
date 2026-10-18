# WorkTimer — Render server and web apps

Production URL: https://worker-timer-monitor-8gsa.onrender.com/

## Run

`npm install` then `npm start` (Node.js 18+).

## Test

`npm test` and `npm run check`.

## Pages

- `/` — homepage/sign in
- `/admin.html` — admin dashboard
- `/worker.html` — worker dashboard with its own sign-in
- `/health` — health check

Admin and worker pages use same-origin APIs and Socket.IO. Workers do not need Android device registration, but must authenticate with a worker account. Browser camera and microphone access require permission.

## Deployment

Deploy to the existing Render service associated with the production URL. `render.yaml` describes service configuration; it does not rename or automatically deploy an existing service. Set strong `ADMIN_PASSWORD`, `WORKER1_PASSWORD`, `WORKER2_PASSWORD`, `WORKER3_PASSWORD`, and `SESSION_SECRET` in Render environment variables. Keep the persistent `data/` disk mounted to preserve worker and task data. Do not overwrite production `data/` with example files during redeployment.

## Cleanup

Removed duplicate server copies (`WORKER_TIMER_SERVER_APT_PASSWORD.js` and `public/server.js`), unused `render-auth-route.js`, and an unreferenced reset script. Kept tests, app assets, and existing sample data for compatibility.

## Task / earnings workflow (updated)
Admin creates open or directly assigned tasks. Workers accept/decline, submit notes, and admins approve with an amount or request revisions. The backend enforces ownership and one approval credit per task. Admin may separately mark a ledger record paid using POST `/api/admin/earnings/:id/paid` (the Admin UI does not yet expose a dedicated payment button). The worker web UI displays totals and payment status. Chat socket messages are now persisted.

**Deployment requirement:** Keep Render persistent disk mounted at `/opt/render/project/src/data`; without durable storage JSON files may be lost on redeploy. This implementation uses synchronous local JSON files, not a transactional database. Atomic acceptance is limited to a *single Node.js server process* and is not guaranteed across multiple Render instances. Android client integration is not included in this ZIP and has not been tested.
