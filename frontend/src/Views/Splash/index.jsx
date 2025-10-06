import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import logo from "../../assets/logo.svg";

export const Splash = () => {
  const splashRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (splashRef.current) splashRef.current.classList.add("hidden");

      setTimeout(() => navigate("/login"), 600);
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div id="splash" ref={splashRef}>
      <div id="container_logo_splash">
        <img className="fade_in" src={logo} alt="Logo do Sistema Rótus" />
        <h1 className="fade_in">Rótus</h1>
      </div>
    </div>
  );
};
