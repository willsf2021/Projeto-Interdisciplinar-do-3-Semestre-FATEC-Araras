// pages/SplashScreen/SplashScreen.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Container } from "./style";
import LogoSplash from "../../assets/images/logo_splash.svg";

export const SplashScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    }
  }, [isAuthenticated, loading, navigate]);

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
