import { TextArea } from "../../../../components/Forms/TextArea";
import { Container } from "./style";
import { useNotification } from "../../../../hooks/useNotification"; // NOVO

export const Step3 = ({ documentoData, onDocumentoDataChange }) => {
  const { notify } = useNotification(); // NOVO

  const handleAlergenicosChange = (value) => {
    onDocumentoDataChange({ declaracaoAlergenicos: value });
  };

  return (
    <Container>
      <div className="step-content"></div>
      <TextArea
        label="Declaração de Alergênicos"
        placeholder="Ex: Contém leites e derivados, pode conter soja, contém glúten."
        value={documentoData.declaracaoAlergenicos}
        onChange={(e) => handleAlergenicosChange(e.target.value)}
      />
    </Container>
  );
};