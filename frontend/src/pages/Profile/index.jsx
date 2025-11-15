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

import { Container, BackButton } from "./style";

import { authService } from "../../services/authService";

import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../hooks/useNotification";

export const Profile = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { apiFetchJson } = useApi();
  const {notify} = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    avatar_url: "",
  });

  // --- Buscar dados do usuário ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await authService.getUser();
        //console.log("Retorno completo do getUser:", response);

        const user = response.data ?? {};
        //console.log("O user esta retornando corretamente!", user);

        setFormData({
          name: user.name ?? "",
          avatar_url: user.avatar_url ?? "",
        });
        setPreview(user.avatar_url ?? null);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // --- Atualizar imagem localmente ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  // --- Atualizar perfil ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      };

      const response = await apiFetchJson(
        "http://localhost:8000/api/update-user/",
        options
      );

      const user = response ?? {};

      setFormData({
        name: user.name ?? "",
        avatar_url: user.avatar_url ?? "",
      });
      notify("Dados do usuário alterados com sucesso!", "success");
    } catch (error) {
      console.log(error)
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Logout ---
  const handleLogout = () => {
    authService.logout();
  };

  // --- Excluir conta ---
  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta?")) {
      try {
        await authService.deleteAccount();
        alert("Conta excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        alert("Não foi possível excluir a conta.");
      }
    }
  };

  return (
    <Container>
      <header>
        <BackButton type="button" onClick={() => navigate("/home")}>
          <ArrowLeft size={32} />
        </BackButton>
      </header>

      <FormWrapper onSubmit={handleSubmit}>
        <div className="profile-image">
          <label htmlFor="imageUpload">
            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Foto de perfil"
            />
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="step-content">
          <div className="step-content-inner">
            <InputFlexWrapper>
              <Input
                label="Nome"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />

            </InputFlexWrapper>
          </div>
        </div>

        <SubmitButton title={"Salvar"} type="submit" variant="submit" />

        <footer>
          <SubmitButton
            title={"Excluir Conta"}
            type="submit"
            variant="background_transparent"
          />
        </footer>
      </FormWrapper>
    </Container>
  );
};
