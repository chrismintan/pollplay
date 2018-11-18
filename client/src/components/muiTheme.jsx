import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

const muiTheme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    primary: {
      light: palette.primary[300],
      main: palette.primary[500],
      dark: palette.primary[700],
      contrastText: getContrastText(palette.primary[500]),
    },
    secondary: {
      light: palette.secondary.A200,
      main: palette.secondary.A400,
      dark: palette.secondary.A700,
      contrastText: getContrastText(palette.secondary.A400),
    },
    error: {
      light: palette.error[300],
      main: palette.error[500],
      dark: palette.error[700],
      contrastText: getContrastText(palette.error[500]),
    },
  },
});