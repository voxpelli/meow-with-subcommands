export const defaultFlags = /** @satisfies {import("./flag-types.d.ts").AnyFlags} */ ({
  help: {
    'default': false,
    description: 'Print this help and exits.',
    type: 'boolean',
  },
  version: {
    'default': false,
    description: 'Prints current version and exits.',
    type: 'boolean',
  },
});
