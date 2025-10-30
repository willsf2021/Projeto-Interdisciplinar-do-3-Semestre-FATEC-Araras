// pages/Home/Home.jsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Header } from "../../components/Home/Header";
import { SearchBar } from "../../components/Home/SearchBar/";
import { EmptyState } from "../../components/Home/EmptyState/";
import { ToggleSwitch } from "../../components/Home/ToggleSwicth";
import { FloatingButton } from "../../components/Home/FloatingButton/";
import { HomeContainer, MainSection } from "./style";

import { FilePlusFill, PersonPlusFill } from "react-bootstrap-icons";

export const Home = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const { user, loading } = useAuth();

  // 🛡️ A proteção da rota é AUTOMÁTICA pelo AuthContext
  // Se não estiver autenticado, será redirecionado automaticamente

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Carregando...</div>
      </div>
    );
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