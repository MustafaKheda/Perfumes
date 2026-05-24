import { spawn } from "node:child_process";

const ignoredWarnings = [
  "[baseline-browser-mapping] The data in this module is over two months old.",
];

const child = spawn("next", ["build"], {
  env: {
    ...process.env,
    BROWSERSLIST_IGNORE_OLD_DATA: "true",
    BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA: "true",
  },
  shell: true,
  stdio: ["inherit", "pipe", "pipe"],
});

function forwardFiltered(stream, target) {
  let buffer = "";

  stream.on("data", (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!ignoredWarnings.some((warning) => line.includes(warning))) {
        target.write(`${line}\n`);
      }
    }
  });

  stream.on("end", () => {
    if (
      buffer &&
      !ignoredWarnings.some((warning) => buffer.includes(warning))
    ) {
      target.write(buffer);
    }
  });
}

forwardFiltered(child.stdout, process.stdout);
forwardFiltered(child.stderr, process.stderr);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }

  process.exit(code ?? 1);
});
