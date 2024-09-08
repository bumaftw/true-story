const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(23, 146, 112)',
          hover: 'rgb(19, 131, 101)',
          active: 'rgb(17, 117, 91)',
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/line-clamp'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          'primary': 'rgb(23, 146, 112)',
          'primary-content': '#ffffff',
          // 'secondary': '#f6d860',
          'accent': '#37cdbe',
          'neutral': '#3d4451',
          'base-100': '#ffffff',
        },
      },
    ],
  },
};
