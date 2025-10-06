import { useState, useEffect } from "react";
import "./styles.css";

export const Login = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`login_container ${isVisible ? "visible" : ""}`}>
      <h1>Página de Login</h1>
    </div>
  );
};
