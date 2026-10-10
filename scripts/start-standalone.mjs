import { access, cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const standalone = resolve(root, ".next/standalone");
const server = resolve(standalone, "server.js");

try {
  await access(server);
} catch {
  console.error("Standalone output is missing. Run npm run build first.");
  process.exit(1);
}

// Next.js traces the server, but public and browser assets need to be copied.
// Match the Docker runtime layout and replace only generated asset directories.
await rm(resolve(standalone, "public"), { recursive: true, force: true });
await cp(resolve(root, "public"), resolve(standalone, "public"), { recursive: true });
await mkdir(resolve(standalone, ".next"), { recursive: true });
await rm(resolve(standalone, ".next/static"), { recursive: true, force: true });
await cp(resolve(root, ".next/static"), resolve(standalone, ".next/static"), { recursive: true });

process.env.PORT ||= "3000";
process.env.HOSTNAME ||= "127.0.0.1";
await import(pathToFileURL(server).href);
