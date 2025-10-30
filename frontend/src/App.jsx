import { GlobalStyle } from "./styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import AppRoutes from "./routes/AppRoutes";

import { theme } from "./styles/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import { CustomSelect } from "./components/Home/CustomSelect";
import { DataProvider } from "./contexts/DataContext";
import { ExemploTACO } from "./components/Home/ExemploTACO";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <DataProvider> 
          <GlobalStyle />
          {/*<AppRoutes />
           <ToastContainer /> */}
          <ExemploTACO />
         </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
