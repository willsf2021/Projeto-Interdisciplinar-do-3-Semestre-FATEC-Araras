import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


// Import das páginas abaixo...
import { SplashScreen } from "../pages/SplashScreen";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { RecoveryPassword } from "../pages/RecoveryPassword";


export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Gerencia as rotas através das páginas criadas */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<SplashScreen />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recovery-password" element={<RecoveryPassword />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}
