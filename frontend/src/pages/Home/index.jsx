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
import { List } from "../../components/Home/List"; // Novo componente
import {
  HomeContainer,
  MainSection,
  ScrollContainer,
  FixedBottom,
} from "./style";
import { Search, FilePlusFill, PersonPlusFill } from "react-bootstrap-icons";

export const Home = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de busca
  const { user, isAuthenticated, loading } = useAuth();
  const { clients, documents, loading: dataLoading } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Função para lidar com seleção no CustomSelect
  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label || "");
    } else {
      setSearchTerm("");
    }
  };

  // Função para lidar com clique em um item da lista
  const handleItemClick = (item) => {
    if (activeTab === "documents") {
      navigate(`/document/${item.id}`);
    } else {
      navigate(`/client/${item.id}`);
    }
  };

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

  const currentItems = activeTab === "documents" ? documents : clients;
  const hasItems = currentItems && currentItems.length > 0;

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
          onSelectChange={handleSelectChange}
        />

        <ScrollContainer>
          {" "}
          {/* ENVOLVA apenas o conteúdo scrollável */}
          {dataLoading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Carregando dados...
            </div>
          ) : (
            <>
              {hasItems ? (
                <List
                  type={activeTab}
                  items={currentItems}
                  searchTerm={searchTerm}
                  onItemClick={handleItemClick}
                />
              ) : activeTab === "documents" ? (
                <EmptyState
                  text='Clique aqui para "Criar novo documento" e aproveite o melhor do sistema!'
                  linkText="Criar novo documento"
                  linkHref="/document"
                />
              ) : (
                <EmptyState
                  text='Clique aqui para "Adicionar novo Cliente" e aproveite o melhor do sistema!'
                  linkText="Adicionar novo Cliente"
                  linkHref="/client"
                />
              )}
            </>
          )}
        </ScrollContainer>

        {/* MOVER o ToggleSwitch para o FixedBottom - FORA do ScrollContainer */}
        <FixedBottom>
          {/* Floating Button */}
          {activeTab === "documents" ? (
            <FloatingButton icon={<FilePlusFill />} href="/document" />
          ) : (
            <FloatingButton icon={<PersonPlusFill />} href="/client" />
          )}
          <ToggleSwitch
            options={[
              { value: "documents", label: "Documentos" },
              { value: "clients", label: "Clientes" },
            ]}
            activeOption={activeTab}
            onChange={setActiveTab}
          />
        </FixedBottom>
      </MainSection>
    </HomeContainer>
  );
};
