# Video Call Deployment Guide

Video calls now use **PeerJS** for signaling (free public servers). No WebSocket server needed!

## How It Works

| Component | Where | Cost |
|-----------|-------|------|
| **Signaling** | PeerJS free server (0.peerjs.com) | Free |
| **REST API** | Vercel (room coordination) | Free |
| **Video/Audio** | WebRTC (browser) | Free |

**Everything works on Vercel** - no need for Railway or Render.

## What Changed

- **Before**: Custom WebSocket signaling (required Railway/Render)
- **After**: PeerJS handles signaling via free public servers
- Backend only needs REST API for room join coordination (who calls whom)

## Local Development

Run the backend locally (`node app.js` or `npm start`). The frontend uses the API URL from `.env` or falls back to Vercel.
