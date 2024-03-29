export const validationFlags = /** @satisfies {import('../../../index.js').AnyFlags} */ ({
  strict: {
    type: 'boolean',
    'default': false,
    description: 'Exit with an error code if any matching issues are found',
  },
});
