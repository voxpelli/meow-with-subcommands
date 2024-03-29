import { parseArgs } from 'node:util';

import { defaultFlags } from './flags.js';

// TODO: Add helper that translates a meow config into this config

/**
 * @template {import('./flag-types.js').AnyFlags} Flags
 * @param {string} help
 * @param {import('./meowify-parse-args-types.js').Options<Flags>} [options]
 * @returns {import('./meowify-parse-args-types.js').Result<Flags>}
 */
export function meowifyParseArgs (help, options) {
  const pkg = options?.pkg;

  const {
    description = pkg?.description,
    indent = 2,
    options: flags,
    pkg: _pkg,
    processTitle = Array.isArray(pkg?.bin) ? Object.keys(pkg?.bin).at(0) : pkg?.name,
    version = pkg?.version,
    ...parseArgsOptions
  } = options || {};

  if (processTitle) {
    process.title = processTitle;
  }

  if (description !== false) {
    help = '\n' + ''.padEnd(indent) + description + '\n\n' + help;
  }

  /** @type {import('./flag-types.js').AnyFlags & typeof defaultFlags} */
  const resolvedFlags = { ...flags, ...defaultFlags };

  const {
    positionals,
    values: {
      help: helpFlag,
      version: versionFlag,
      ...values
    },
  } = parseArgs({
    allowPositionals: true,
    ...parseArgsOptions,
    options: resolvedFlags,
    strict: true,
    tokens: false,
  });

  const showHelp = (/** @type {number | undefined} */ code) => {
    // eslint-disable-next-line no-console
    console.log(help);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(typeof code === 'number' ? code : 2); // Default to code 2 for incorrect usage (#47)
  };

  if (helpFlag) {
    showHelp(0);
  }

  if (versionFlag) {
    // eslint-disable-next-line no-console
    console.log(version);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  }

  return {
    input: positionals,
    flags: /** @type {import('./meowify-parse-args-types.js').TypedFlags<Flags>} */ (values),
    showHelp,
  };
}
