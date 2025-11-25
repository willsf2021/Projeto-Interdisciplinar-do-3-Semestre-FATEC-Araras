import { TextArea } from "../../../../components/Forms/TextArea";
import { Container } from "./style";
export const Step3 = () => {
  return (
    <Container>
      <div className="step-content"></div>
      <TextArea
        label="Descreva"
        placeholder="Ex: Contém leites e derivados, pode conter soja, contém glúten."
      />
    </Container>
  );
};
