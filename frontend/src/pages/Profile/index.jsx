import { useState, useEffect } from "react";
import {
  FormWrapper,
  InputFlexWrapper,
} from "../../components/Forms/FormWrappers/styles";
import { Input } from "../../components/Forms/Input";
import { SubmitButton } from "../../components/Forms/SubmitButton";
import { Container, BackButton } from "./style";
import { authService } from "../../services/authService";
import { ArrowLeft, PencilFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../hooks/useNotification";
import { useAuth } from "../../contexts/AuthContext";

export const Profile = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [nameLoading, setNameLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { apiFetch } = useApi();
  const { notify } = useNotification();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [editName, setEditName] = useState("");

  const { user, updateUserAvatar, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    avatar_url: "",
  });

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setConfirmationText("");
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setConfirmationText("");
  };

  const openEditModal = () => {
    setEditName(formData.name);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditName("");
  };

  // --- Buscar dados do usuário ---
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        avatar_url: user.avatar_url || "",
      });
      setPreview(user.avatar_url);
    }
  }, [user]);

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
      formData.append("avatar", file);

      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const response = await apiFetch(`${apiBaseUrl}/update-avatar/`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        notify("Foto de perfil atualizada com sucesso!", "success");
        setFormData((prev) => ({
          ...prev,
          avatar_url: data.avatar_url,
        }));

        if (updateUserAvatar) {
          updateUserAvatar(data.avatar_url);
        }
      } else {
        throw new Error(data.erro || "Erro ao atualizar avatar");
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      notify(error.message, "error");
      setPreview(formData.avatar_url);
    } finally {
      setAvatarLoading(false);
    }
  };

  // --- Atualizar perfil (nome) ---
  const handleEditName = async () => {
    if (!editName.trim()) {
      notify("Por favor, insira um nome válido", "warning");
      return;
    }

    try {
      setNameLoading(true);

      const apiBaseUrl = import.meta.env.VITE_API_URL;

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
        }),
      };

      const response = await apiFetch(`${apiBaseUrl}/update-user/`, options);

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          name: data.name || editName,
        }));

        if (updateUserProfile) {
          updateUserProfile({
            name: data.name || editName,
          });
        }

        notify("Nome alterado com sucesso!", "success");
        closeEditModal();
      } else {
        throw new Error(data.erro || "Erro ao atualizar perfil");
      }
    } catch (error) {
      console.log(error);
      notify(error.message, "error");
    } finally {
      setNameLoading(false);
    }
  };

  // --- Excluir conta ---
  const handleDelete = async () => {
    if (confirmationText !== "DELETAR") {
      return;
    }

    try {
      setDeleteLoading(true);
      const result = await authService.deleteAccount();

      if (result.status === 200) {
        notify("✅ Conta desativada com sucesso! Redirecionando...", "success");
        closeDeleteModal();

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        throw new Error(result.data?.erro || "Erro ao desativar conta");
      }
    } catch (error) {
      console.error("Erro ao desativar conta:", error);
      notify(`❌ ${error.message}`, "error");
      closeDeleteModal();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Container>
      <header>
        <BackButton type="button" onClick={() => navigate("/home")}>
          <ArrowLeft size={32} />
        </BackButton>
      </header>

      <FormWrapper>
        <div className="profile-image">
          <label id="avatar-wrapper" htmlFor="imageUpload">
            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Foto de perfil"
            />
            {avatarLoading && (
              <div className="upload-overlay">
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
              </div>
            )}
            <div className="edit-icon">
              <PencilFill />
            </div>
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

        <div className="user-info">
          <h2>{formData.name}</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Tipo de Usuário:</span>
              <span className="value">
                {user?.type?.charAt(0).toUpperCase() + user?.type?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="actions-container">
          <SubmitButton
            title={"Editar Nome"}
            type="button"
            variant="submit"
            onClick={openEditModal}
            disabled={avatarLoading}
          />
          
          <SubmitButton
            title={"Excluir Conta"}
            type="button"
            variant="background_transparent"
            onClick={openDeleteModal}
            disabled={avatarLoading}
          />
        </div>
      </FormWrapper>

      {/* Modal de Edição de Nome */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>Editar Nome</h3>
            <p>Digite seu novo nome abaixo:</p>

            <div className="input-container">
              <Input
                label="Nome"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                disabled={nameLoading}
                autoFocus
              />
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={closeEditModal}
                disabled={nameLoading}
              >
                Cancelar
              </button>
              <button
                className="confirm-btn"
                onClick={handleEditName}
                disabled={nameLoading || !editName.trim()}
              >
                {nameLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Desativar Conta</h3>
            <p>
              Tem certeza que deseja desativar sua conta? Esta ação não pode ser
              desfeita.
            </p>

            <div className="consequences">
              <p>• Sua conta será desativada imediatamente</p>
              <p>• Você não poderá mais fazer login</p>
              <p>• Seus dados pessoais serão removidos</p>
            </div>

            <div className="confirmation-input">
              <label>
                Digite <strong>DELETAR</strong> para confirmar:
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="DELETAR"
                disabled={deleteLoading}
              />
              {confirmationText !== "DELETAR" && confirmationText !== "" && (
                <div className="error-message">
                  Digite exatamente "DELETAR" para confirmar
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Cancelar
              </button>
              <button
                className="delete-btn"
                onClick={handleDelete}
                disabled={confirmationText !== "DELETAR" || deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    Excluindo...
                  </>
                ) : (
                  "Desativar Conta"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};