import React, { useState, useEffect } from "react";
import { FormWrapper } from "../../../../components/Forms/FormWrappers/styles";
import { Input } from "../../../../components/Forms/Input";
import { CustomSelect } from "../../../../components/Home/CustomSelect";
import { EggFried } from "react-bootstrap-icons";
import { useApi } from "../../../../hooks/useApi";
import {
  Egg,
  Calculator,
  Box,
  CurrencyDollar,
  Trash,
} from "react-bootstrap-icons";
import {
  Container,
  IngredientsGrid,
  SectionTitle,
  EmptyState,
  ConditionalFields,
  FieldRow,
  IngredientsListContainer,
  IngredientsListHeader,
  IngredientItemCard,
  IngredientItemIcon,
  IngredientItemContent,
  IngredientItemTitle,
  IngredientItemDescription,
  IngredientItemMeta,
  RemoveButton,
  IngredientsListGrid,
  IngredientItemHeader,
} from "./style";
import { InputWithTooltip, TooltipIcon, TooltipText } from "../Step1/style";
import { PesoFieldset } from "./style";
import { FieldsetLegend } from "./style";
import { SubmitButton } from "../../../../components/Forms/SubmitButton";

export const Step2 = ({ receitaId, receitaData }) => {
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredienteAtual, setIngredienteAtual] = useState({
    alimento: null,
    pesoBruto: "",
    pesoLiquido: "",
    pesoProcessado: "",
    quantidadeEmbalagem: "",
    custoEmbalagem: "",
  });
  const [loading, setLoading] = useState(false);
  const { apiFetchJson } = useApi();

  // Verifica se precificação está habilitada
  const precificacaoHabilitada = receitaData?.habilitarPrecificacao || false;

  console.log("Precificação habilitada:", precificacaoHabilitada);
  console.log("Receita ID:", receitaId);

  // Carregar ingredientes existentes
  useEffect(() => {
    if (receitaId) {
      carregarIngredientes();
    }
  }, [receitaId]);

  const carregarIngredientes = async () => {
    try {
      const response = await apiFetchJson(
        `${import.meta.env.VITE_API_URL}/listar-ingredientes/${receitaId}/`
      );
      setIngredientes(response.ingredientes || []);
    } catch (error) {
      console.error("Erro ao carregar ingredientes:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setIngredienteAtual((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAlimentoSelect = (selectedOption) => {
    setIngredienteAtual((prev) => ({
      ...prev,
      alimento: selectedOption,
    }));
  };

  const handleAdicionarIngrediente = async () => {
    // Validações básicas
    if (!ingredienteAtual.alimento) {
      alert("Selecione um alimento");
      return;
    }

    if (!ingredienteAtual.pesoBruto || !ingredienteAtual.pesoLiquido) {
      alert("Preencha os pesos bruto e líquido");
      return;
    }

    // Se precificação habilitada, valida campos de custo
    if (precificacaoHabilitada) {
      if (
        !ingredienteAtual.quantidadeEmbalagem ||
        !ingredienteAtual.custoEmbalagem
      ) {
        alert("Preencha os campos de quantidade e custo da embalagem");
        return;
      }
    }

    setLoading(true);

    const dadosIngrediente = {
      alimento: ingredienteAtual.alimento.value,
      peso_bruto: parseFloat(ingredienteAtual.pesoBruto),
      peso_liquido: parseFloat(ingredienteAtual.pesoLiquido),
      peso_processado: ingredienteAtual.pesoProcessado
        ? parseFloat(ingredienteAtual.pesoProcessado)
        : null,
    };

    // Adiciona campos de precificação apenas se habilitada
    if (precificacaoHabilitada) {
      dadosIngrediente.quantidade_embalagem = parseFloat(
        ingredienteAtual.quantidadeEmbalagem
      );
      dadosIngrediente.custo_embalagem = parseFloat(
        ingredienteAtual.custoEmbalagem
      );
    }

    try {
      const response = await apiFetchJson(
        `${import.meta.env.VITE_API_URL}/criar-ingrediente/${receitaId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosIngrediente),
        }
      );

      // Adiciona à lista local
      setIngredientes((prev) => [
        ...prev,
        {
          ...response,
          alimento_nome: ingredienteAtual.alimento.label,
        },
      ]);

      // Limpa o formulário
      setIngredienteAtual({
        alimento: null,
        pesoBruto: "",
        pesoLiquido: "",
        pesoProcessado: "",
        quantidadeEmbalagem: "",
        custoEmbalagem: "",
      });
    } catch (error) {
      console.error("Erro ao adicionar ingrediente:", error);
      alert("Erro ao adicionar ingrediente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverIngrediente = async (ingredienteId) => {
    try {
      await apiFetchJson(
        `${import.meta.env.VITE_API_URL}/excluir-ingrediente/${ingredienteId}/`,
        {
          method: "DELETE",
        }
      );

      // Remove da lista local
      setIngredientes((prev) => prev.filter((ing) => ing.id !== ingredienteId));
    } catch (error) {
      console.error("Erro ao remover ingrediente:", error);
      alert("Erro ao remover ingrediente. Tente novamente.");
    }
  };

  return (
    <Container>
      <div className="step-content"></div>
      <FormWrapper>
        <IngredientsGrid>
          {/* Seletor de Alimento - usando CustomSelect diretamente */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                fontSize: "14px",
                color: "#333",
              }}
            >
              Alimento
            </label>
            <CustomSelect
              endpoint={"alimentos"}
              placeholder={"alimentos"}
              type="foods"
              variant="modern"
              icon={<EggFried />}
              onSelectChange={handleAlimentoSelect}
              value={ingredienteAtual.alimento}
            />
          </div>

          {/* Pesos */}
          <div className="container-pesos">
            <PesoFieldset>
              <FieldsetLegend>Pesos</FieldsetLegend>
              <Input
                label="Bruto (g)"
                type="number"
                value={ingredienteAtual.pesoBruto}
                placeholder="0.00"
                onChange={(e) => handleInputChange("pesoBruto", e.target.value)}
                step="0.01"
                min="0"
                required
              />

              <Input
                label="Líquido (g)"
                type="number"
                value={ingredienteAtual.pesoLiquido}
                placeholder="0.00"
                onChange={(e) =>
                  handleInputChange("pesoLiquido", e.target.value)
                }
                step="0.01"
                min="0"
                required
              />

              <Input
                label="Processado (g)"
                type="number"
                value={ingredienteAtual.pesoProcessado}
                placeholder="0.00"
                onChange={(e) =>
                  handleInputChange("pesoProcessado", e.target.value)
                }
                step="0.01"
                min="0"
              />
            </PesoFieldset>
          </div>

          {/* Campos Condicionais - Precificação */}
          {precificacaoHabilitada && (
            <ConditionalFields style={{ gridColumn: "1 / -1" }}>
              <SectionTitle>Informações de Custo</SectionTitle>
              <FieldRow>
                <Input
                  label="Quantidade por Embalagem (g)"
                  type="number"
                  value={ingredienteAtual.quantidadeEmbalagem}
                  placeholder="Ex: 1000"
                  onChange={(e) =>
                    handleInputChange("quantidadeEmbalagem", e.target.value)
                  }
                  step="0.01"
                  min="0"
                  required
                />

                <Input
                  label="Custo por Embalagem (R$)"
                  type="number"
                  value={ingredienteAtual.custoEmbalagem}
                  placeholder="Ex: 15.90"
                  onChange={(e) =>
                    handleInputChange("custoEmbalagem", e.target.value)
                  }
                  step="0.01"
                  min="0"
                  required
                />
              </FieldRow>
            </ConditionalFields>
          )}
        </IngredientsGrid>

        <SubmitButton
          onClick={handleAdicionarIngrediente}
          disabled={loading}
          title={loading ? "Adicionando..." : "Adicionar"}
        />
      </FormWrapper>
      <IngredientsListContainer>
        {ingredientes.length === 0 ? (
          <EmptyState>
            <p>Nenhum ingrediente adicionado ainda.</p>
            <span>
              Use o formulário acima para adicionar ingredientes à receita.
            </span>
          </EmptyState>
        ) : (
          <>
            <IngredientsListHeader>
              {ingredientes.length}{" "}
              {ingredientes.length === 1
                ? "ingrediente adicionado"
                : "ingredientes adicionados"}
            </IngredientsListHeader>

            <IngredientsListGrid>
              {ingredientes.map((ingrediente) => (
                <IngredientItemCard key={ingrediente.id}>
                  <IngredientItemHeader>
                    {/* <IngredientItemIcon>
                      <EggFried/>
                    </IngredientItemIcon> */}

                    <IngredientItemContent>
                      <IngredientItemTitle>
                        {ingrediente.alimento_nome || "Alimento"}
                      </IngredientItemTitle>

                      <IngredientItemDescription>
                        <span>
                          <strong>Peso Bruto:</strong> {ingrediente.peso_bruto}g
                        </span>
                      </IngredientItemDescription>
                      <IngredientItemDescription>
                        <span>
                          <strong>Peso Líquido: </strong>
                          {ingrediente.peso_liquido}g
                        </span>
                      </IngredientItemDescription>

                      {precificacaoHabilitada &&
                        ingrediente.custo_embalagem && (
                          <>
                            <IngredientItemMeta>
                              <Box size={12} />
                              <span>
                                Embalagem: {ingrediente.quantidade_embalagem}g
                              </span>
                            </IngredientItemMeta>

                            <IngredientItemMeta>
                              <CurrencyDollar size={12} />
                              <span>
                                Custo: R${" "}
                                {parseFloat(
                                  ingrediente.custo_embalagem
                                ).toFixed(2)}
                                (R${" "}
                                {ingrediente.custo_embalagem &&
                                ingrediente.quantidade_embalagem
                                  ? (
                                      parseFloat(ingrediente.custo_embalagem) /
                                      parseFloat(
                                        ingrediente.quantidade_embalagem
                                      )
                                    ).toFixed(4)
                                  : "0.0000"}
                                /g)
                              </span>
                            </IngredientItemMeta>
                          </>
                        )}
                    </IngredientItemContent>
                  </IngredientItemHeader>

                  <RemoveButton
                    onClick={() => handleRemoverIngrediente(ingrediente.id)}
                    title="Remover ingrediente"
                  >
                    <Trash />
                  </RemoveButton>
                </IngredientItemCard>
              ))}
            </IngredientsListGrid>
          </>
        )}
      </IngredientsListContainer>
    </Container>
  );
};
