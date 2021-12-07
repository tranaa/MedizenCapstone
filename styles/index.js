import { DefaultTheme } from '@react-navigation/native'

// theme for the the theme provider used in main.js

export const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#92c05e',
    },
};
  