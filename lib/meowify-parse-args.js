import { parseArgs } from 'node:util';

import { filter } from '@voxpelli/typed-utils';

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
    args = process.argv.slice(2),
    description = pkg?.description,
    indent = 2,
    options: flags,
    pkg: _pkg,
    processTitle = Array.isArray(pkg?.bin) ? Object.keys(pkg?.bin).at(0) : pkg?.name,
    returnRemainderArgs,
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
    tokens,
    values: {
      help: helpFlag,
      version: versionFlag,
      ...values
    },
  } = parseArgs({
    args,
    allowPositionals: true,
    ...parseArgsOptions,
    options: resolvedFlags,
    strict: !returnRemainderArgs,
    tokens: true,
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

  /** @type {string[]} */
  let remainderArgs = [];

  if (returnRemainderArgs) {
    /** @type {Array<string|undefined>} */
    const sourceArgs = [...args];

    for (const token of tokens) {
      if (token.kind !== 'option') {
        continue;
      }
      if (!resolvedFlags[token.name]) {
        continue;
      }
      sourceArgs[token.index] = undefined;
    }

    remainderArgs = filter(sourceArgs);
  }

  return {
    input: positionals,
    flags: /** @type {import('./meowify-parse-args-types.js').TypedFlags<Flags>} */ (values),
    remainderArgs,
    showHelp,
  };
}
