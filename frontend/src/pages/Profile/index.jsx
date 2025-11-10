import { useState, useEffect } from "react";

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
import { Container } from "./style";

export const Profile = () => {
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "Renan Augusto Eugenio Marques",
    email: "renanmarques894@gmail.com",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados salvos:", formData);
    // Aqui você pode integrar com o backend
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta?")) {
      console.log("Conta excluída");
    }
  };

  return (
    <Container>
      {/* Imagem de perfil */}
      <div className="profile-image">
        <label htmlFor="imageUpload">
          <img
            src={
              preview || "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="Foto de perfil"
          />
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImage}
        />
      </div>
      
      <FormWrapper>
        <div className="step-content">
          <div className="step-content-inner">
            <InputFlexWrapper>
              <Input
                label="Nome"
                type="password"
                value={formData.password}
                placeholder="Digite sua senha..."
                onChange={(e) => handleChange("password", e.target.value)}
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
            </InputFlexWrapper>
          </div>
        </div>

        <SubmitButton title="Sair" type="submit" />

        <button className="deleteAccount" title="deleteAccount" type="submit">
          Excluir Conta
        </button>
      </FormWrapper>

      
    </Container>
  );
};
