import express from 'express';
import { createServer, getServerPort } from '@devvit/web/server';
import { Logger } from './util/Logger';
import { LogLevel } from './util/AppSettings';
import { registerInternalRoutes } from './devvit';
import { registerDashboardRoutes } from './dashboard';
import { registerSurveyRoutes } from './survey';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

// Register dashboard routes
registerDashboardRoutes(router);

// Register survey routes
registerSurveyRoutes(router);

// Register all internal devvit routes (menus, triggers, tasks, etc.)
registerInternalRoutes(router);

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) =>
  new Logger('Router', LogLevel.Error).error('Unhandled Error: ', err)
);
server.listen(port);
