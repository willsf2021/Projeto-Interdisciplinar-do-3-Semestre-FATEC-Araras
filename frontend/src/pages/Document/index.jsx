import React, { useState } from "react";
import { Container } from "./style.js";
import { Step1 } from "./Partials/Step1";
import { Step2 } from "./Partials/Step2";
import { Step3 } from "./Partials/Step3";
import { Step4 } from "./Partials/Step4";
import { HouseFill } from "react-bootstrap-icons";
import { useApi } from "../../hooks/useApi";

export const Document = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [receitaId, setReceitaId] = useState(null);
  const [receitaData, setReceitaData] = useState({
    nome: '',
    categoria: '',
    medidaCaseira: '',
    tempoPreparo: '',
    porcaoIndividual: '',
    unidadeMedida: '',
    modoPreparo: '',
    habilitarPrecificacao: false, // NOVO CAMPO
    markup: '' // NOVO CAMPO
  });
  const [loading, setLoading] = useState(false);
  const { apiFetchJson } = useApi();

  const steps = [
    { number: 1, name: "Cliente" },
    { number: 2, name: "Receita" },
    { number: 3, name: "Ingredientes" },
    { number: 4, name: "Alergênicos" },
  ];

  const salvarOuAtualizarReceita = async () => {
    // Validação básica dos campos obrigatórios
    if (!receitaData.nome || !receitaData.categoria || !receitaData.medidaCaseira || 
        !receitaData.tempoPreparo || !receitaData.porcaoIndividual || !receitaData.unidadeMedida || 
        !receitaData.modoPreparo) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      throw new Error('Campos obrigatórios não preenchidos');
    }

    // Processar o tempo de preparo
    let tempoPreparoHoras = 0;
    let tempoPreparoMinutos = 0;

    if (receitaData.tempoPreparo) {
      if (typeof receitaData.tempoPreparo === 'string') {
        const tempoParts = receitaData.tempoPreparo.replace('h', '').split(':');
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
      porcao_individual: parseFloat(receitaData.porcaoIndividual),
      medida: receitaData.unidadeMedida,
      modo_preparo: receitaData.modoPreparo,
      habilitar_precificacao: receitaData.habilitarPrecificacao, // NOVO
      markup: receitaData.habilitarPrecificacao ? parseFloat(receitaData.markup) : null, // NOVO
      habilitar_rotulo_nutricional: false,
    };

    try {
      let response;
      if (receitaId) {
        // Se já existe, faz UPDATE
        response = await apiFetchJson(`${import.meta.env.VITE_API_URL}/atualizar-receita/${receitaId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosParaEnviar),
        });
        console.log('Receita atualizada:', response);
      } else {
        // Se não existe, faz CREATE
        response = await apiFetchJson(`${import.meta.env.VITE_API_URL}/criar-receita/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosParaEnviar),
        });
        setReceitaId(response.id);
        console.log('Receita criada com ID:', response.id);
      }
      return response;
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      throw error;
    }
  };

  // ... (restante do código permanece igual)
  const handleNext = async () => {
    if (currentStep === 2) {
      // Ao avançar do step2 para step3, salva/atualiza a receita
      setLoading(true);
      try {
        await salvarOuAtualizarReceita();
        setCurrentStep(currentStep + 1);
      } catch (error) {
        alert('Erro ao salvar receita. Verifique os campos e tente novamente.');
        return; // Não avança se der erro
      } finally {
        setLoading(false);
      }
    } else {
      // Para outros steps, apenas avança
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = async (stepNumber) => {
    if (currentStep === 2 && stepNumber === 3) {
      // Se está no step2 e clicou para ir ao step3, salva primeiro
      setLoading(true);
      try {
        await salvarOuAtualizarReceita();
        setCurrentStep(stepNumber);
      } catch (error) {
        alert('Erro ao salvar receita. Verifique os campos e tente novamente.');
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
    setReceitaData(prev => ({
      ...prev,
      ...novosDados
    }));
  };

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
                ></p>
              </li>

              {index < steps.length - 1 && <span className="hr-steps"></span>}
            </React.Fragment>
          ))}
        </ul>
      </header>

      <div className="step-content">
        <div className="step-content-inner">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && (
            <Step2 
              receitaData={receitaData}
              onReceitaDataChange={handleReceitaDataChange}
            />
          )}
          {currentStep === 3 && <Step3 receitaId={receitaId} />}
          {currentStep === 4 && <Step4 receitaId={receitaId} />}
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
              disabled={currentStep === steps.length || loading}
            >
              {loading ? 'Salvando...' : currentStep === steps.length ? "Finalizar" : "Avançar"}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};