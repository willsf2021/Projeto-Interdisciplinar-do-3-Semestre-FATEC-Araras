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
  PrecificacaoFieldset,
  FieldsetLegend,
  InputWithTooltip,
  TooltipIcon,
  TooltipText
} from "./style";

export const Step1 = ({ receitaData, onReceitaDataChange }) => {

  const handleInputChange = (field, value) => {
    onReceitaDataChange({ [field]: value });
  };

  const handleCheckboxChange = (field, checked) => {
    onReceitaDataChange({ [field]: checked });
  };

  /**
   * Formata uma entrada qualquer em M:SS ou MM:SS.
   * - aceita números puros (ex: "110" -> 1:10)
   * - aceita texto com ":" (ex: "1:70" -> 2:10)
   * - faz carry dos segundos para minutos quando necessário
   * - retorno "" se input vazio
   */
  const formatTempoInput = (raw) => {
    if (!raw) return "";

    // permite que o usuário cole com ":" ou digite apenas números
    const onlyDigits = raw.replace(/[^0-9]/g, "");

    if (onlyDigits.length === 0) return "";

    let minutes = 0;
    let seconds = 0;

    if (raw.includes(":")) {
      // se o usuário colou "m:ss" ou "mm:ss" etc
      const parts = raw.split(":").map(p => p.replace(/\D/g, ""));
      const minPart = parts[0] || "0";
      const secPart = parts[1] || "0";

      minutes = parseInt(minPart, 10) || 0;
      seconds = parseInt(secPart, 10) || 0;
    } else {
      // se o usuário digitou só números, interpretamos os últimos 2 como segundos
      if (onlyDigits.length <= 2) {
        minutes = 0;
        seconds = parseInt(onlyDigits, 10) || 0;
      } else {
        const minPart = onlyDigits.slice(0, -2);
        const secPart = onlyDigits.slice(-2);
        minutes = parseInt(minPart, 10) || 0;
        seconds = parseInt(secPart, 10) || 0;
      }
    }

    // carry: se segundos >= 60, converte para minutos
    if (seconds >= 60) {
      const carry = Math.floor(seconds / 60);
      minutes += carry;
      seconds = seconds % 60;
    }

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const handleTempoChange = (rawValue) => {
    const formatted = formatTempoInput(rawValue);
    onReceitaDataChange({ tempoPreparo: formatted });
  };

  return (
    <Container>
      <div className="step-content">
      </div>
      <FormWrapper>
        <InputFlexWrapperStep1>
          <Input
            label="Nome"
            type="text"
            value={receitaData.nome}
            placeholder="Digite o nome da receita..."
            onChange={(e) => handleInputChange('nome', e.target.value)}
            required
          />
          <Input
            label="Categoria"
            type="text"
            value={receitaData.categoria}
            placeholder="Digite a categoria da receita..."
            onChange={(e) => handleInputChange('categoria', e.target.value)}
            required
          />
          
          <InputWithTooltip>
            <Input
              label="Medida Caseira"
              type="text"
              value={receitaData.medidaCaseira}
              placeholder="Digite a medida caseira da receita..."
              onChange={(e) => handleInputChange('medidaCaseira', e.target.value)}
              required
            />
            <TooltipIcon>
              i
              <TooltipText>Unidade de referência visual (ex: 1 xícara, 1 colher de sopa, 1 fatia)</TooltipText>
            </TooltipIcon>
          </InputWithTooltip>

          <div className="container-porcoes">
            <Input
              label="Tempo de Preparo"
              type="text"
              value={receitaData.tempoPreparo ?? ""}
              placeholder="1:10"
              onChange={(e) => handleTempoChange(e.target.value)}
              inputMode="numeric"
              maxLength={6}
              required
            />
            
            <InputWithTooltip>
              <Input
                label="Valor Porção Individual"
                type="number"
                value={receitaData.porcaoIndividual}
                placeholder="100.00"
                onChange={(e) => handleInputChange('porcaoIndividual', e.target.value)}
                step="0.01"
                required
              />
              <TooltipIcon>
                i
                <TooltipText>Quantidade em gramas ou ml de uma porção servida</TooltipText>
              </TooltipIcon>
            </InputWithTooltip>

            <InputWithTooltip>
              <Input
                label="Unidade de Medida"
                type="text"
                value={receitaData.unidadeMedida}
                placeholder="ml ou g"
                onChange={(e) => handleInputChange('unidadeMedida', e.target.value)}
                required
              />
              <TooltipIcon>
                i
                <TooltipText>Use "g" para sólidos ou "ml" para líquidos</TooltipText>
              </TooltipIcon>
            </InputWithTooltip>
          </div>

          <TextFieldWrapper>
            <TextFieldLabel>Modo de Preparo</TextFieldLabel>
            <TextField 
              value={receitaData.modoPreparo}
              onChange={(e) => handleInputChange('modoPreparo', e.target.value)}
              placeholder="Descreva o modo de preparo da receita..."
            />
          </TextFieldWrapper>

          {/* Seção de Precificação com Fieldset */}
          <PrecificacaoFieldset>
            <FieldsetLegend>
              Precificação
              <TooltipIcon className="legend-tooltip">
                i
                <TooltipText>Sistema que calcula o preço de venda baseado nos custos dos ingredientes e margem de lucro</TooltipText>
              </TooltipIcon>
            </FieldsetLegend>

            <CheckboxWrapper>
              <CheckboxCustom
                type="checkbox"
                id="habilitar-precificacao"
                checked={receitaData.habilitarPrecificacao}
                onChange={(e) => handleCheckboxChange('habilitarPrecificacao', e.target.checked)}
              />
              <CheckboxLabel htmlFor="habilitar-precificacao">
                Habilitar Precificação
              </CheckboxLabel>
            </CheckboxWrapper>

            <InputWithTooltip className={!receitaData.habilitarPrecificacao ? 'disabled' : ''}>
              <Input
                label="Markup (%)"
                type="number"
                value={receitaData.markup}
                placeholder="Ex: 30"
                onChange={(e) => handleInputChange('markup', e.target.value)}
                step="0.01"
                min="0"
                disabled={!receitaData.habilitarPrecificacao}
              />
              <TooltipIcon>
                i
                <TooltipText>Percentual de lucro sobre o custo (ex: 30% = R$10 custo vira R$13 venda)</TooltipText>
              </TooltipIcon>
            </InputWithTooltip>
          </PrecificacaoFieldset>
        </InputFlexWrapperStep1>
      </FormWrapper>
    </Container>
  );
};