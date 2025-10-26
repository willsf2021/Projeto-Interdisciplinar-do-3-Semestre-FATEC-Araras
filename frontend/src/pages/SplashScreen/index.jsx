import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container } from "./style";
import LogoSplash from "../../assets/images/logo_splash.svg"

export const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        const timer = setTimeout(()=>{
            navigate("/login")
        }, 4000)
    }, [])

  return (
    <Container>
        <div id="container-logo">
          <img
            src={LogoSplash}
            alt="Logo do Sistema Rótus"
            id="logo-splash"
          />
        </div>
    </Container>
  );
};
