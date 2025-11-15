// components/Home/Header/index.jsx
import { useState } from "react";
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

import { PersonCircle, BoxArrowLeft } from "react-bootstrap-icons";

export const Header = ({ userName }) => {
  const [loading, setLoading] = useState(false);
  const { logout, user } = useAuth();
  const { notify } = useNotification();
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

  return (
    <HeaderContainer>
      <AvatarContainer
        onClick={() => navigate("/profile")} // ✅ redireciona ao clicar
        style={{ cursor: "pointer" }} // 💡 indica que é clicável
        title="Ver perfil"
      >
        <PersonCircle size={46} />
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
