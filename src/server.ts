import http from 'http';
import https from 'https';
import fs from 'fs';
import { getConfig } from './config';
import app from './app';

const config = getConfig();
let server = null;
if (config.ssl) {
  const sslOptions = {
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert),
  };
  server = https.createServer(sslOptions, app);
} else {
  server = http.createServer(app);
}

export default server;

// const useControllers = (app, controllers) => {
//   if (controllers) {
//     controllers.forEach((controller) => {
//       app.
//     })
//   }
// }
// if (config.isSentrySupport) {
//   Sentry.init({
//     integrations: [
//       // enable HTTP calls tracing
//       new Sentry.Integrations.Http({ tracing: true }),
//       // enable Express.js middleware tracing
//       new Tracing.Integrations.Express({ app }),
//     ],
//     tracesSampleRate: 1.0,
//   });
//   // RequestHandler creates a separate execution context using domains, so that every
//   // transaction/span/breadcrumb is attached to its own Hub instance
//   app.use(Sentry.Handlers.requestHandler());
//   // TracingHandler creates a trace for every incoming request
//   app.use(Sentry.Handlers.tracingHandler());
// }

// app
//   .use(helmet())
//   .use(compression())
//   .use(
//     history({
//       verbose: config.isDebugMode,
//       rewrites: [
//         {
//           from: /^\/labsbeta\/.*$/,
//           to: (ctx) => '/labs/' + ctx.parsedUrl.pathname,
//         },
//       ],
//     })
//   );

// // All controllers should live here
// app.get('/', function rootHandler(req: Request, res: Response) {
//   res.end('Hello world!');
// });

// if (config.isSentrySupport) {
//   app.get('/debug-sentry', (req: Request, res: Response) => {
//     throw new Error('Debug Sentry error!');
//   });
//   // The error handler must be before any other error middleware and after all controllers
//   app.use(Sentry.Handlers.errorHandler());
// }

// // Optional fallthrough error handler
// app.use(function onError(
//   err: Error,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   // The error id is attached to `res.sentry` to be returned
//   // and optionally displayed to the user for support.
//   res.statusCode = 500;
//   res.end((res as any).sentry + '\n');
// });
