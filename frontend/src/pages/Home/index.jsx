// pages/Home/Home.jsx
import { useState, useEffect  } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Home/Header";
import { SearchBar } from "../../components/Home/SearchBar/";
import { EmptyState } from "../../components/Home/EmptyState/";
import { ToggleSwitch } from "../../components/Home/ToggleSwicth";
import { FloatingButton } from "../../components/Home/FloatingButton/";
import { HomeContainer, MainSection } from "./style";

import { FilePlusFill, PersonPlusFill } from "react-bootstrap-icons";

export const Home = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <HomeContainer>
      <Header userName={user?.name} />

      <MainSection>
        <SearchBar placeholder="Buscar..." />

        {activeTab === "documents" ? (
          <>
            <EmptyState
              text='Clique aqui para "Criar novo documento" e aproveite o melhor do sistema!'
              linkText="Criar novo documento"
              linkHref="/document.html"
            />
            <FloatingButton icon={<FilePlusFill />} href="/document" />
          </>
        ) : (
          <>
            <EmptyState
              text='Clique aqui para "Adicionar novo Cliente" e aproveite o melhor do sistema!'
              linkText="Adicionar novo Cliente"
            />
            <FloatingButton icon={<PersonPlusFill />} href="/client" />
          </>
        )}

        <ToggleSwitch
          options={[
            { value: "documents", label: "Documentos" },
            { value: "clients", label: "Clientes" },
          ]}
          activeOption={activeTab}
          onChange={setActiveTab}
        />
      </MainSection>
    </HomeContainer>
  );
};
