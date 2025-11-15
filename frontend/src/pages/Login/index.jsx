import { useState, useEffect  } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../hooks/useNotification";
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

export const Login = () => {
  const {
    login,
    loading: authLoading,
    error: authError,
    isAuthenticated,
  } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevenir duplo clique
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { email, password } = formData;

    // Validações locais
    if (!email || !password) {
      notify("Preencha todos os campos.", "warning");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData);

      if (result.success) {
        notify("Login realizado com sucesso!", "success");
      } else {
        notify("Erro ao fazer login", "error");
      }
    } catch (error) {
      notify("Erro ao fazer login", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = authLoading || isSubmitting;

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
            value={formData.email}
            placeholder="Digite seu e-mail..."
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            value={formData.password}
            placeholder="Digite sua senha..."
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
        </InputFlexWrapper>

        <div className="form-actions">
          <label>
            <input
              type="checkbox"
              checked={formData.remember}
              onChange={(e) => handleChange("remember", e.target.checked)}
            />
            Relembrar-me
          </label>
          <a href="/recovery-password" id="forgot-password">
            Esqueceu sua senha?
          </a>
        </div>

        {authError && (
          <p
            style={{
              color: "red",
              fontSize: "0.9rem",
              marginTop: "8px",
              padding: "0.5rem",
              backgroundColor: "#ffe6e6",
              borderRadius: "4px",
              border: "1px solid #ffcccc",
            }}
          >
            {authError}
          </p>
        )}

        <SubmitButton
          title={
            loading ? (
              <>
                <span className="spinner" /> Entrando...
              </>
            ) : (
              "Entrar"
            )
          }
          disabled={loading}
          type="submit"
        />
      </FormWrapper>

      <FormFooter>
        <DividerWrapper>
          <div className="hr" />
          <span>ou</span>
          <div className="hr" />
        </DividerWrapper>

        <SecondaryButton type="button">
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
