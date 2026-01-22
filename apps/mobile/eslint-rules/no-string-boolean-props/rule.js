/**
 * ESLint Rule: No String Boolean Props for React Native
 *
 * Detects and prevents string values ("true", "false") being passed to boolean props
 * which causes React Native crashes.
 *
 * BAD:  <Modal visible="true" />
 * GOOD: <Modal visible={true} />
 *
 * Auto-fix: Converts "true" -> {true}, "false" -> {false}
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow string values for boolean props in React Native',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          additionalProps: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      stringBooleanProp:
        'Boolean prop "{{prop}}" should not be a string. Use {{{value}}} instead of "{{value}}".',
    },
  },
  create(context) {
    // Common React Native boolean props
    const BOOLEAN_PROPS = new Set([
      // Modal
      'visible', 'animated', 'transparent', 'modal',
      // TextInput
      'editable', 'secureTextEntry', 'autoCapitalize', 'autoCorrect',
      'selectTextOnFocus', 'allowFontScaling',
      // ScrollView
      'scrollEnabled', 'bounces', 'pagingEnabled', 'overScrollMode',
      'nestedScrollEnabled', 'pinchGestureEnabled',
      'showsVerticalScrollIndicator', 'showsHorizontalScrollIndicator',
      // TouchableOpacity/Pressable
      'disabled', 'active',
      // Switch
      'value',
      // ActivityIndicator
      'animating', 'hidesWhenStopped',
      // FlatList
      'refreshing',
      // General
      'enabled', 'selected', 'checked', 'hidden',
    ]);

    // Additional props from config
    const additionalProps = context.options[0]?.additionalProps || [];
    additionalProps.forEach(prop => BOOLEAN_PROPS.add(prop));

    return {
      JSXAttribute(node) {
        // Skip if no value or not a literal
        if (!node.value || node.value.type !== 'Literal') return;

        // Skip if not a string
        if (typeof node.value.value !== 'string') return;

        const propName = node.name.name;
        if (!BOOLEAN_PROPS.has(propName)) return;

        const propValue = node.value.value;
        if (propValue !== 'true' && propValue !== 'false') return;

        context.report({
          node,
          messageId: 'stringBooleanProp',
          data: {
            prop: propName,
            value: propValue,
          },
          fix(fixer) {
            return fixer.replaceText(node.value, `{${propValue}}`);
          },
        });
      },
    };
  },
};
