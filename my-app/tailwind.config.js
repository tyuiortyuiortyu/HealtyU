/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#2B4763',
        secondary: {
          DEFAULT: '#FBF9E7',
          green: '#588980',
          yellow: '#EAE6A1',
          lightgreen: '#CCD885'
        },
        black: '#2E2E2E',
        gray: '#9B9B9B',
      },
      fontFamily: {
        aExLight: ["Assistant-ExtraLight", "sans-serif"],
        aLight: ["Assistant-Light", "sans-serif"],
        aRegular: ["Assistant-Regular", "sans-serif"],
        aMedium: ["Assistant-Medium", "sans-serif"],
        aSemiBold: ["Assistant-SemiBold", "sans-serif"],
        aBold: ["Assistant-Bold", "sans-serif"],
        aExBold: ["Assistant-ExtraBold", "sans-serif"],
        rMedium: ["Raleway-Medium", "sans-serif"],
      },
      fontSize: {
        'xxs': '0.625rem'
      }
    },
  },
  plugins: [],
}