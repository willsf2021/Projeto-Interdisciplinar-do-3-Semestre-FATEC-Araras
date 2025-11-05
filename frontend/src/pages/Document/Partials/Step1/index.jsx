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
  };

  const handleSubmit = async (e) => {
    // TODO: Implementar chamada à API para cadastrar cliente
    e.preventDefault()
    console.log("Cadastrando cliente:", formData);

    // Mock: Simular cadastro bem-sucedido
    const novoCliente = {
      nome_completo: formData.nome_completo,
      email: formData.email,
      celular: formData.celular,
    };

    try {
      let url = `http://localhost:8000/api/criar-cliente/`;

      let options = {
        method: "POST",
        data: novoCliente,
      };

      const data = await apiFetchJson(url, options);
      const response = await data.json();
      console.log(response);
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      // Fallback para o cache local
    }

    console.log(
      "ATUALIZAR SELECT: CustomSelect deve ser atualizado para mostrar o cliente:",
      novoCliente
    );
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setFormData({
        nome_completo: "",
        email: "",
        celular: "",
      });
    }
  };

  return (
    <Container>
      <div className="step-content">
        <h3>Cliente</h3>
      </div>
      <HeaderWrapper>
        <div className="select-container">
          {!showForm && (
            <SelectContainer className="select-enter">
              <CustomSelect
                endpoint={"listar-clientes"}
                placeholder={"clientes"}
                type={"clients"}
                icon={<Search />}
              />
            </SelectContainer>
          )}
        </div>

        <button className="btn-add-client" onClick={handleToggleForm}>
          <PersonPlus className="btn-icon" />
          {showForm ? "Cancelar" : "Novo Cliente"}
        </button>
      </HeaderWrapper>

      {showForm && (
        <FormWrapper onSubmit={handleSubmit}>
          <div className="form-header">
            <h4> Novo Cliente</h4>
          </div>
          <InputFlexWrapper>
            <Input
              name="nome_completo"
              label="Nome Completo"
              type="text"
              value={formData.nome_completo}
              placeholder="Digite o nome completo..."
              onChange={handleInputChange}
              
            />

            <Input
              name="email"
              label="E-mail"
              type="text"
              value={formData.email}
              placeholder="Digite o e-mail..."
              onChange={handleInputChange}
              
            />

            <Input
              name="celular"
              label="Celular (Opcional)"
              type="tel"
              value={formData.celular}
              placeholder="Digite o celular..."
              onChange={handleInputChange}
            />
          </InputFlexWrapper>
          <SubmitButton
            title="Cadastrar Cliente"
            disabled={false}
            type="submit"
          />
        </FormWrapper>
      )}
    </Container>
  );
};
