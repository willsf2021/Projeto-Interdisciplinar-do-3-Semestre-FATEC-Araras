import React, { useState } from "react";
import { Search, PersonPlus } from "react-bootstrap-icons";
import { Input } from "../../../../components/Forms/Input";
import { SubmitButton } from "../../../../components/Forms/SubmitButton/index.jsx";
import { CustomSelect } from "../../../../components/Home/CustomSelect";
import {
  FormWrapper,
  InputFlexWrapper,
} from "../../../../components/Forms/FormWrappers/styles.js";
import { Container, HeaderWrapper, SelectContainer } from "./style.js";
import { useApi } from "../../../../hooks/useApi.js";
import { useNotification } from "../../../../hooks/useNotification";

export const Step4 = ({ documentoData, onDocumentoDataChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); // Estado local para o select
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectKey, setSelectKey] = useState(0);
  const { apiFetchJson } = useApi();
  const { notify } = useNotification();

  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    celular: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  // ALTERADO: Atualizar tanto o estado local quanto o global
  const handleSelectChange = (selectedOption) => {
    setSelectedClient(selectedOption);
    
    if (selectedOption) {
      onDocumentoDataChange({ 
        cliente: {
          id: selectedOption.value,
          nome: selectedOption.label,
          email: selectedOption.data?.email,
          celular: selectedOption.data?.celular
        }
      });
    } else {
      onDocumentoDataChange({ cliente: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.nome_completo.trim() || !formData.email.trim()) {
      setError("Nome completo e e-mail são obrigatórios");
      notify("Nome completo e e-mail são obrigatórios", "error");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um e-mail válido");
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

      // ALTERADO: Criar objeto completo do cliente
      const novoCliente = {
        id: response.id,
        nome: response.nome_completo,
        email: response.email,
        celular: response.celular
      };

      const novoClienteOption = {
        value: response.id,
        label: response.nome_completo,
        data: response
      };

      // Atualiza ambos os estados
      setSelectedClient(novoClienteOption);
      onDocumentoDataChange({ cliente: novoCliente });
      setSelectKey(prev => prev + 1);

      setFormData({
        nome_completo: "",
        email: "",
        celular: "",
      });
      setShowForm(false);

      notify("Cliente cadastrado com sucesso!", "success");

    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setError(error.message || "Erro ao cadastrar cliente. Tente novamente.");
      notify("Erro ao cadastrar cliente. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setFormData({
        nome_completo: "",
        email: "",
        celular: "",
      });
      setError("");
    }
  };

  return (
    <Container>
      <div className="step-content"></div>


      <HeaderWrapper>
        <div className="select-container">
          {!showForm && (
            <SelectContainer className="select-enter">
              <CustomSelect
                key={selectKey}
                endpoint={"listar-clientes"}
                placeholder={""}
                type={"clients"}
                onSelectChange={handleSelectChange}
                value={selectedClient} // Usa o estado local
                icon={<Search />}
                />
            </SelectContainer>
          )}
        </div>

        <button 
          className="btn-add-client fade-in" 
          onClick={handleToggleForm}
          disabled={loading}
        >
          <PersonPlus className="btn-icon" />
          {showForm ? "Cancelar" : "Novo Cliente"}
        </button>
      </HeaderWrapper>

          {!showForm && documentoData.cliente && (
            <div className="selected-client-info" style={{ 
              padding: '10px', 
              backgroundColor: '#f0f8ff', 
              borderRadius: '5px', 
              marginBottom: '10px',
              border: '1px solid #d1ecf1'
            }}>
              <p style={{ margin: 0 }}><strong>Cliente selecionado:</strong> {documentoData.cliente.nome}</p>
              <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
                {documentoData.cliente.email} {documentoData.cliente.celular && `• ${documentoData.cliente.celular}`}
              </p>
            </div>
          )}
      {showForm && (
        <FormWrapper onSubmit={handleSubmit}>
          <div className="form-header">
            <h4>Novo Cliente</h4>
          </div>

          {error && <div className="error-message">{error}</div>}

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
          
          <SubmitButton
            title={loading ? "Cadastrando..." : "Cadastrar Cliente"}
            disabled={loading}
            type="submit"
          />
        </FormWrapper>
      )}
    </Container>
  );
};