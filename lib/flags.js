export const defaultFlags = /** @satisfies {import("./flag-types.d.ts").AnyFlags} */ ({
  help: {
    description: 'Print this help and exits.',
    type: 'boolean',
  },
  version: {
    description: 'Prints current version and exits.',
    type: 'boolean',
  },
});
