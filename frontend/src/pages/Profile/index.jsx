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

// Função para construir a URL completa do avatar
const buildAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  
  // Se já for uma URL completa, retorna como está
  if (avatarPath.startsWith('http')) return avatarPath;
  
  // Se for um caminho relativo, constrói a URL completa
  const baseUrl = import.meta.env.VITE_API_URL;
  console.log(`${baseUrl}${avatarPath}`)
  return `${baseUrl}${avatarPath}`;
};

export const Profile = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const { apiFetchJson, apiFetch } = useApi();
  const { notify } = useNotification();
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
        const user = response.data ?? {};

        // Usa a função buildAvatarUrl para garantir URL completa
        const fullAvatarUrl = buildAvatarUrl(user.avatar_url);

        setFormData({
          name: user.name ?? "",
          avatar_url: fullAvatarUrl ?? "",
        });
        setPreview(fullAvatarUrl);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // --- Atualizar avatar IMEDIATAMENTE quando selecionar uma imagem ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview imediato
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      setAvatarLoading(true);
      
      const formData = new FormData();
      formData.append('avatar', file);

      // Usa URL base da variável de ambiente ou fallback para localhost
      const apiBaseUrl =  import.meta.env.VITE_API_URL;
      const response = await apiFetch(
        `${apiBaseUrl}/update-avatar/`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {

        const fullAvatarUrl = buildAvatarUrl(data.avatar_url);
        
        notify("Foto de perfil atualizada com sucesso!", "success");
        setFormData(prev => ({
          ...prev,
          avatar_url: fullAvatarUrl
        }));
      } else {
        throw new Error(data.erro || 'Erro ao atualizar avatar');
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      notify(error.message, "error");
      // Reverte o preview em caso de erro
      setPreview(formData.avatar_url);
    } finally {
      setAvatarLoading(false);
    }
  };

  // --- Atualizar perfil (nome) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Usa URL base da variável de ambiente ou fallback para localhost
      const apiBaseUrl = import.meta.env.VITE_API_URL

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name
        }),
      };

      const response = await apiFetchJson(
        `${apiBaseUrl}/update-user/`,
        options
      );

      const user = response ?? {};

      setFormData(prev => ({
        ...prev,
        name: user.name ?? prev.name,
      }));
      
      notify("Dados do usuário alterados com sucesso!", "success");
    } catch (error) {
      console.log(error);
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
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
            {avatarLoading && (
              <div className="upload-overlay">
                <div className="spinner">Enviando...</div>
              </div>
            )}
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            disabled={avatarLoading}
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
                disabled={loading}
              />
            </InputFlexWrapper>
          </div>
        </div>

        <SubmitButton 
          title={loading ? "Salvando..." : "Salvar"} 
          type="submit" 
          variant="submit" 
          disabled={loading}
        />

        <footer>
          <SubmitButton
            title={"Excluir Conta"}
            type="button"
            variant="background_transparent"
            onClick={handleDelete}
          />
        </footer>
      </FormWrapper>
    </Container>
  );
};