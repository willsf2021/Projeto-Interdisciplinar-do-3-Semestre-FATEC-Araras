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

export const Step1 = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectKey, setSelectKey] = useState(0); // Key para forçar recriação do Select
  const { apiFetchJson } = useApi();

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

  const handleSelectChange = (selectedOption) => {
    setSelectedClient(selectedOption);
    console.log("Cliente selecionado:", selectedOption);
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

      console.log("Cliente cadastrado com sucesso:", response);

      // Cria o objeto no formato que o CustomSelect espera
      const novoClienteOption = {
        value: response.id,
        label: response.nome_completo,
        data: response // Inclui todos os dados para referência futura
      };

      // Seta o cliente recém-cadastrado como selecionado
      setSelectedClient(novoClienteOption);
      
      // Força a recriação do CustomSelect para garantir que ele atualize
      setSelectKey(prev => prev + 1);

      // Limpa o formulário e esconde
      setFormData({
        nome_completo: "",
        email: "",
        celular: "",
      });
      setShowForm(false);

      console.log("Cliente selecionado automaticamente:", novoClienteOption);

    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setError(error.message || "Erro ao cadastrar cliente. Tente novamente.");
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
      <div className="step-content">
        <h3>Cliente</h3>
      </div>
      
      {/* Exibir cliente selecionado quando não estiver no formulário */}
      {!showForm && selectedClient && (
        <div className="selected-client-info" style={{ 
          padding: '10px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '5px', 
          marginBottom: '10px',
          border: '1px solid #d1ecf1'
        }}>
          <p style={{ margin: 0 }}><strong>Cliente selecionado:</strong> {selectedClient.label}</p>
          <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
            {selectedClient.data?.email} {selectedClient.data?.celular && `• ${selectedClient.data.celular}`}
          </p>
        </div>
      )}

      <HeaderWrapper>
        <div className="select-container">
          {!showForm && (
            <SelectContainer className="select-enter">
              <CustomSelect
                key={selectKey} // Key para forçar recriação quando mudar
                endpoint={"listar-clientes"}
                placeholder={"clientes"}
                type={"clients"}
                onSelectChange={handleSelectChange}
                value={selectedClient} // Passa o cliente selecionado
                icon={<Search />}
              />
            </SelectContainer>
          )}
        </div>

        <button 
          className="btn-add-client" 
          onClick={handleToggleForm}
          disabled={loading}
        >
          <PersonPlus className="btn-icon" />
          {showForm ? "Cancelar" : "Novo Cliente"}
        </button>
      </HeaderWrapper>

      {showForm && (
        <FormWrapper onSubmit={handleSubmit}>
          <div className="form-header">
            <h4>Novo Cliente</h4>
          </div>

          {/* Mensagens de feedback */}
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