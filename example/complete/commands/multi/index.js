import { meowWithSubcommands } from '../../../../index.js';

import { one } from './one.js';
import { two } from './two.js';

const description = 'Command with its own subcommands';

/** @type {import('../../../../index.js').CliSubcommand} */
export const multi = {
  description,
  run: async (args, meta, { parentName }) => {
    await meowWithSubcommands(
      {
        one,
        two,
      },
      {
        args,
        name: parentName + ' multi',
      },
      meta
    );
  },
};
