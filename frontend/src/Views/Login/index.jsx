import "./styles.css";
import logo from "../../assets/logo.svg"
import { useState, useEffect } from "react";
import { Input } from "../../components/Input";
import { SubmitButton } from "../../components/SubmitButton";

export const Login = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`login_container ${isVisible ? "visible" : ""}`}>
      <form>
        <div id="container_logo">
          <img src={logo} alt="Logo do Sistema Rótus" />
          <h1>Rótus</h1>
        </div>
        <h1>
          Entre na sua conta
        </h1>
        <Input label="Email" type='text' placeholder={"Digite seu email"} />
        <Input label="Senha" type='passowrd' placeholder="Insira sua senha" />
        <div className="login_actions">
          <input type="checkbox" /> <a href="">Esqueceu a sua senha?</a>
        </div>
        <SubmitButton title="Entrar" />
      </form>
    </div>
  );
};
