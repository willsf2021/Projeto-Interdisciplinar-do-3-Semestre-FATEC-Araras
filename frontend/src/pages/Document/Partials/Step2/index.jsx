import { FormWrapper } from "../../../../components/Forms/FormWrappers/styles";
import { Input } from "../../../../components/Forms/Input";
import {
  Container,
  InputFlexWrapperStep2,
  TextField,
  TextFieldWrapper,
  TextFieldLabel
} from "./style";

export const Step2 = () => {
  return (
    <Container>
      <div className="step-content">
        <h3>Receita</h3>
      </div>
      <FormWrapper>
        <InputFlexWrapperStep2>
          <Input
            label="Nome"
            type="text"
            value={""}
            placeholder="Digite o nome da receita..."
            onChange={() => {}}
            required
          />
          <Input
            label="Categoria"
            type="text"
            value={""}
            placeholder="Digite a categoria da receita..."
            onChange={() => {}}
            required
          />
          <Input
            label="Medida Caseira"
            type="text"
            value={""}
            placeholder="Digite a medida caseira da receita..."
            onChange={() => {}}
            required
          />
          <div className="container-porcoes">
            <Input
              label="Tempo de Preparo"
              type="number"
              value={""}
              placeholder="1:20h"
              onChange={() => {}}
              required
            />
            <Input
              label="Porção Individual"
              type="text"
              value={""}
              placeholder="100,00"
              onChange={() => {}}
              required
            />
            <Input
              label="Unidade de Medida"
              type="text"
              value={""}
              placeholder="ml ou g"
              onChange={() => {}}
              required
            />
          </div>
          <TextFieldWrapper>
            <TextFieldLabel>Modo de Preparo</TextFieldLabel>
            <TextField />
          </TextFieldWrapper>
        </InputFlexWrapperStep2>
      </FormWrapper>
    </Container>
  );
};
