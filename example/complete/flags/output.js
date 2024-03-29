export const outputFlags = /** @satisfies {import('../../../index.js').AnyFlags} */ ({
  json: {
    'default': false,
    description: 'Output result as json',
    listGroup: 'Output',
    'short': 'j',
    type: 'boolean',
  },
  markdown: {
    'default': false,
    description: 'Output result as markdown',
    listGroup: 'Output',
    'short': 'm',
    type: 'boolean',
  },
});
