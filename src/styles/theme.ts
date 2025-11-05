const palette = {
  black: '#000000',
  white: '#FFFFFF',
  green: '#00FF00',
  darkGreen: '#008f00',
  lightGray: '#F0F0F0',
  mediumGray: '#888888',
  darkGray: '#1C1C1E',
  errorRed: '#ff4d4d',
};

export const lightTheme = {
  colors: {
    background: palette.lightGray,
    card: palette.white,
    text: palette.black,
    primary: palette.darkGreen,
    accent: palette.green,
    error: palette.errorRed,
    border: palette.mediumGray,
  },
};

export const darkTheme = {
  colors: {
    background: palette.black,
    card: palette.darkGray,
    text: palette.white,
    primary: palette.green,
    accent: palette.green,
    error: palette.errorRed,
    border: palette.green,
  },
};
