import { FormWrapper } from "../../../../components/Forms/FormWrappers/styles";
import { Input } from "../../../../components/Forms/Input";
import {
  Container,
  InputFlexWrapperStep1,
  TextField,
  TextFieldWrapper,
  TextFieldLabel,
  CheckboxWrapper,
  CheckboxLabel,
  CheckboxCustom,
  InputWithTooltip,
  TooltipIcon,
  TooltipText,
} from "./style";

import {
  Fieldset,
  FieldsetLegend,
} from "../../../../components/Forms/FormWrappers/styles";

export const Step1 = ({ receitaData, onReceitaDataChange }) => {
  const handleInputChange = (field, value) => {
    onReceitaDataChange({ [field]: value });
  };

  const handleCheckboxChange = (field, checked) => {
    onReceitaDataChange({ [field]: checked });
  };

  /**
   * Restringe unidade de medida para apenas "ml" ou "g"
   */
  const handleUnidadeMedidaChange = (value) => {
    const lowerValue = value.toLowerCase();

    // Permite digitar "m", "ml", "g" ou vazio durante a digitação
    if (
      lowerValue === "m" ||
      lowerValue === "ml" ||
      lowerValue === "g" ||
      value === ""
    ) {
      onReceitaDataChange({ unidadeMedida: lowerValue });
    }
  };

  /**
   * Formata números com vírgula para decimais
   */
  const formatNumberInput = (value) => {
    if (!value) return "";

    // Remove tudo que não é número ou vírgula
    let cleaned = value.replace(/[^\d,]/g, "");

    // Substitui múltiplas vírgulas por uma única
    cleaned = cleaned.replace(/,+/g, ",");

    return cleaned;
  };

  const handleNumberChange = (field, value) => {
    const formatted = formatNumberInput(value);
    onReceitaDataChange({ [field]: formatted });
  };

  return (
    <Container>
      <div className="step-content"></div>
      <FormWrapper>
        <InputFlexWrapperStep1>
          <Input
            label="Nome"
            type="text"
            value={receitaData.nome}
            placeholder="Digite o nome da receita..."
            onChange={(e) => handleInputChange("nome", e.target.value)}
            required
          />
          <Input
            label="Categoria"
            type="text"
            value={receitaData.categoria}
            placeholder="Digite a categoria da receita..."
            onChange={(e) => handleInputChange("categoria", e.target.value)}
            required
          />

          <InputWithTooltip>
            <Input
              label="Medida Caseira"
              type="text"
              value={receitaData.medidaCaseira}
              placeholder="Digite a medida caseira da receita..."
              onChange={(e) =>
                handleInputChange("medidaCaseira", e.target.value)
              }
              required
            />
            <TooltipIcon>
              i
              <TooltipText>
                Unidade de referência visual (ex: 1 xícara, 1 colher de sopa, 1
                fatia)
              </TooltipText>
            </TooltipIcon>
          </InputWithTooltip>

          <div className="container-porcoes">
            <Input
              label="Tempo de Preparo"
              type="time"
              value={receitaData.tempoPreparo || ""}
              placeholder="HH:MM"
              onChange={(e) =>
                handleInputChange("tempoPreparo", e.target.value)
              }
              required
            />

            <InputWithTooltip>
              <Input
                label="Valor Porção Individual"
                type="text"
                value={receitaData.porcaoIndividual}
                placeholder="Ex: 100,00"
                onChange={(e) =>
                  handleNumberChange("porcaoIndividual", e.target.value)
                }
                required
              />
              <TooltipIcon>
                i
                <TooltipText>
                  Quantidade em gramas ou ml de uma porção servida
                </TooltipText>
              </TooltipIcon>
            </InputWithTooltip>

            <InputWithTooltip>
              <Input
                label="Unidade de Medida"
                type="text"
                value={receitaData.unidadeMedida}
                placeholder="Ex: ml ou g"
                onChange={(e) => handleUnidadeMedidaChange(e.target.value)}
                maxLength={2}
                required
              />
              <TooltipIcon>
                i
                <TooltipText>
                  Use "g" para sólidos ou "ml" para líquidos
                </TooltipText>
              </TooltipIcon>
            </InputWithTooltip>
          </div>

          <TextFieldWrapper>
            <TextFieldLabel>Modo de Preparo</TextFieldLabel>
            <TextField
              value={receitaData.modoPreparo}
              onChange={(e) => handleInputChange("modoPreparo", e.target.value)}
              placeholder="Descreva o modo de preparo da receita..."
            />
          </TextFieldWrapper>

          {/* Seção de Precificação com Fieldset */}
          <Fieldset>
            <FieldsetLegend>
              Precificação
              <TooltipIcon className="legend-tooltip">
                i
                <TooltipText>
                  Sistema que calcula o preço de venda baseado nos custos dos
                  ingredientes e margem de lucro
                </TooltipText>
              </TooltipIcon>
            </FieldsetLegend>

            <CheckboxWrapper>
              <CheckboxCustom
                type="checkbox"
                id="habilitar-precificacao"
                checked={receitaData.habilitarPrecificacao}
                onChange={(e) =>
                  handleCheckboxChange(
                    "habilitarPrecificacao",
                    e.target.checked
                  )
                }
              />
              <CheckboxLabel htmlFor="habilitar-precificacao">
                Habilitar Precificação
              </CheckboxLabel>
            </CheckboxWrapper>

            <InputWithTooltip
              className={!receitaData.habilitarPrecificacao ? "disabled" : ""}
            >
              <Input
                label="Markup (%)"
                type="text"
                value={receitaData.markup}
                placeholder="Ex: 30,00"
                onChange={(e) => handleNumberChange("markup", e.target.value)}
                disabled={!receitaData.habilitarPrecificacao}
              />
              <TooltipIcon>
                i
                <TooltipText>
                  Percentual de lucro sobre o custo (ex: 30% = R$10 custo vira
                  R$13 venda)
                </TooltipText>
              </TooltipIcon>
            </InputWithTooltip>
          </Fieldset>
        </InputFlexWrapperStep1>
      </FormWrapper>
    </Container>
  );
};
