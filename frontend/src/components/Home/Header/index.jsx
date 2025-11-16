// components/Home/Header/index.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../hooks/useNotification";
import {
  HeaderContainer,
  AvatarContainer,
  GreetingMessage,
  LogoutContainer,
  LogoutLink,
} from "./style";

import { PersonCircle, BoxArrowLeft, GearFill } from "react-bootstrap-icons";

export const Header = ({ userName }) => {
  const [loading, setLoading] = useState(false);
  const { logout, user } = useAuth();
  const { notify } = useNotification();
  const [avatarUrl, setAvatarUrl] = useState("");

  const navigate = useNavigate();

  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("pt-BR", options).format(today);

  const handleLogout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🚪 Usuário solicitou logout...");
      const result = await logout();

      if (result?.success) {
        notify("Logout realizado com sucesso!", "success");
        console.log("✅ Logout bem-sucedido, redirecionando...");
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      notify("Erro ao fazer logout", "error");
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.name || userName;
  useEffect(() => {
    buildAvatarUrl(user?.avatar_url);
  }, []);
  // Função para construir a URL completa do avatar
  function buildAvatarUrl(avatarPath) {
    if (!avatarPath) return null;
    const avatarPathFinal = "";
    // Se já for uma URL completa, retorna como está
    if (avatarPath.startsWith("http")) {
      setAvatarUrl(avatarPath);
      return;
    }
    const baseUrl = import.meta.env.VITE_API_URL;
    setAvatarUrl(`${baseUrl}${avatarPath}`);
    console.log(`${baseUrl}${avatarPath}`);
    return;
  }

  return (
    <HeaderContainer>
      <AvatarContainer
        onClick={() => navigate("/profile")} // ✅ redireciona ao clicar
        style={{ cursor: "pointer" }} // 💡 indica que é clicável
        title="Ver perfil"
      >
        <div className="avatar-wrapper">
          <div className="avatar-image">
            <img src={avatarUrl} alt="" />
          </div>
          <div className="edit-icon">
            <GearFill size={12} />
          </div>
        </div>
      </AvatarContainer>

      <GreetingMessage>
        <p>
          Olá, <strong>{displayName}</strong>, Seja bem-vindo(a)!
        </p>
        <small>Hoje é {formattedDate}</small>
      </GreetingMessage>

      <LogoutContainer>
        <LogoutLink
          href="#"
          onClick={handleLogout}
          disabled={loading}
          title="Sair do sistema"
        >
          {loading ? (
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid currentColor",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          ) : (
            <BoxArrowLeft />
          )}
        </LogoutLink>
      </LogoutContainer>
    </HeaderContainer>
  );
};
