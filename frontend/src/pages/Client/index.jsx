import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormWrapper } from "../../components/Forms/FormWrappers/styles";
import { Input } from "../../components/Forms/Input";
import { InputFlexWrapper } from "../../components/Forms/FormWrappers/styles";
import { SubmitButton } from "../../components/Forms/SubmitButton";
import { Container } from "./style";
import { HouseFill } from "react-bootstrap-icons";
import { useApi } from "../../hooks/useApi";
import { useData } from "../../contexts/DataContext";
import { useNotification } from "../../hooks/useNotification";

export const Client = () => {
  const navigate = useNavigate();
  const { apiFetchJson } = useApi();

  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    celular: "",
  });

  const [loading, setLoading] = useState(false);

  const { refreshData } = useData();
  const { notify } = useNotification();

  const handleHome = () => {
    navigate("/home");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validação básica
    if (!formData.nome_completo.trim() || !formData.email.trim()) {
      notify("Nome completo e e-mail são obrigatórios", "error");
      setLoading(false);
      return;
    }

    // Validação de email simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      notify("Por favor, insira um e-mail válido", "error");
      setLoading(false);
      return;
    }

    try {
      const url = `${import.meta.env.VITE_API_URL}/criar-cliente/`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(formData),
      };

      const response = await apiFetchJson(url, options);

      setFormData({
        nome_completo: "",
        email: "",
        celular: "",
      });

      notify("Cliente cadastrado com sucesso!", "success");
      await refreshData("clients");
    } catch (error) {
      notify("Erro ao cadastrar cliente, tente novamente!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper onSubmit={handleSubmit} id="client-form">
        <div className="form-header">
          <h3>Cadastrar Cliente</h3>
        </div>

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
        </div>
      </FormWrapper>

      {/* Botões de controle - mesmo estilo do Document */}
      <div className="control-buttons">
        <div className="container-control-home">
          <button onClick={handleHome} disabled={loading}>
            <HouseFill />
          </button>
        </div>
        <div className="container-control-button">
          <SubmitButton
            title={loading ? "Cadastrando..." : "Cadastrar Cliente"}
            disabled={loading}
            type="submit"
            form="client-form"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Container>
  );
};