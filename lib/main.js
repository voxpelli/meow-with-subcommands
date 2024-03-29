import { formatHelpMessage } from './format-help.js';
import { meowifyParseArgs } from './meowify-parse-args.js';
import { resolveMeta } from './meta.js';

/**
 * @template {import('./flag-types.js').AnyFlags} Flags
 * @param {import('./main-types.d.ts').CliSubcommands} subcommands
 * @param {import('./main-types.d.ts').CliOptions<Flags>} options
 * @param {import('./meowify-parse-args-types.js').Meta} [meta]
 * @returns {Promise<void>}
 */
export async function meowWithSubcommands (subcommands, options, meta) {
  const resolvedMeta = await resolveMeta(options, meta || {});

  const {
    aliases = {},
    args = process.argv.slice(2),
    cwd: _cwd,
    importMeta: _importMeta,
    name = resolvedMeta.processTitle,
    ...additionalOptions
  } = options;

  if (!name) {
    throw new Error('Could not resolve a name. One is needed for proper help generation');
  }

  const [commandOrAliasName, ...rawCommandArgv] = args;

  // If we got at least some args, then lets find out if we can find a command
  if (commandOrAliasName) {
    const alias = aliases[commandOrAliasName];

    // First: Resolve argv data from alias if its an alias that's been given
    const [commandName, ...commandArgv] = alias
      ? [...alias.argv, ...rawCommandArgv]
      : [commandOrAliasName, ...rawCommandArgv];

    // Second: Find a command definition using that data
    const commandDefinition = commandName ? subcommands[commandName] : undefined;

    // Third: If a valid command has been found, then we run it...
    if (commandDefinition) {
      return await commandDefinition.run(
        commandArgv,
        resolvedMeta,
        {
          parentName: name,
        }
      );
    }
  }

  // ...else we provide basic instructions and help
  const cli = meowifyParseArgs(formatHelpMessage(name, {
    aliases,
    commands: subcommands,
    examples: ['--help'],
    usage: '<command>',
  }), {
    ...additionalOptions,
    ...resolvedMeta,
    args,
  });

  cli.showHelp();
}
