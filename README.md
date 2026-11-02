# PlantSense AI

A JavaScript-only MERN application: Vite + React on the client, Express + Mongoose on the server, PlantNet for plant identification, and Google Gemini for structured botanical guidance.

## Requirements
- Node.js 20.19+ or 22+
- MongoDB 6+
- PlantNet API key
- Google Gemini API key

## Setup
1. Copy `server/.env.example` to `server/.env` and fill in credentials.
2. Copy `client/.env.example` to `client/.env`.
3. From the project root run `npm install`.
4. Run `npm install` in `server` and `client` (or use the root install then install each workspace directory).
5. Start MongoDB.
6. In one terminal run `npm run dev:server` from the root.
7. In another terminal run `npm run dev:client` from the root.
8. Open http://localhost:5173.

## Useful commands
- Server: `cd server && npm run dev`
- Client: `cd client && npm run dev`
- Server tests: `cd server && npm test`
- Production server: `cd server && npm start`
- Production client build: `cd client && npm run build`

## API
- `GET /api/health`
- `POST /api/plants/identify` multipart field `image`, optional `sessionId`
- `GET /api/plants/history?sessionId=...`

## Notes before public deployment
This is a complete development implementation, not a security audit or a guarantee of production readiness. Configure a private object-storage provider for images instead of keeping Base64 data in MongoDB; add authentication and ownership checks before storing personal scan histories; use Redis-backed rate limits for multiple server instances; configure backups, monitoring, request logging and a retention policy. Verify provider quotas and terms. Toxicity guidance is informational and must not replace veterinary or medical advice.

Images are held in memory during processing and stored as data URLs for this local starter so the returned scans remain viewable. For production, move images to private object storage and persist only the private object key/URL.
