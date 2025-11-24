import { FormWrapper } from "../../../../components/Forms/FormWrappers/styles";
import { Input } from "../../../../components/Forms/Input";
import {
  Container,
  InputFlexWrapperStep2,
  TextField,
  TextFieldWrapper,
  TextFieldLabel
} from "./style";

export const Step2 = ({ receitaData, onReceitaDataChange }) => {

  const handleInputChange = (field, value) => {
    onReceitaDataChange({ [field]: value });
  };

  return (
    <Container>
      <div className="step-content">
        <h3>Receita</h3>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
          Preencha os dados da receita. Os campos serão salvos automaticamente ao avançar.
        </p>
      </div>
      <FormWrapper>
        <InputFlexWrapperStep2>
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
          <Input
            label="Medida Caseira"
            type="text"
            value={receitaData.medidaCaseira}
            placeholder="Digite a medida caseira da receita..."
            onChange={(e) => handleInputChange('medidaCaseira', e.target.value)}
            required
          />
          <div className="container-porcoes">
            <Input
              label="Tempo de Preparo"
              type="text"
              value={receitaData.tempoPreparo}
              placeholder="1:20h"
              onChange={(e) => handleInputChange('tempoPreparo', e.target.value)}
              required
            />
            <Input
              label="Porção Individual"
              type="number"
              value={receitaData.porcaoIndividual}
              placeholder="100.00"
              onChange={(e) => handleInputChange('porcaoIndividual', e.target.value)}
              step="0.01"
              required
            />
            <Input
              label="Unidade de Medida"
              type="text"
              value={receitaData.unidadeMedida}
              placeholder="ml ou g"
              onChange={(e) => handleInputChange('unidadeMedida', e.target.value)}
              required
            />
          </div>
          <TextFieldWrapper>
            <TextFieldLabel>Modo de Preparo</TextFieldLabel>
            <TextField 
              value={receitaData.modoPreparo}
              onChange={(e) => handleInputChange('modoPreparo', e.target.value)}
              placeholder="Descreva o modo de preparo da receita..."
            />
          </TextFieldWrapper>
        </InputFlexWrapperStep2>
      </FormWrapper>
    </Container>
  );
};