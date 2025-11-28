import React, { useState } from "react";
import { Container } from "./style.js";
import { Step1 } from "./Partials/Step1";
import { Step2 } from "./Partials/Step2";
import { Step3 } from "./Partials/Step3";
import { Step4 } from "./Partials/Step4";
import { Final } from "./Partials/Final";
import { HouseFill } from "react-bootstrap-icons";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../hooks/useNotification";

export const Document = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [receitaId, setReceitaId] = useState(null);
  const [documentoId, setDocumentoId] = useState(null);
  const [showFinal, setShowFinal] = useState(false); // NOVO: Controla se mostra a tela final
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
  const [loading, setLoading] = useState(false);
  const { apiFetchJson } = useApi();
  const { notify } = useNotification();

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

  const salvarOuAtualizarReceita = async () => {
    // ... (código existente mantido igual)
    if (
      !receitaData.nome ||
      !receitaData.categoria ||
      !receitaData.medidaCaseira ||
      !receitaData.tempoPreparo ||
      !receitaData.porcaoIndividual ||
      !receitaData.unidadeMedida ||
      !receitaData.modoPreparo
    ) {
      notify("Por favor, preencha todos os campos obrigatórios.", "error");
      throw new Error("Campos obrigatórios não preenchidos");
    }

    let tempoPreparoHoras = 0;
    let tempoPreparoMinutos = 0;

    if (receitaData.tempoPreparo) {
      if (typeof receitaData.tempoPreparo === "string") {
        const tempoParts = receitaData.tempoPreparo.replace("h", "").split(":");
        tempoPreparoHoras = parseInt(tempoParts[0]) || 0;
        tempoPreparoMinutos = parseInt(tempoParts[1]) || 0;
      } else {
        const minutosTotais = parseInt(receitaData.tempoPreparo);
        tempoPreparoHoras = Math.floor(minutosTotais / 60);
        tempoPreparoMinutos = minutosTotais % 60;
      }
    }

    const dadosParaEnviar = {
      nome: receitaData.nome,
      categoria: receitaData.categoria,
      medida_caseira: receitaData.medidaCaseira,
      tempo_preparo_horas: tempoPreparoHoras,
      tempo_preparo_minutos: tempoPreparoMinutos,
      porcao_individual:
        parseFloat(receitaData.porcaoIndividual.replace(",", ".")) || 0,
      medida: receitaData.unidadeMedida,
      modo_preparo: receitaData.modoPreparo,
      habilitar_precificacao: receitaData.habilitarPrecificacao,
      markup: receitaData.habilitarPrecificacao
        ? parseFloat(receitaData.markup.replace(",", "."))
        : null,
      habilitar_rotulo_nutricional: false,
    };

    try {
      let response;
      if (receitaId) {
        response = await apiFetchJson(
          `${import.meta.env.VITE_API_URL}/atualizar-receita/${receitaId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosParaEnviar),
          }
        );
        notify("Receita atualizada com sucesso!", "success");
      } else {
        response = await apiFetchJson(
          `${import.meta.env.VITE_API_URL}/criar-receita/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosParaEnviar),
          }
        );
        setReceitaId(response.id);
        notify("Receita criada com sucesso!", "success");
      }
      return response;
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      notify("Erro ao salvar receita. Tente novamente.", "error");
      throw error;
    }
  };

  const criarDocumentoFinal = async () => {
    if (!receitaId) {
      notify("Erro: Receita não encontrada.", "error");
      return null;
    }

    if (!documentoData.cliente) {
      notify("Selecione um cliente para gerar o documento.", "error");
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
        `${import.meta.env.VITE_API_URL}/documentos/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosDocumento),
        }
      );

      notify("Documento criado com sucesso!", "success");
      console.log("Documento criado:", response);

      setDocumentoId(response.id);
      return response.id;
    } catch (error) {
      console.error("Erro ao criar documento:", error);
      notify("Erro ao criar documento. Tente novamente.", "error");
      throw error;
    } finally {
      setLoading(false);
    }
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
      // NOVO: Cria o documento e mostra a tela final
      setLoading(true);
      try {
        await criarDocumentoFinal();
        setShowFinal(true); // Mostra a tela final
      } catch (error) {
        return; // Mantém no passo 4 em caso de erro
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
    window.location.href = "/home";
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

  // NOVO: Se mostrar final, exibe apenas o componente Final
  if (showFinal) {
    return (
      <Final
        documentoId={documentoId}
        receitaId={receitaId}
        documentoData={documentoData}
        receitaData={{
          ...receitaData,
          onFormatoRotuloChange: (formato) => {
            setReceitaData((prev) => ({ ...prev, formatoRotulo: formato }));
          },
        }}
        apiFetchJson={apiFetchJson}
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
            <Step2 receitaId={receitaId} receitaData={receitaData} />
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
                : currentStep === 4
                ? "Finalizar"
                : "Avançar"}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};
