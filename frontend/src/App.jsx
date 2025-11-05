import { GlobalStyle } from "./styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import AppRoutes from "./routes/AppRoutes";

import { theme } from "./styles/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";


function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <DataProvider>
          <GlobalStyle />
          <AppRoutes />
          <ToastContainer />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
