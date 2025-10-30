// pages/Home/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { Header } from "../../components/Home/Header";
import { SearchBar } from "../../components/Home/SearchBar/";
import { EmptyState } from "../../components/Home/EmptyState/";
import { ToggleSwitch } from "../../components/Home/ToggleSwicth";
import { FloatingButton } from "../../components/Home/FloatingButton/";
import { CustomSelect } from "../../components/Home/CustomSelect";
import { HomeContainer, MainSection } from "./style";
import { Search } from "react-bootstrap-icons";
import { FilePlusFill, PersonPlusFill } from "react-bootstrap-icons";

export const Home = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const { user, isAuthenticated, loading } = useAuth();
  const { clients, documents, loading: dataLoading } = useData();
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
        <div>Carregando autenticação...</div>
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
        <CustomSelect
          endpoint={
            activeTab === "documents" ? "listar-documentos" : "listar-clientes"
          }
          placeholder={activeTab === "documents" ? "documentos" : "clientes"}
          type={activeTab}
          icon={<Search />}
        />

        {dataLoading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            Carregando dados...
          </div>
        ) : (
          <>
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
