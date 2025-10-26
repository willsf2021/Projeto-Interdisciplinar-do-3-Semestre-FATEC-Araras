import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

import logo from "../../assets/images/logo.svg";
import googleIcon from "../../assets/images/google.svg";

import { authService } from "../../services/authService";

export const Register = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    error: "",
  });

  const handleChange = (field, value) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterData((prev) => ({ ...prev, error: "" }));

    const { name, email, password, confirmPassword } = registerData;

    if (!name || !email || !password || !confirmPassword) {
      setRegisterData((prev) => ({
        ...prev,
        error: "Preencha todos os campos",
      }));
      return;
    }

    if (password !== confirmPassword) {
      setRegisterData((prev) => ({
        ...prev,
        error: "As senhas não coincidem",
      }));
      return;
    }

    try {
      setRegisterData((prev) => ({ ...prev, loading: true }));
      const { token } = await authService.register({
        name,
        email,
        password,
        confirmPassword,
      });

      localStorage.setItem("token", token);

      navigate("/home");
    } catch (err) {
      setRegisterData((prev) => ({
        ...prev,
        error: err.message || "Erro ao registrar",
      }));
    } finally {
      setRegisterData((prev) => ({ ...prev, loading: false }));
    }
  };

  const { name, email, password, confirmPassword, loading, error } =
    registerData;

  return (
    <SectionFormWrapper>
      <LogoContainer>
        <img src={logo} alt="Logo Sistema Rótus" />
        <h1>Rótus</h1>
      </LogoContainer>

      <FormWrapper onSubmit={handleSubmit}>
        <h1>Cadastre-se</h1>

        <InputFlexWrapper>
          <Input
            label="Nome"
            type="text"
            value={name}
            placeholder="Digite seu nome..."
            onChange={(e) => handleChange("name", e.target.value)}
          />
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
          <Input
            label="Confirmar Senha"
            type="password"
            value={confirmPassword}
            placeholder="Confirme sua senha..."
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
        </InputFlexWrapper>

        {error && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "8px" }}>
            {error}
          </p>
        )}

        <SubmitButton
          title={loading ? "Registrando..." : "Confirmar"}
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
          Cadastrar com o Google
        </SecondaryButton>

        <ActionFooter>
          <p>
            Já possui conta? <a href="/login">Entre</a>
          </p>
        </ActionFooter>
      </FormFooter>
    </SectionFormWrapper>
  );
};
