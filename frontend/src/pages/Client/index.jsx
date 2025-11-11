import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormWrapper } from "../../components/Forms/FormWrappers/styles";
import { Input } from "../../components/Forms/Input";
import { InputFlexWrapper } from "../../components/Forms/FormWrappers/styles";
import { SubmitButton } from "../../components/Forms/SubmitButton";
import { Container } from "./style";
import { HouseFill } from "react-bootstrap-icons";
import { useApi } from "../../hooks/useApi";

export const Client = () => {
  const navigate = useNavigate();
  const { apiFetchJson } = useApi();

  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    celular: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleHome = () => {
    navigate("/home");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpa mensagens de erro quando o usuário começar a digitar
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validação básica
    if (!formData.nome_completo.trim() || !formData.email.trim()) {
      setError("Nome completo e e-mail são obrigatórios");
      setLoading(false);
      return;
    }

    // Validação de email simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um e-mail válido");
      setLoading(false);
      return;
    }

    try {
      const url = `http://localhost:8000/api/criar-cliente/`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(formData),
      };

      const response = await apiFetchJson(url, options);

      console.log("Cliente cadastrado com sucesso:", response);

      setFormData({
        nome_completo: "",
        email: "",
        celular: "",
      });
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setError(error.message || "Erro ao cadastrar cliente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Cadastrar Cliente</h3>
        </div>

        {/* Mensagens de feedback */}
        {error && <div className="error-message">{error}</div>}

        {success && (
          <div className="success-message">Cliente cadastrado com sucesso!</div>
        )}

        <div className="step-content">
          <div className="step-content-inner">
            <InputFlexWrapper>
              <Input
                name="nome_completo"
                label="Nome Completo"
                type="text"
                value={formData.nome_completo}
                placeholder="Digite o nome completo..."
                onChange={handleInputChange}
                required
                disabled={loading}
              />

              <Input
                name="email"
                label="E-mail"
                type="email"
                value={formData.email}
                placeholder="Digite o e-mail..."
                onChange={handleInputChange}
                required
                disabled={loading}
              />

              <Input
                name="celular"
                label="Celular (Opcional)"
                type="tel"
                value={formData.celular}
                placeholder="Digite o celular..."
                onChange={handleInputChange}
                disabled={loading}
              />
            </InputFlexWrapper>
          </div>

          {/* Botão Cadastrar Cliente */}
          <div className="submit-button-container">
            <SubmitButton
              title={loading ? "Cadastrando..." : "Cadastrar Cliente"}
              disabled={loading}
              type="submit"
            />
          </div>
        </div>
      </FormWrapper>

      {/* Botão Home - fica fixo na parte inferior centralizada */}
      <div className="home-button-container">
        <button
          type="button"
          onClick={handleHome}
          className="home-button"
          disabled={loading}
        >
          <HouseFill />
        </button>
      </div>
    </Container>
  );
};
