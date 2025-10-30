import { GlobalStyle } from "./styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import AppRoutes from "./routes/AppRoutes";

import { theme } from "./styles/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyle />
        <AppRoutes />
        <ToastContainer />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
