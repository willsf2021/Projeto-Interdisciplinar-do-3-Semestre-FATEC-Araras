import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../hooks/useNotification";

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

export const Register = () => {
  const { register, loading: authLoading, error: authError } = useAuth();
  const { notify } = useNotification();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "estudante",
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevenir duplo clique
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { name, email, password, confirmPassword, type } = formData;

    // Validações locais
    if (!email || !password || !confirmPassword || !name || !type) {
      notify("Preencha todos os campos.", "warning");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      notify("As senhas não conferem.", "error");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      notify("A senha deve ter pelo menos 6 caracteres.", "warning");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register({
        name,
        email,
        password,
        type,
      });

      if (result.success) {
        notify("Cadastro realizado com sucesso!", "success");
        // ✅ Redirecionamento automático pelo AuthContext
      }
    } catch (error) {
      notify("Erro ao criar conta", "error");
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
        <h1>Cadastre-se</h1>

        <InputFlexWrapper>
          <Input
            label="Nome"
            type="text"
            value={formData.name}
            placeholder="Digite seu nome..."
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
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
            minLength={6}
          />
          <Input
            label="Confirmar Senha"
            type="password"
            value={formData.confirmPassword}
            placeholder="Confirme sua senha..."
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
            minLength={6}
          />
        </InputFlexWrapper>

        {/* Campo tipo de usuário */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500',
            color: '#333'
          }}>
            Tipo de Conta:
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
            required
          >
            <option value="">Selecione um tipo</option>
            <option value="estudante">Estudante</option>
            <option value="professor">Professor</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>

        {authError && (
          <p style={{ 
            color: "red", 
            fontSize: "0.9rem", 
            marginTop: "8px",
            padding: "0.5rem",
            backgroundColor: "#ffe6e6",
            borderRadius: "4px",
            border: "1px solid #ffcccc"
          }}>
            {authError}
          </p>
        )}

        <SubmitButton
          title={
            loading ? (
              <>
                <span className="spinner" /> Registrando...
              </>
            ) : (
              "Confirmar Cadastro"
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