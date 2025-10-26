import { GlobalStyle } from "./styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import AppRoutes from "./routes/AppRoutes";

import { theme } from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
