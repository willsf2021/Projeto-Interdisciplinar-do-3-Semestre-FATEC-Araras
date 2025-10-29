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

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Register = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    type: "estudante", // TODO: CAMPO DE ESCOLHA NA UI!
    error: "",
  });

  const notify = (message, type) => {
      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "warning":
          toast.warning(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "info":
          toast.info(message);
          break;
      }
    };
  
    const notifyAndDelay = (message, type, delay = 1500) => {
      notify(message, type);
      return new Promise((resolve) => setTimeout(resolve, delay));
    };

  const handleChange = (field, value) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterData((prev) => ({ ...prev, error: "", loading: true }));

    const { name, email, password, confirmPassword, type } = registerData;

    if (password != confirmPassword) {
      setRegisterData((prev) => ({
        ...prev,
        error: "As senhas não conferem.",
      }));
      return;
    }

    if (!email || !password || !confirmPassword || !name || !type) {
      setRegisterData((prev) => ({
        ...prev,
        error: "Preencha todos os campos.",
      }));
      return;
    }

    try {
      const result = await authService.register({ name, email, password, type });

      if (result.status === 201) {
        await notifyAndDelay(
          `${result.data.mensagem} redirecionando...`,
          "success",
          3000
        );
        navigate("/home");
      } else if (result.status === 400) {
        setRegisterData((prev) => ({ ...prev, error: result.data.erro }));
        notify(result.data.erro, "error");
      } else {
        const message = result.data?.erro || "Erro inesperado ao fazer login";
        setRegisterData((prev) => ({ ...prev, error: message }));
        notify(message, "error");
      }
    } catch (err) {
      const message = err.message || "Erro ao fazer login";
      setRegisterData((prev) => ({ ...prev, error: message }));
      notify(message, "error");
    } finally {
      setRegisterData((prev) => ({ ...prev, loading: false }));
    }
  };

  const { name, email, password, confirmPassword, loading, error } =
    registerData;

  return (
    <SectionFormWrapper>
       <ToastContainer position="top-right" autoClose={3000} />
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
          title={
            loading ? (
              <>
                <span className="spinner" /> Registrando...
              </>
            ) : (
              "Confirmar"
            )
          }
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
