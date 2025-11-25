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
  EmptyState,
  IngredientsListContainer,
  IngredientsListHeader,
  IngredientItemCard,
  IngredientItemContent,
  IngredientItemTitle,
  IngredientItemDescription,
  IngredientItemMeta,
  RemoveButton,
  IngredientsListGrid,
  IngredientItemHeader,
} from "./style";

import {
  Fieldset,
  FieldsetLegend,
} from "../../../../components/Forms/FormWrappers/styles";

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

  /**
   * Formata números inteiros (sem decimais) para campos de peso
   */
  const formatIntegerInput = (value) => {
    if (!value) return "";

    // Remove tudo que não é número
    let cleaned = value.replace(/\D/g, "");

    return cleaned;
  };

  /**
   * Formata números com vírgula para decimais (campos de dinheiro)
   */
  const formatCurrencyInput = (value) => {
    if (!value) return "";

    // Remove tudo que não é número ou vírgula
    let cleaned = value.replace(/[^\d,]/g, "");

    // Substitui múltiplas vírgulas por uma única
    cleaned = cleaned.replace(/,+/g, ",");

    return cleaned;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    // Aplica formatação específica baseada no campo
    if (
      field === "pesoBruto" ||
      field === "pesoLiquido" ||
      field === "pesoProcessado" ||
      field === "quantidadeEmbalagem"
    ) {
      formattedValue = formatIntegerInput(value);
    } else if (field === "custoEmbalagem") {
      formattedValue = formatCurrencyInput(value);
    }

    setIngredienteAtual((prev) => ({
      ...prev,
      [field]: formattedValue,
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
      notify("Selecione um alimento", "error");
      return;
    }

    if (!ingredienteAtual.pesoBruto || !ingredienteAtual.pesoLiquido) {
      notify("Preencha os pesos bruto e líquido", "error");
      return;
    }

    if (precificacaoHabilitada) {
      if (
        !ingredienteAtual.quantidadeEmbalagem ||
        !ingredienteAtual.custoEmbalagem
      ) {
        notify(
          "Preencha os campos de quantidade e custo da embalagem",
          "error"
        );
        return;
      }
    }

    setLoading(true);

    // Prepara dados para envio
    const dadosIngrediente = {
      alimento: ingredienteAtual.alimento.value,
      peso_bruto: parseInt(ingredienteAtual.pesoBruto) || 0,
      peso_liquido: parseInt(ingredienteAtual.pesoLiquido) || 0,
      peso_processado: ingredienteAtual.pesoProcessado
        ? parseInt(ingredienteAtual.pesoProcessado)
        : null,
    };

    // Adiciona campos de precificação apenas se habilitada
    if (precificacaoHabilitada) {
      dadosIngrediente.quantidade_embalagem =
        parseInt(ingredienteAtual.quantidadeEmbalagem) || 0;
      // Converte vírgula para ponto para o backend
      dadosIngrediente.custo_embalagem =
        parseFloat(ingredienteAtual.custoEmbalagem.replace(",", ".")) || 0;
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
      notify("Erro ao adicionar ingrediente. Tente novamente.", "error");
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

  /**
   * Formata valores para exibição na lista
   */
  const formatarParaExibicao = (valor, tipo = "inteiro") => {
    if (valor === null || valor === undefined) return "-";

    if (tipo === "inteiro") {
      return parseInt(valor).toLocaleString("pt-BR");
    } else if (tipo === "moeda") {
      return parseFloat(valor).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else if (tipo === "moedaPorGrama") {
      return parseFloat(valor).toLocaleString("pt-BR", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      });
    }

    return valor;
  };

  return (
    <Container>
      <div className="step-content"></div>
      <FormWrapper>
        <IngredientsGrid>
          {/* Seletor de Alimento - usando CustomSelect diretamente */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                marginLeft: "4px",
                fontWeight: "500",
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
            <Fieldset style={{ display: "flex" }}>
              <FieldsetLegend>Pesos</FieldsetLegend>
              <Input
                label="Bruto (g)"
                type="text"
                value={ingredienteAtual.pesoBruto}
                placeholder="Ex: 500"
                onChange={(e) => handleInputChange("pesoBruto", e.target.value)}
                inputMode="numeric"
                required
              />

              <Input
                label="Líquido (g)"
                type="text"
                value={ingredienteAtual.pesoLiquido}
                placeholder="Ex: 450"
                onChange={(e) =>
                  handleInputChange("pesoLiquido", e.target.value)
                }
                inputMode="numeric"
                required
              />

              <Input
                label="Processado (g)"
                type="text"
                value={ingredienteAtual.pesoProcessado}
                placeholder="Ex: 400"
                onChange={(e) =>
                  handleInputChange("pesoProcessado", e.target.value)
                }
                inputMode="numeric"
              />
            </Fieldset>
          </div>

          {/* Campos Condicionais - Precificação */}
          {precificacaoHabilitada && (
            <Fieldset style={{ display: "flex" }}>
              <FieldsetLegend>Informações de Custo</FieldsetLegend>
              <Input
                label="Quantidade por Embalagem (g)"
                type="text"
                value={ingredienteAtual.quantidadeEmbalagem}
                placeholder="Ex: 1000"
                onChange={(e) =>
                  handleInputChange("quantidadeEmbalagem", e.target.value)
                }
                inputMode="numeric"
                required
              />

              <Input
                label="Custo por uma Embalagem (R$)"
                type="text"
                value={ingredienteAtual.custoEmbalagem}
                placeholder="Ex: 15,90"
                onChange={(e) =>
                  handleInputChange("custoEmbalagem", e.target.value)
                }
                inputMode="decimal"
                required
              />
            </Fieldset>
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
                    <IngredientItemContent>
                      <IngredientItemTitle>
                        {ingrediente.alimento_nome || "Alimento"}
                      </IngredientItemTitle>

                      <IngredientItemDescription>
                        <span>
                          <strong>Peso Bruto:</strong>{" "}
                          {formatarParaExibicao(ingrediente.peso_bruto)}g
                        </span>
                      </IngredientItemDescription>
                      <IngredientItemDescription>
                        <span>
                          <strong>Peso Líquido: </strong>
                          {formatarParaExibicao(ingrediente.peso_liquido)}g
                        </span>
                      </IngredientItemDescription>

                      {ingrediente.peso_processado && (
                        <IngredientItemDescription>
                          <span>
                            <strong>Peso Processado: </strong>
                            {formatarParaExibicao(ingrediente.peso_processado)}g
                          </span>
                        </IngredientItemDescription>
                      )}

                      {precificacaoHabilitada &&
                        ingrediente.custo_embalagem && (
                          <>
                            <IngredientItemMeta>
                              <Box size={12} />
                              <span>
                                Embalagem:{" "}
                                {formatarParaExibicao(
                                  ingrediente.quantidade_embalagem
                                )}
                                g
                              </span>
                            </IngredientItemMeta>

                            <IngredientItemMeta>
                              <CurrencyDollar size={12} />
                              <span>
                                Custo: R${" "}
                                {formatarParaExibicao(
                                  ingrediente.custo_embalagem,
                                  "moeda"
                                )}
                                {ingrediente.custo_embalagem &&
                                ingrediente.quantidade_embalagem
                                  ? ` (R$ ${formatarParaExibicao(
                                      parseFloat(ingrediente.custo_embalagem) /
                                        parseFloat(
                                          ingrediente.quantidade_embalagem
                                        ),
                                      "moedaPorGrama"
                                    )}/g)`
                                  : ""}
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
