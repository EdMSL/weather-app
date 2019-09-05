module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
  ],
  plugins: [
    'stylelint-order',
    'stylelint-scss',
    'stylelint-at-rule-no-children',
    'stylelint-color-format',
    'stylelint-declaration-use-variable',
  ],
  ignoreFiles: [
    'build/**/*'
  ],
  rules: {
    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        /mixin/,
        /include/,
        /function/,
        /return/,
      ],
    }],
    'at-rule-no-vendor-prefix': true,
    'block-no-empty': [true, {
      'message': 'No empty rule blocks.',
    }],
    'color-named': ['never', {
      'message': 'No named (web) colors.',
    }],
    'comment-no-empty': [true, {
      'message': 'No empty comment',
    }],
    'comment-empty-line-before': 'never', // --fix
    'declaration-empty-line-before': ['never', { // --fix
      'ignore': ['after-comment', 'after-declaration'],
    }],
    'declaration-no-important': true,
    'font-family-name-quotes': 'always-unless-keyword',
    'font-weight-notation': 'numeric',
    'function-calc-no-invalid': true,
    'function-url-no-scheme-relative': true,
    'function-url-quotes': 'always',
    'max-line-length': 80,
    'media-feature-name-no-vendor-prefix': true,
    'number-leading-zero': ['always', { // --fix
      'message': 'Missing leading zero.'
    }],
    'number-max-precision': [0, {
      'ignoreUnits': /^(?!px).*$/,
      'message': 'Value in px mast be integer number.',
    }],
    'no-unknown-animations': true,
    'property-no-vendor-prefix': [true, {
      'message': 'Not needed with autoprefixer',
    }],
    'string-quotes': 'double', // --fix
    'time-min-milliseconds': [300, {
      'message': 'No very fast animation',
    }],
    'shorthand-property-no-redundant-values': true, // --fix
    'value-no-vendor-prefix': [true, {
      'message': 'Not needed with autoprefixer',
    }],
    'rule-empty-line-before': ['always', { // --fix
      'ignore': ['first-nested'],
    }],
    'selector-max-compound-selectors': 2,
    'selector-max-universal': 1,
    "selector-pseudo-class-no-unknown": [true, {
      ignorePseudoClasses: ["global"],
    }],
    'value-keyword-case': 'lower', // --fix
    'aditayvm/at-rule-no-children': true,
    'color-format/format': { // --fix
      'format': 'rgb',
    },
    'sh-waqar/declaration-use-variable': [[
      'color',
      'background-color',
      {
        ignoreValues: [
          'transparent',
          'inherit',
          '/-func/',
        ],
      },
    ]],
    'scss/dollar-variable-colon-newline-after': 'always-multi-line', // --fix
    'scss/at-function-named-arguments': ['always', {
      'ignore': ['single-argument'],
    }],
    'scss/at-function-parentheses-space-before': 'never', // --fix
    'scss/at-function-pattern': /.+-func/,
    'scss/no-duplicate-dollar-variables': true,
    'scss/media-feature-value-dollar-variable': 'always',
    'scss/operator-no-unspaced': true,
    'order/order': [
      [  // --fix all
        {
          type: 'at-rule',
          name: 'include'
        },
        'declarations',
        {
          type: 'rule',
          selector: '^&::(before|after)'
        },
        {
          type: 'rule',
          selector: '^&:\\w'
        },
        {
          type: 'rule',
          selector: '^&--'
        },
        {
          type: 'rule',
          selector: '^&_'
        },
        {
          type: 'rule',
          selector: '^.'
        },
      ],
      {
        unspecified: "bottom",
      },
    ],
    'order/properties-order': [ // --fix all
      {
        groupName: "positioning",
        emptyLineBefore: "always",
        properties: [
          'content',
          'position',
          'top',
          'right',
          'bottom',
          'left',
          'z-index',
        ],
      },
      {
        groupName: "block model",
        emptyLineBefore: "always",
        properties: [
          'flex',
          'flex-grow',
          'flex-shrink',
          'flex-basis',
          'flex-flow',
          'display',
          'flex-direction',
          'flex-wrap',
          'justify-content',
          'align-content',
          'align-items',
          'order',
          'align-self',
          'box-sizing',
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
          'margin',
          'margin-top',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'padding',
          'padding-top',
          'padding-right',
          'padding-bottom',
          'padding-left',
          'overflow',
          'overflow-x',
          'overflow-y',
        ],
      },
      {
        groupName: "typography",
        emptyLineBefore: "always",
        properties: [
          'font',
          'font-family',
          'color',
          'font-size',
          'line-height',
          'font-weight',
          'font-style',
          'font-variant',
          'list-style',
          'list-style-position',
          'list-style-type',
          'list-style-image',
          'text-align',
          'text-transform',
          'text-decoration',
          'border-collapse',
          'border-spacing',
          'table-layout',
          'empty-cells',
          'caption-side',
          'vertical-align',
          'direction',
          'writing-mode',
          'font-size-adjust',
          'font-stretch',
          'font-effect',
          'font-emphasize',
          'font-emphasize-position',
          'font-emphasize-style',
          'font-smooth',
          'text-align-last',
          'letter-spacing',
          'word-spacing',
          'white-space',
          'text-emphasis',
          'text-emphasis-color',
          'text-emphasis-style',
          'text-emphasis-position',
          'text-indent',
          'text-justify',
          'text-outline',
          'text-wrap',
          'text-overflow',
          'text-overflow-ellipsis',
          'text-overflow-mode',
          'text-orientation',
          'word-wrap',
          'word-break',
          'tab-size',
          'hyphens',
          'columns',
          'column-count',
          'column-fill',
          'column-gap',
          'column-rule',
          'column-rule-color',
          'column-rule-style',
          'column-rule-width',
          'column-span',
          'column-width',
          'text-shadow',
          'page-break-after',
          'page-break-before',
          'page-break-inside',
        ],
      },
      {
        groupName: "formalization",
        emptyLineBefore: "always",
        properties: [
          'background',
          'background-color',
          'background-image',
          'linear-gradient',
          'background-repeat',
          'background-position',
          'background-position-x',
          'background-position-y',
          'background-size',
          'background-clip',
          'background-origin',
          'background-attachment',
          'box-decoration-break',
          'background-blend-mode',
          'border',
          'border-width',
          'border-style',
          'border-color',
          'border-top',
          'border-top-width',
          'border-top-style',
          'border-top-color',
          'border-right',
          'border-right-width',
          'border-right-style',
          'border-right-color',
          'border-bottom',
          'border-bottom-width',
          'border-bottom-style',
          'border-bottom-color',
          'border-left',
          'border-left-width',
          'border-left-style',
          'border-left-color',
          'border-radius',
          'border-top-left-radius',
          'border-top-right-radius',
          'border-bottom-right-radius',
          'border-bottom-left-radius',
          'border-image',
          'border-image-source',
          'border-image-slice',
          'border-image-width',
          'border-image-outset',
          'border-image-repeat',
          'outline',
          'outline-width',
          'outline-style',
          'outline-color',
          'outline-offset',
          'box-shadow',
          'transform',
          'transform-origin',
          'backface-visibility',
          'perspective',
          'perspective-origin',
          'transform-style',
          'visibility',
          'opacity',
          'filter',
          'cursor',
        ],
      },
      {
        groupName: "animation",
        emptyLineBefore: "always",
        properties: [
          'transition',
          'transition-delay',
          'transition-timing-function',
          'transition-duration',
          'transition-property',
          'animation',
          'animation-name',
          'animation-duration',
          'animation-play-state',
          'animation-timing-function',
          'animation-delay',
          'animation-iteration-count',
          'animation-direction',
        ],
      },
      {
        groupName: "other",
        emptyLineBefore: "always",
        properties: [
          'quotes',
          'counter-reset',
          'counter-increment',
          'resize',
          'user-select',
          'nav-index',
          'nav-up',
          'nav-right',
          'nav-down',
          'nav-left',
          'pointer-events',
          'will-change',
          'clip',
          'clip-path',
          'zoom',
        ],
      },
    ],
  },
}
