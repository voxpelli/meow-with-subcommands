/**
 * @typedef FlagExtensions
 * @property {string} [listGroup]
 * @property {string} description
 */

/**
 * @template {import('meow').FlagType} Type
 * @template Default
 * @template {boolean} [IsMultiple=false]
 * @typedef {Readonly<import('meow').Flag<Type, Default, IsMultiple> & FlagExtensions>} Flag
 */

/** @typedef {Flag<'string', string> | Flag<'string', string[], true>} StringFlag */
/** @typedef {Flag<'boolean', boolean> | Flag<'boolean', boolean[], true>} BooleanFlag */
/** @typedef {Flag<'number', number> | Flag<'number', number[], true>} NumberFlag */
/** @typedef {StringFlag | BooleanFlag | NumberFlag} AnyFlag */
/** @typedef {Readonly<Record<string, AnyFlag>>} AnyFlags */

/**
 * @template {AnyFlags} Flags
 * @param {Flags} flags
 * @returns {Readonly<Flags>}
 */
export function prepareFlags (flags) {
  // As we can't do "satisfies AnyFlags" in JS yet (+ we add a bonus through Readonly<>)
  return flags;
}

export const defaultFlags = Object.freeze({
  'help': 'Print this help and exits.',
  'version': 'Prints current version and exits.',
});
