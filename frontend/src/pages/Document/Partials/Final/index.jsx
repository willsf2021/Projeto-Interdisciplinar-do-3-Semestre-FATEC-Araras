import { Container } from "./style";
import { SubmitButton } from "../../../../components/Forms/SubmitButton";
import { HouseFill } from "react-bootstrap-icons";
import { useApi } from "../../../../hooks/useApi";
import { useState, useEffect } from "react";

// Opções de formato do rótulo
const FORMATO_ROTULO_OPCOES = [
  { valor: "vertical", label: "Vertical", imagem: "vertical.png" },
  { valor: "horizontal", label: "Horizontal", imagem: "horizontal.png" },
  {
    valor: "quebrado_vertical",
    label: "Quebrado Vertical",
    imagem: "vertical_quebrado.png",
  },
  {
    valor: "quebrado_horizontal",
    label: "Quebrado Horizontal",
    imagem: "horizontal_quebrado.png",
  },
];

export const Final = ({
  documentoId,
  receitaId,
  documentoData,
  receitaData,
  notify,
}) => {
  const [formatoSelecionado, setFormatoSelecionado] = useState(
    receitaData.formatoRotulo || "vertical"
  );
  const { apiFetch } = useApi();

  // Notificar ao entrar na página
  useEffect(() => {
    notify("Documento criado com sucesso!", "success");
  }, []);

  // Atualiza o formato local quando receitaData muda
  useEffect(() => {
    if (receitaData.formatoRotulo) {
      setFormatoSelecionado(receitaData.formatoRotulo);
    }
  }, [receitaData.formatoRotulo]);

  // Função para atualizar o formato do rótulo
  const atualizarFormatoRotulo = async (formato) => {
    try {
      setFormatoSelecionado(formato);

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

      // Atualiza o estado local se necessário
      if (receitaData.onFormatoRotuloChange) {
        receitaData.onFormatoRotuloChange(formato);
      }
    } catch (error) {
      console.error("Erro ao atualizar formato do rótulo:", error);
      // Reverte em caso de erro
      setFormatoSelecionado(receitaData.formatoRotulo);
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
      notify("Documento completo gerado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      notify("Erro ao gerar documento. Tente novamente.", "error");
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
      const response = await apiFetch(
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

  // Encontra a opção selecionada atual
  const opcaoSelecionada = FORMATO_ROTULO_OPCOES.find(
    (opcao) => opcao.valor === formatoSelecionado
  );

  return (
    <Container>
      <div className="final-content">
        <h2>{receitaData.nome}</h2>

        {/* Visualização do modelo do rótulo */}
        <div className="rotulo-preview-section">
          <div className="preview-container">
            {opcaoSelecionada && (
              <div className="modelo-preview">
                <img
                  src={`./rotulos/${opcaoSelecionada.imagem}`}
                  alt={`Modelo de rótulo ${opcaoSelecionada.label}`}
                  className="preview-image"
                />
                <p className="preview-label">
                  Visualização: {opcaoSelecionada.label}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Configurações do rótulo */}
        <div className="rotulo-config-section">
          <h3>Orientação do Rótulo</h3>

          <div className="rotulo-buttons-grid">
            {FORMATO_ROTULO_OPCOES.map((opcao) => (
              <button
                key={opcao.valor}
                className={`rotulo-btn ${
                  formatoSelecionado === opcao.valor ? "active" : ""
                }`}
                onClick={() => atualizarFormatoRotulo(opcao.valor)}
              >
                {opcao.label}
              </button>
            ))}
          </div>
        </div>

        {/* Botões de download */}
        <div className="download-buttons">
          <SubmitButton
            title="Baixar Rótulo Nutricional"
            onClick={handleDownloadRotulo}
            variant="secondary"
          />
          <SubmitButton
            title="Baixar Documento Completo"
            onClick={handleDownloadPDF}
            variant="submit"
          />
        </div>
      </div>

      {/* Botão Home */}
      <div className="control-buttons">
        <div className="container-control-home">
          <button onClick={handleHome}>
            <HouseFill />
          </button>
        </div>
      </div>
    </Container>
  );
};
