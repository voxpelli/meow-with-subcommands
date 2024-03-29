import { defaultFlags } from './flags.js';
import {
  getHelpListMaxNamePadding,
  printGroupedHelpList,
} from './format-lists.js';

/**
 * @typedef HelpMessageInfo
 * @property {import('./main-types.d.ts').CliAliases} [aliases]
 * @property {import('./main-types.d.ts').CliSubcommands} [commands]
 * @property {string[]} [examples]
 * @property {import('./format-lists.js').HelpList} [flags]
 * @property {number} [indent]
 * @property {boolean} [noDefaultFlags]
 * @property {string} [usage]
 */

/**
 * @param {string} name
 * @param {Readonly<HelpMessageInfo>} info
 * @returns {string}
 */
export function formatHelpMessage (name, info = {}) {
  const {
    aliases = {},
    commands = {},
    examples = [],
    flags = {},
    indent = 2,
    noDefaultFlags = false,
    usage = '',
  } = info;

  const aliasesWithGroups = Object.fromEntries(
    Object.entries(aliases).map(
      ([key, { listGroup, ...value }]) => [key, {
        listGroup: (listGroup ? listGroup + ' ' : '') + 'Aliases',
        ...value,
      }]
    )
  );

  const commandList = { ...aliasesWithGroups, ...commands };
  const flagList = { ...flags, ...(noDefaultFlags ? {} : defaultFlags) };

  const padName = Math.max(
    getHelpListMaxNamePadding(commandList),
    getHelpListMaxNamePadding(flagList, { keyPrefix: '--' })
  );

  /** @type {import('./format-lists.js').HelpListGroupOptions} */
  const listOptions = { fixedPadName: true, padName };

  return (
    ''.padEnd(indent) + 'Usage\n' +
    ''.padEnd(indent + 2) + `$ ${name} ${usage}\n` +
    printGroupedHelpList(commandList, indent, { defaultGroupName: 'Commands', defaultGroupOrderFirst: true, ...listOptions }) +
    printGroupedHelpList(flagList, indent, { defaultGroupName: 'Options', keyPrefix: '--', ...listOptions }) +
    (
      examples.length
        ? '\n' + ''.padEnd(indent) + ['Examples', ...examples].join('\n' + ''.padEnd(indent + 2) + `$ ${name} `)
        : ''
    )
  );
}
