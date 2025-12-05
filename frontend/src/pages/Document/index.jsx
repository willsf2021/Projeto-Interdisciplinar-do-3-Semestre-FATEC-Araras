import React, { useState, useEffect } from "react";
import { Container } from "./style.js";
import { Step1 } from "./Partials/Step1";
import { Step2 } from "./Partials/Step2";
import { Step3 } from "./Partials/Step3";
import { Step4 } from "./Partials/Step4";
import { Final } from "./Partials/Final";
import { HouseFill } from "react-bootstrap-icons";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../hooks/useNotification";
import { useParams, useNavigate } from "react-router-dom"; // Adicione isso

export const Document = () => {
  const { documentoId } = useParams(); // Para capturar o ID da URL
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [receitaId, setReceitaId] = useState(null);
  const [documentoIdState, setDocumentoIdState] = useState(null);
  const [showFinal, setShowFinal] = useState(false);
  const [ultimaReceitaSalva, setUltimaReceitaSalva] = useState(null);
  const [loading, setLoading] = useState(false);
  const { apiFetchJson } = useApi();
  const { notify } = useNotification();

  // Estados iniciais
  const [receitaData, setReceitaData] = useState({
    nome: "",
    categoria: "",
    medidaCaseira: "",
    tempoPreparo: "",
    porcaoIndividual: "",
    unidadeMedida: "",
    modoPreparo: "",
    habilitarPrecificacao: false,
    markup: "",
    formatoRotulo: "vertical",
  });

  const [documentoData, setDocumentoData] = useState({
    declaracaoAlergenicos: "",
    cliente: null,
    formatoDocumento: "completo",
  });

  const steps = [
    { number: 1, name: "Receita" },
    { number: 2, name: "Ingredientes" },
    { number: 3, name: "Alergênicos" },
    { number: 4, name: "Cliente" },
  ];

  // Carregar dados do documento existente se estiver em modo de edição
  useEffect(() => {
    if (documentoId) {
      carregarDocumentoExistente(documentoId);
    }
  }, [documentoId]);

  const carregarDocumentoExistente = async (id) => {
    setLoading(true);
    try {
      const response = await apiFetchJson(
        `${import.meta.env.VITE_API_URL}/documentos/${id}/detalhes/`
      );

      // Preencher dados da receita
      setReceitaData({
        nome: response.receita.nome,
        categoria: response.receita.categoria,
        medidaCaseira: response.receita.medida_caseira,
        tempoPreparo: response.receita.tempo_preparo,
        porcaoIndividual: response.receita.porcao_individual,
        unidadeMedida: response.receita.unidade_medida,
        modoPreparo: response.receita.modo_preparo,
        habilitarPrecificacao: response.receita.habilitar_precificacao,
        markup: response.receita.markup,
        formatoRotulo: response.receita.formato_rotulo,
      });

      // Preencher dados do documento
      setDocumentoData({
        declaracaoAlergenicos: response.documento.declaracao_alergenicos || "",
        cliente: response.documento.cliente,
        formatoDocumento: response.documento.formato_documento,
      });

      // Setar IDs
      setReceitaId(response.receita.id);
      setDocumentoIdState(response.documento.id);
      setIsEditMode(true);

      notify("Documento carregado para edição!", "success");
    } catch (error) {
      console.error("Erro ao carregar documento:", error);
      notify("Erro ao carregar documento. Tente novamente.", "error");
      navigate("/home"); // Voltar para home em caso de erro
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar documento existente
  const atualizarDocumentoExistente = async () => {
    if (!documentoIdState) {
      notify("Erro: Documento não encontrado.", "error");
      return null;
    }

    if (!documentoData.cliente) {
      notify("Selecione um cliente para o documento.", "error");
      return null;
    }

    setLoading(true);
    try {
      const dadosDocumento = {
        receita: receitaId,
        cliente: documentoData.cliente.id,
        declaracao_alergenicos: documentoData.declaracaoAlergenicos,
        formato_documento: documentoData.formatoDocumento,
      };

      const response = await apiFetchJson(
        `${import.meta.env.VITE_API_URL}/documentos/${documentoIdState}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosDocumento),
        }
      );

      notify("Documento atualizado com sucesso!", "success");
      console.log("Documento atualizado:", response);

      return response;
    } catch (error) {
      console.error("Erro ao atualizar documento:", error);
      notify("Erro ao atualizar documento. Tente novamente.", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar ou atualizar receita (já existente)
  const salvarOuAtualizarReceita = async () => {
    // ... (mantenha a função existente, ela já funciona para ambos os casos)
  };

  // Função para criar novo documento
  const criarDocumentoFinal = async () => {
    // ... (mantenha a função existente)
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      setLoading(true);
      try {
        await salvarOuAtualizarReceita();
        setCurrentStep(currentStep + 1);
      } catch (error) {
        return;
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 4) {
      setLoading(true);
      try {
        if (isEditMode) {
          await atualizarDocumentoExistente();
        } else {
          await criarDocumentoFinal();
        }
        setShowFinal(true);
      } catch (error) {
        return;
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = async (stepNumber) => {
    if (stepNumber > currentStep + 1) {
      notify("Complete o passo atual antes de avançar.", "warning");
      return;
    }

    if (currentStep === 1 && stepNumber === 2) {
      setLoading(true);
      try {
        await salvarOuAtualizarReceita();
        setCurrentStep(stepNumber);
      } catch (error) {
        return;
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(stepNumber);
    }
  };

  const handleHome = () => {
    navigate("/home");
  };

  const handleReceitaDataChange = (novosDados) => {
    setReceitaData((prev) => ({
      ...prev,
      ...novosDados,
    }));
  };

  const handleDocumentoDataChange = (novosDados) => {
    setDocumentoData((prev) => ({
      ...prev,
      ...novosDados,
    }));
  };

  // Loading enquanto carrega dados
  if (loading && documentoId && !receitaId) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Carregando documento...</div>
      </div>
    );
  }

  if (showFinal) {
    return (
      <Final
        documentoId={documentoIdState}
        receitaId={receitaId}
        documentoData={documentoData}
        receitaData={{
          ...receitaData,
          onFormatoRotuloChange: (formato) => {
            setReceitaData((prev) => ({ ...prev, formatoRotulo: formato }));
          },
        }}
        notify={notify}
      />
    );
  }

  return (
    <Container>
      <header className="container-steps">
        <ul>
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <li className="steps-item-container">
                <div className="span-container">
                  <span
                    className={`steps-items-span ${
                      currentStep === step.number ? "active" : ""
                    }`}
                    onClick={() => handleStepClick(step.number)}
                  >
                    {step.number}
                  </span>
                </div>
                <p
                  className={`steps-item-name ${
                    currentStep === step.number ? "p-active" : ""
                  }`}
                >
                  {step.name}
                </p>
              </li>

              {index < steps.length - 1 && <span className="hr-steps"></span>}
            </React.Fragment>
          ))}
        </ul>
      </header>

      <div className="step-content">
        <div className="step-content-inner">
          {currentStep === 1 && (
            <Step1
              receitaData={receitaData}
              onReceitaDataChange={handleReceitaDataChange}
            />
          )}
          {currentStep === 2 && (
            <Step2 
              receitaId={receitaId} 
              receitaData={receitaData}
              isEditMode={isEditMode} // Passe esta prop para o Step2
            />
          )}
          {currentStep === 3 && (
            <Step3
              documentoData={documentoData}
              onDocumentoDataChange={handleDocumentoDataChange}
            />
          )}
          {currentStep === 4 && (
            <Step4
              documentoData={documentoData}
              onDocumentoDataChange={handleDocumentoDataChange}
            />
          )}
        </div>

        <div className="control-buttons">
          <div className="container-control-home">
            <button onClick={handleHome}>
              <HouseFill />
            </button>
          </div>
          <div className="container-control-button">
            <button
              className="prev-step"
              onClick={handlePrev}
              disabled={currentStep === 1 || loading}
            >
              Voltar
            </button>
          </div>
          <div className="container-control-button">
            <button
              onClick={handleNext}
              disabled={
                loading || (currentStep === 4 && !documentoData.cliente)
              }
            >
              {loading
                ? "Salvando..."
                : isEditMode
                ? (currentStep === 4 ? "Atualizar" : "Avançar")
                : (currentStep === 4 ? "Finalizar" : "Avançar")}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};