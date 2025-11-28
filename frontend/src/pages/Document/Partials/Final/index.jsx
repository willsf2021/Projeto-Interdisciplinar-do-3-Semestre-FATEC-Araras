import { Container } from "./style";
import { SubmitButton } from "../../../../components/Forms/SubmitButton";
import { HouseFill } from "react-bootstrap-icons";
import { useApi } from "../../../../hooks/useApi";

// Opções de formato do rótulo
const FORMATO_ROTULO_OPCOES = [
  { valor: "vertical", label: "Vertical" },
  { valor: "horizontal", label: "Horizontal" },
  { valor: "quebrado_vertical", label: "Quebrado Vertical" },
  { valor: "quebrado_horizontal", label: "Quebrado Horizontal" },
];

export const Final = ({
  documentoId,
  receitaId,
  documentoData,
  receitaData,
  notify,
}) => {
  // Função para atualizar o formato do rótulo
  const { apiFetch } = useApi();
  const atualizarFormatoRotulo = async (formato) => {
    try {
      await apiFetch(
        `${import.meta.env.VITE_API_URL}/atualizar-receita/${receitaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formato_rotulo: formato,
          }),
        }
      );

      notify("Formato do rótulo atualizado com sucesso!", "success");
      // Atualiza o estado local se necessário
      if (receitaData.onFormatoRotuloChange) {
        receitaData.onFormatoRotuloChange(formato);
      }
    } catch (error) {
      console.error("Erro ao atualizar formato do rótulo:", error);
      notify("Erro ao atualizar formato do rótulo. Tente novamente.", "error");
    }
  };

  // Função para baixar o documento completo
  const handleDownloadPDF = async () => {
    try {
      // Primeiro, habilita o rótulo nutricional na receita se ainda não estiver habilitado
      if (!receitaData.habilitarRotuloNutricional) {
        await apiFetch(
          `${import.meta.env.VITE_API_URL}/atualizar-receita/${receitaId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              habilitar_rotulo_nutricional: true,
            }),
          }
        );
        notify("Rótulo nutricional habilitado para este documento.", "success");
      }

      // Gera o documento completo (que agora incluirá o rótulo)
      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/documentos/${documentoId}/pdf/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao gerar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `documento_completo_${documentoId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      notify("PDF gerado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      notify("Erro ao gerar PDF. Tente novamente.", "error");
    }
  };

  // Função para baixar apenas o rótulo nutricional
  const handleDownloadRotulo = async () => {
    try {
      // Primeiro habilita o rótulo se necessário
      if (!receitaData.habilitarRotuloNutricional) {
        await apiFetch(
          `${import.meta.env.VITE_API_URL}/atualizar-receita/${receitaId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              habilitar_rotulo_nutricional: true,
            }),
          }
        );
      }

      // Gera apenas o rótulo nutricional
      const response =  await apiFetch(
        `${import.meta.env.VITE_API_URL}/rotulos/${documentoId}/pdf/`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao gerar rótulo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `rotulo_nutricional_${documentoId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      notify("Rótulo nutricional gerado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao baixar rótulo:", error);
      notify("Erro ao gerar rótulo nutricional. Tente novamente.", "error");
    }
  };

  const handleHome = () => {
    window.location.href = "/home";
  };

  return (
    <Container>
      <div className="final-content">
        <h2>Documento Finalizado com Sucesso!</h2>
        <p>Seu documento foi criado e está pronto para download.</p>

        <div className="document-info">
          <p>
            <strong>ID do Documento:</strong> {documentoId}
          </p>
          <p>
            <strong>ID da Receita:</strong> {receitaId}
          </p>
          <p>
            <strong>Cliente:</strong> {documentoData.cliente?.name}
          </p>
          <p>
            <strong>Formato do Documento:</strong>{" "}
            {documentoData.formatoDocumento}
          </p>
          <p>
            <strong>Rótulo Nutricional:</strong>{" "}
            {receitaData.habilitarRotuloNutricional
              ? "Habilitado"
              : "Desabilitado"}
          </p>
        </div>

        <div className="rotulo-options">
          <h3>Configurações do Rótulo Nutricional</h3>
          <div className="rotulo-config">
            <div className="rotulo-format">
              <h4>Formato do Rótulo:</h4>
              <div className="rotulo-buttons">
                {FORMATO_ROTULO_OPCOES.map((opcao) => (
                  <button
                    key={opcao.valor}
                    className={`rotulo-btn ${
                      receitaData.formatoRotulo === opcao.valor ? "active" : ""
                    }`}
                    onClick={() => atualizarFormatoRotulo(opcao.valor)}
                  >
                    {opcao.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rotulo-actions">
              <SubmitButton
                title="Baixar Rótulo"
                onClick={handleDownloadRotulo}
                variant="secondary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="control-buttons">
        <div className="container-control-home">
          <button onClick={handleHome}>
            <HouseFill />
          </button>
        </div>
        <div className="container-control-button">
          <SubmitButton
            title="Baixar PDF Completo"
            onClick={handleDownloadPDF}
            variant="submit"
          />
        </div>
      </div>
    </Container>
  );
};
