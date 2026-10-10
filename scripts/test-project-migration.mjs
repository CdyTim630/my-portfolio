/** Real PostgreSQL integration checks in a disposable, socket-only local cluster.
 * Run: node scripts/test-project-migration.mjs
 * PostgreSQL initdb, pg_ctl and psql must be on PATH (or set PG_BIN_DIR).
 * No credentials, existing database or network listener is used.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const directory = mkdtempSync("/tmp/portfolio-projects-pg-");
const dataDirectory = join(directory, "data");
const root = fileURLToPath(new URL("../", import.meta.url));
let started = false;
function run(binary, args, input) {
  const executable = process.env.PG_BIN_DIR ? join(process.env.PG_BIN_DIR, binary) : binary;
  const result = spawnSync(executable, args, { encoding: "utf8", input, timeout: 30000 });
  if (result.error || result.status !== 0) throw new Error(`${binary} failed: ${result.error?.message ?? result.stderr ?? result.stdout}`);
  return result.stdout;
}
function sql(content) {
  return run("psql", ["-X", "-v", "ON_ERROR_STOP=1", "-h", directory, "-p", "6543", "-U", "postgres", "-d", "postgres"], content);
}

try {
  run("initdb", ["-D", dataDirectory, "-U", "postgres", "--auth=trust", "--no-locale", "-E", "UTF8"]);
  run("pg_ctl", ["-D", dataDirectory, "-l", join(directory, "postgres.log"), "-o", `-h '' -k '${directory}' -p 6543`, "-w", "start"]);
  started = true;
  sql(`
    CREATE ROLE anon NOLOGIN;
    CREATE ROLE authenticated NOLOGIN;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users (id uuid PRIMARY KEY);
    INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000001');
    CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
      SELECT COALESCE(NULLIF(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
    $$;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT (auth.jwt() ->> 'sub')::uuid $$;
    GRANT USAGE ON SCHEMA auth TO anon, authenticated;
  `);
  const migration = readFileSync(join(root, "supabase-projects.sql"), "utf8");
  sql(migration);
  sql(migration);
  sql(readFileSync(join(root, "tests/project-migration.sql"), "utf8"));
  console.log("Project migration passed: idempotency, draft isolation, atomic publication, tombstones, administrator claims and RLS.");
} finally {
  if (started) run("pg_ctl", ["-D", dataDirectory, "-m", "immediate", "-w", "stop"]);
  rmSync(directory, { recursive: true, force: true });
}
