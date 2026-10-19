import { app } from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`
  ==============================================================
   ⛩️  KaamSetu // कामसूत्र CAREER & INTERNSHIP PLATFORM
   🌐 Server listening on: http://localhost:${PORT}
   🛡️ Environment: ${config.nodeEnv}
   📚 Database: SQLite (${config.databasePath})
   📜 API Health: http://localhost:${PORT}/api/v1/health
  ==============================================================
  `);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[System] SIGTERM signal received. Closing HTTP server gracefully.');
  server.close(() => {
    console.log('[System] HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[System] SIGINT signal received. Closing HTTP server gracefully.');
  server.close(() => {
    console.log('[System] HTTP server closed.');
    process.exit(0);
  });
});
