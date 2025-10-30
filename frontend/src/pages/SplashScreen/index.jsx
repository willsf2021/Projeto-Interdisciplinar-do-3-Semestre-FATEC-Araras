// pages/SplashScreen/SplashScreen.jsx
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Container } from "./style";
import LogoSplash from "../../assets/images/logo_splash.svg";

export const SplashScreen = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Container>
        <div id="container-logo">
          <img src={LogoSplash} alt="Logo do Sistema Rótus" id="logo-splash" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div id="container-logo">
        <img src={LogoSplash} alt="Logo do Sistema Rótus" id="logo-splash" />
        <p>Verificando autenticação...</p>
      </div>
    </Container>
  );
};