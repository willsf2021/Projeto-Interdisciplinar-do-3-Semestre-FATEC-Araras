import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/images/logo.svg";
import googleIcon from "../../assets/images/google.svg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  SectionFormWrapper,
  FormWrapper,
  DividerWrapper,
  SecondaryButton,
  FormFooter,
  ActionFooter,
  LogoContainer,
  InputFlexWrapper,
} from "../../components/Forms/FormWrappers/styles";

import { Input } from "../../components/Forms/Input";
import { SubmitButton } from "../../components/Forms/SubmitButton";

import { authService } from "../../services/authService";

export const Login = () => {
  const navigate = useNavigate();

  // Função reaproveitável para notificações
  const notify = (message, type) => {
    switch(type){
      case'success':
        toast.success(message);
        break;
      case'warning':
        toast.warning(message);
        break;
      case'error':
        toast.error(message);
        break;
      case'info':
        toast.info(message);
        break;
    }
  };

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: false,
    loading: false,
    error: "",
  });

  const handleChange = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginData((prev) => ({ ...prev, error: "" }));

    const { email, password, remember } = loginData;

    if (!email || !password) {
      setLoginData((prev) => ({
        ...prev,
        error: "Preencha todos os campos.",
      }));
      return;
    }

    try {
      setLoginData((prev) => ({ ...prev, loading: true }));
      const { token } = await authService.login({ email, password });

      if (remember) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      notify("Login realizado, redirecionando...", 'info');

      // navigate("/home");
    } catch (err) {
      setLoginData((prev) => ({
        ...prev,
        error: err.message || "Erro ao fazer login",
      }));
    } finally {
      setLoginData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    console.log(loginData);
  }, [loginData]);

  const { email, password, remember, loading, error } = loginData;

  return (
    <SectionFormWrapper>
      <LogoContainer>
        <img src={logo} alt="Logo Sistema Rótus" />
        <h1>Rótus</h1>
      </LogoContainer>

      <FormWrapper onSubmit={handleSubmit}>
        <h1>Entre na sua conta</h1>

        <InputFlexWrapper>
          <Input
            label="E-mail"
            type="email"
            value={email}
            placeholder="Digite seu e-mail..."
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            placeholder="Digite sua senha..."
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </InputFlexWrapper>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="form-actions">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => handleChange("remember", e.target.checked)}
            />
            Relembrar-me
          </label>
          <a href="/recovery_password" id="forgot-password">
            Esqueceu sua senha?
          </a>
        </div>

        {error && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "8px" }}>
            {error}
          </p>
        )}

        <SubmitButton
          title={loading ? "Entrando..." : "Entrar"}
          disabled={loading}
          onClick={handleSubmit}
        />
      </FormWrapper>

      <FormFooter>
        <DividerWrapper>
          <div className="hr" />
          <span>ou</span>
          <div className="hr" />
        </DividerWrapper>

        <SecondaryButton>
          <img src={googleIcon} alt="Ícone do Google" />
          Entrar com o Google
        </SecondaryButton>

        <ActionFooter>
          <p>
            Ainda não possui conta? <a href="/register">Cadastre-se</a>
          </p>
        </ActionFooter>
      </FormFooter>
    </SectionFormWrapper>
  );
};
