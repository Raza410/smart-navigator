export default {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#2574ea',
        secondary: {
          '50': '#f5faff','100': '#e4eefc', '200': '#c2d6f8', '300': '#9fc0f4', '400': '#5b97ec', '500': '#2266d7', '600': '#1f5cc1', '700': '#1a4e9e', '800': '#15407b', '900': '#123366',
        },
      }
    },
  },
  variants: {},
  plugins: [],
}
