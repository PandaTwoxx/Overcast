import { readFile } from "node:fs/promises";
import * as http from "node:http";
import { join, resolve, dirname } from "node:path";
import { parse as parseQueryString } from "node:querystring";
import { URL, fileURLToPath } from "node:url";
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { lookup as mimeLookup } from 'mime-types';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enhanced route handler type definition
type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  params?: Record<string, string>,
  query?: Record<string, string | string[]>,
  body?: Record<string, string>,
) => void;

// Streaming route handler type definition
type StreamingRouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  params?: Record<string, string>,
  query?: Record<string, string | string[]>
) => void;

// Route definition interface
interface Route {
  methods: string[];
  path: string;
  handler: RouteHandler;
}

// Streaming Route definition interface
interface StreamingRoute {
  method: string;
  path: string;
  handler: StreamingRouteHandler;
}

// Custom response extension
interface EnhancedServerResponse extends http.ServerResponse {
  redirect: (url: string, statusCode?: number) => void;
  renderTemplate: (templatePath: string, context?: Record<string, any>) => Promise<void>;
}

// Test case interface
interface TestCase {
  name: string;
  method: string;
  path: string;
  expectedParams?: Record<string, string>;
  expectedMatch: boolean;
}

// Test result interface
interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}
// Updated Plugin interface to support both handler types
interface Plugin {
  name: string;
  handler: (
    req: http.IncomingMessage,
    res: EnhancedServerResponse,
    params?: Record<string, string>,
    query?: Record<string, string | string[]>,
    body?: Record<string, string>
  ) => Promise<RouteHandler | StreamingRouteHandler | true | false>; // Allow both handler types
}

// Template rendering utility
async function renderTemplate(
  templatePath: string,
  context: Record<string, any> = {},
): Promise<string> {
  try {
    // Read template file from templates directory
    const fullPath = join(process.cwd(), "templates", templatePath);
    let template = await readFile(fullPath, "utf-8");

    // Use Function constructor for safe template interpolation
    const templateFunction = new Function(
      ...Object.keys(context),
      `return \`${template}\`;`
    );

    // Apply context values to template
    return templateFunction(...Object.values(context));
  } catch (error) {
    console.error("Template rendering error:", error);
    throw new Error(`Failed to render template: ${templatePath}`);
  }
}

// Body parsing utility (unchanged from previous version)
async function parseBody(req: http.IncomingMessage): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const contentType = req.headers["content-type"] || "";

        if (contentType.includes("application/x-www-form-urlencoded")) {
          resolve(parseQueryString(body) as Record<string, string>);
        } else if (contentType.includes("application/json")) {
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

function enhanceResponse(res: http.ServerResponse): EnhancedServerResponse {
  const enhancedRes = res as EnhancedServerResponse;

  enhancedRes.redirect = (url: string, statusCode: number = 302) => {
    enhancedRes.writeHead(statusCode, { Location: url });
    enhancedRes.end();
  };

  enhancedRes.renderTemplate = async (templatePath, context = {}) => {
    try {
      const content = await renderTemplate(templatePath, context);
      enhancedRes.setHeader("Content-Type", "text/html");
      enhancedRes.end(content);
    } catch (error) {
      enhancedRes.statusCode = 500;
      enhancedRes.end("Template rendering error");
    }
  };

  return enhancedRes;
}

/**
 * Reads the contents of a file at the given path.
 *
 * @param filePath - The path to the file to read.
 * @returns The contents of the file as a string, or undefined if the file does not exist.
 */
function pullFile(filePath: string): string | undefined {
  const absolutePath = resolve(__dirname, filePath);

  if (!existsSync(absolutePath)) {
    return undefined;
  }

  try {
    return readFileSync(absolutePath, 'utf-8');
  } catch (error) {
    console.error(`Failed to read file at ${absolutePath}: ${error}`);
    return undefined;
  }
}

class Router {
  private routes: Route[] = [];
  private streamingRoutes: StreamingRoute[] = []; // New array for streaming routes
  private globalPlugins: Plugin[] = [];

  // Add a global plugin
  addGlobalPlugin(plugin: Plugin) {
    this.globalPlugins.push(plugin);
  }

  // Enhanced addRoute with support for custom plugins and handler override
  addRoute(
    methods: string | string[], // Accept single method or array of methods
    path: string,
    handler: RouteHandler,
    customPlugins: Plugin[] = [], // Add custom plugins per route
    redirectTo?: string
  ) {
    const normalizedMethods = Array.isArray(methods) ? methods.map(m => m.toUpperCase()) : [methods.toUpperCase()];
    const wrappedHandler: RouteHandler = async (req, res, params, query, body) => {
      const enhancedRes = res as EnhancedServerResponse;

      // Run global plugins
      for (const plugin of this.globalPlugins) {
        const result = await plugin.handler(req, enhancedRes, params, query, body);

        if (result === false) return; // Halt the request if the plugin returns false
        if (typeof result === 'function') handler = result; // Override handler if plugin provides a new one
      }

      // Run custom plugins
      for (const plugin of customPlugins) {
        const result = await plugin.handler(req, enhancedRes, params, query, body);

        if (result === false) return; // Halt the request if the plugin returns false
        if (typeof result === 'function') handler = result; // Override handler if plugin provides a new one
      }

      // Run the final (possibly overridden) route handler
      await handler(req, enhancedRes, params, query, body);

      // Optional redirection
      if (redirectTo) {
        enhancedRes.redirect(redirectTo);
      }
    };

    this.routes.push({ methods: normalizedMethods, path, handler: wrappedHandler });
  }

  /**
   * Adds a route for streaming data to the client with plugin support.
   * @param method The HTTP method for the route (typically 'GET').
   * @param path The URL path for the route.
   * @param handler The function that will handle the streaming logic.
   * @param customPlugins Optional array of plugins for this route.
   */
  addStreamRoute(
    method: string,
    path: string,
    handler: StreamingRouteHandler,
    customPlugins: Plugin[] = []
  ) {
    const normalizedMethod = method.toUpperCase();
    const wrappedHandler: StreamingRouteHandler = async (req, res, params, query) => {
      const enhancedRes = res as EnhancedServerResponse;

      // Run global plugins
      for (const plugin of this.globalPlugins) {
        const result = await plugin.handler(req, enhancedRes, params, query, undefined); // Body is undefined for streaming

        if (result === false) return; // Halt the request if the plugin returns false
        if (typeof result === 'function') handler = result; // Override handler if plugin provides a new one
      }

      // Run custom plugins
      for (const plugin of customPlugins) {
        const result = await plugin.handler(req, enhancedRes, params, query, undefined); // Body is undefined for streaming

        if (result === false) return; // Halt the request if the plugin returns false
        if (typeof result === 'function') handler = result; // Override handler if plugin provides a new one
      }

      // Run the final (possibly overridden) route handler
      handler(req, res, params, query);
    };
    this.streamingRoutes.push({ method: normalizedMethod, path, handler: wrappedHandler });
  }

  /**
   * Adds routes for serving static files from a directory.
   *
   * @param directoryPath - The path to the directory to serve.
   */
  addDirectory(directoryPath: string) {
    const absoluteDirPath = resolve(__dirname, directoryPath);

    if (!existsSync(absoluteDirPath) || !statSync(absoluteDirPath).isDirectory()) {
      console.error(`Error: Directory not found at ${absoluteDirPath}`);
      return;
    }

    const traverseDirectory = (currentPath: string, routePrefix: string) => {
      const files = readdirSync(currentPath);

      for (const file of files) {
        const absoluteFilePath = join(currentPath, file);
        const relativePath = absoluteFilePath.substring(absoluteDirPath.length);
        const routePath = join(routePrefix, relativePath).replace(/\\/g, '/'); // Normalize path for URLs

        if (statSync(absoluteFilePath).isDirectory()) {
          traverseDirectory(absoluteFilePath, routePrefix);
        } else {
          this.addRoute('GET', routePath, (req, res) => {
            const enhancedRes = res as EnhancedServerResponse;
            const contentType = mimeLookup(file) || 'application/octet-stream';

            if (pullFile(join(directoryPath, relativePath))) {
              enhancedRes.setHeader('Content-Type', contentType);
              enhancedRes.end(pullFile(join(directoryPath, relativePath)));
            } else {
              enhancedRes.statusCode = 404;
              enhancedRes.end('Not Found');
            }
          });
        }
      }
    };

    traverseDirectory(absoluteDirPath, `/${directoryPath}`);
  }

  // Match route (unchanged from your original code)
  matchRoute(method: string, url: string) {
    const normalizedMethod = method.toUpperCase();
    for (const route of this.routes) {
      const paramNames: string[] = [];
      const regexPath = route.path.replace(/:[^\s/]+/g, (match) => {
        paramNames.push(match.slice(1));
        return "([^/]+)";
      });

      const regex = new RegExp(`^${regexPath}$`);
      const match = url.match(regex);

      if (match && route.methods.includes(normalizedMethod)) { // Check if method is in the allowed methods
        const params: Record<string, string> = {};
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { handler: route.handler, params };
      }
    }
    return null;
  }

  // Match streaming route
  matchStreamingRoute(method: string, url: string) {
    const normalizedMethod = method.toUpperCase();
    for (const route of this.streamingRoutes) {
      const paramNames: string[] = [];
      const regexPath = route.path.replace(/:[^\s/]+/g, (match) => {
        paramNames.push(match.slice(1));
        return "([^/]+)";
      });

      const regex = new RegExp(`^${regexPath}$`);
      const match = url.match(regex);

      if (match && route.method === normalizedMethod) {
        const params: Record<string, string> = {};
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { handler: route.handler, params };
      }
    }
    return null;
  }

  handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const enhancedRes = enhanceResponse(res);
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const method = req.method || "";
    const pathname = url.pathname;

    const routeMatch = this.matchRoute(method, pathname);
    const streamMatch = this.matchStreamingRoute(method, pathname);

    if (routeMatch) {
      const query = Object.fromEntries(url.searchParams.entries());
      parseBody(req)
        .then((body) => routeMatch.handler(req, enhancedRes, routeMatch.params, query, body))
        .catch((error) => {
          enhancedRes.statusCode = 500;
          enhancedRes.end("Internal Server Error");
          console.error("Request handling error:", error);
        });
    } else if (streamMatch) {
      // Handle streaming route
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      streamMatch.handler(req, res, streamMatch.params, Object.fromEntries(url.searchParams.entries()));
    }
    else {
      enhancedRes.statusCode = 404;
      enhancedRes.end("Not Found");
    }
  }

  /**
   * Run a comprehensive test suite for route matching
   * @param testCases Array of test cases to run
   * @returns Detailed test results
   */
  runTests(testCases: TestCase[]): TestResult[] {
    const results: TestResult[] = [];

    testCases.forEach(testCase => {
      try {
        const matchResult = this.matchRoute(testCase.method, testCase.path) || this.matchStreamingRoute(testCase.method, testCase.path);
        const passed = testCase.expectedMatch
          ? matchResult !== null
          : matchResult === null;

        const result: TestResult = {
          name: testCase.name,
          passed: passed,
        };

        // Additional checks for parameter matching if expected
        if (passed && testCase.expectedParams && matchResult) {
          const paramKeys = Object.keys(testCase.expectedParams);
          const allParamsMatch = paramKeys.every(key => matchResult.params[key] === testCase.expectedParams?.[key]);

          if (!allParamsMatch) {
            result.passed = false;
            result.message = `Parameter mismatch. Expected: ${JSON.stringify(testCase.expectedParams)}, Got: ${
              JSON.stringify(matchResult.params)
            }`;
          }
        }

        // Add detailed message for failed tests
        if (!result.passed) {
          result.message = result.message || `Route match failed for ${testCase.path}`;
        }

        results.push(result);
      } catch (error) {
        results.push({
          name: testCase.name,
          passed: false,
          message: `Test error: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    });

    return results;
  }

  /**
   * Utility method to print test results with color and formatting
   * @param results Test results to print
   */
  printTestResults(results: TestResult[]) {
    console.log("\n🧪 Router Test Results:");
    console.log("--------------------");

    let passedCount = 0;
    let failedCount = 0;

    results.forEach(result => {
      if (result.passed) {
        console.log(`✅ ${result.name}: PASSED`);
        passedCount++;
      } else {
        console.log(`❌ ${result.name}: FAILED`);
        console.log(`   ${result.message || "Unknown failure"}`);
        failedCount++;
      }
    });

    console.log("\nSummary:");
    console.log(`Total Tests: ${results.length}`);
    console.log(`Passed: ${passedCount}`);
    console.log(`Failed: ${failedCount}`);

    return {
      totalTests: results.length,
      passed: passedCount,
      failed: failedCount,
    };
  }

  /**
   * Returns an HTTP server configured with the router.
   * @returns {http.Server} The configured HTTP server.
   */
  createServer(): http.Server {
    return http.createServer(async (req, res) => {
      const enhancedRes = enhanceResponse(res); // Enhance the response object
      const url = new URL(req.url || "", `http://${req.headers.host}`);
      const method = req.method || "";
      const pathname = url.pathname;

      const routeMatch = this.matchRoute(method, pathname);
      const streamMatch = this.matchStreamingRoute(method, pathname);

      if (routeMatch) {
        const query = Object.fromEntries(url.searchParams.entries());
        try {
          const body = await parseBody(req);
          await routeMatch.handler(req, enhancedRes, routeMatch.params, query, body);
        } catch (error) {
          console.error("Handler error:", error);
          enhancedRes.statusCode = 500;
          enhancedRes.end("Internal Server Error");
        }
      } else if (streamMatch) {
        // Handle streaming route
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        streamMatch.handler(req, res, streamMatch.params, Object.fromEntries(url.searchParams.entries()));
      }
       else {
        enhancedRes.statusCode = 404;
        enhancedRes.end("Not Found");
      }
    });
  }
}

// Export server creation function
export { Router, renderTemplate, enhanceResponse, parseBody, Plugin, RouteHandler, StreamingRouteHandler, EnhancedServerResponse };