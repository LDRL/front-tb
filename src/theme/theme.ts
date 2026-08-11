import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";

export default createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    success: {
      main: colors.success
    },
    info: {
      main: colors.info
    }
  },
});