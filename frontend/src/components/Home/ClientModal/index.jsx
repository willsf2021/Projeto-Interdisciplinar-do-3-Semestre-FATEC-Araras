// components/Home/ClientModal/index.jsx
import { useState, useEffect } from "react";
import {
  ModalOverlay,
  EditModal,
  ModalActions,
} from "./style";
import { Input } from "../../Forms/Input";
import { useNotification } from "../../../hooks/useNotification";

export const ClientModal = ({ client, loading, error, onClose, onUpdateClient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    celular: ""
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const { notify } = useNotification();

  // Preenche o formData quando o cliente é carregado
  useEffect(() => {
    if (client) {
      setFormData({
        nome_completo: client.nome_completo || "",
        email: client.email || "",
        celular: client.celular || ""
      });
    }
  }, [client]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reverte os dados para os originais
    setFormData({
      nome_completo: client.nome_completo || "",
      email: client.email || "",
      celular: client.celular || ""
    });
  };

  const handleSave = async () => {
    if (!client?.id) return;

    setUpdateLoading(true);
    try {
      const result = await onUpdateClient(client.id, formData);
      
      if (result.success) {
        notify("Cliente atualizado com sucesso!", "success");
        setIsEditing(false);
        onClose(); // Fecha o modal após salvar
      } else {
        notify(result.error || "Erro ao atualizar cliente", "error");
      }
    } catch (error) {
      notify("Erro ao atualizar cliente", "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <EditModal>
        <h3>{isEditing ? "Editar Cliente" : "Detalhes do Cliente"}</h3>
        
        {loading && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Carregando dados do cliente...
          </div>
        )}

        {error && (
          <div className="error-message" style={{ textAlign: "center", margin: "1rem 0" }}>
            {error}
          </div>
        )}

        {client && !loading && (
          <>
            <div className="input-container">
              <Input
                label="Nome Completo"
                type="text"
                value={formData.nome_completo}
                onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                readOnly={!isEditing}
                disabled={!isEditing || updateLoading}
              />
            </div>

            <div className="input-container">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                readOnly={!isEditing}
                disabled={!isEditing || updateLoading}
              />
            </div>

            <div className="input-container">
              <Input
                label="Celular"
                type="tel"
                value={formData.celular}
                onChange={(e) => handleInputChange('celular', e.target.value)}
                readOnly={!isEditing}
                disabled={!isEditing || updateLoading}
              />
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "1rem",
              marginTop: "1rem"
            }}>
              <div>
                <small>
                  <strong>Criado em:</strong><br />
                  {new Date(client.created_at).toLocaleDateString('pt-BR')}
                </small>
              </div>
              <div>
                <small>
                  <strong>Atualizado em:</strong><br />
                  {new Date(client.updated_at).toLocaleDateString('pt-BR')}
                </small>
              </div>
            </div>
          </>
        )}

        <ModalActions>
          {isEditing ? (
            <>
              <button
                className="cancel-btn"
                onClick={handleCancel}
                disabled={updateLoading}
              >
                Cancelar
              </button>
              <button
                className="confirm-btn"
                onClick={handleSave}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </button>
            </>
          ) : (
            <>
              <button
                className="cancel-btn"
                onClick={onClose}
              >
                Fechar
              </button>
              <button
                className="confirm-btn"
                onClick={handleEdit}
              >
                Editar
              </button>
            </>
          )}
        </ModalActions>
      </EditModal>
    </ModalOverlay>
  );
};