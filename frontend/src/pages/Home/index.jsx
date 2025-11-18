// pages/Home/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { useApi } from "../../hooks/useApi";
import { Header } from "../../components/Home/Header";
import { SearchBar } from "../../components/Home/SearchBar/";
import { EmptyState } from "../../components/Home/EmptyState/";
import { ToggleSwitch } from "../../components/Home/ToggleSwicth";
import { FloatingButton } from "../../components/Home/FloatingButton/";
import { CustomSelect } from "../../components/Home/CustomSelect";
import { List } from "../../components/Home/List";
import { ClientModal } from "../../components/Home/ClientModal";
import {
  HomeContainer,
  MainSection,
  ScrollContainer,
  FixedBottom,
} from "./style";
import { Search, FilePlusFill, PersonPlusFill } from "react-bootstrap-icons";

export const Home = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated, loading } = useAuth();
  const { apiFetch, apiFetchJson } = useApi();
  
  // Estados para o modal do cliente
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError, setClientError] = useState(null);

  const { clients, documents, loading: dataLoading, refreshData } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label || "");
    } else {
      setSearchTerm("");
    }
  };

  // Função para buscar dados do cliente pela API
  const fetchClientData = async (clientId) => {
    setClientLoading(true);
    setClientError(null);
    
    try {
      const clientData = await apiFetchJson(`${import.meta.env.VITE_API_URL}/detalhes-cliente/${clientId}/`);
      setSelectedClient(clientData);
      setShowClientModal(true);
    } catch (error) {
      console.error("Erro ao buscar dados do cliente:", error);
      setClientError("Erro ao carregar dados do cliente");
    } finally {
      setClientLoading(false);
    }
  };

  // Função para atualizar dados do cliente
  const handleUpdateClient = async (clientId, updatedData) => {
    try {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/atualizar-cliente/${clientId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        await refreshData('clients');
        return { success: true };
      } else {
        throw new Error("Erro ao atualizar cliente");
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      return { success: false, error: error.message };
    }
  };

  const handleItemClick = async (item) => {
    if (activeTab === "documents") {
      navigate(`/document/${item.id}`);
    } else {
      // Para clientes, busca dados atualizados e abre modal
      await fetchClientData(item.id);
    }
  };

  const closeClientModal = () => {
    setShowClientModal(false);
    setSelectedClient(null);
    setClientError(null);
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

        <FixedBottom>
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

      {showClientModal && (
        <ClientModal
          client={selectedClient}
          loading={clientLoading}
          error={clientError}
          onClose={closeClientModal}
          onUpdateClient={handleUpdateClient}
        />
      )}
    </HomeContainer>
  );
};