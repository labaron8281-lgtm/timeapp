# Work Timer backend 3.3.0

See ../README.md for deployment, account environment settings, and APK build instructions.

Start: npm install && npm start
Test: npm test

## Production server

https://worker-timer-monitor-8gsa.onrender.com/

Deploy this project to the existing Render service at the URL above. Admin and worker clients intentionally use same-origin API and Socket.IO connections, so authentication and realtime connections work on the deployed host. The `APP_BASE_URL` value in render.yaml documents the intended production host; changing it alone does not redeploy or rename an existing Render service.
