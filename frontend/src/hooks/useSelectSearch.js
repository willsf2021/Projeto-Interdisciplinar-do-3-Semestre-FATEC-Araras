// hooks/useSelectSearch.js
import { useApi } from "./useApi";
import { useSelectOptions } from "./useSelectOptions";

export const useSelectSearch = (type, clients, documents) => {
  const { apiFetchJson } = useApi();
  const { initialOptions, fetchOptions: baseFetchOptions } = useSelectOptions(
    type,
    clients,
    documents
  );

  // Versão melhorada com useApi (com auto-refresh de token)
  const fetchOptionsWithApi = async (inputValue, endpoint) => {
    if (!inputValue || inputValue.length < 3) {
      return initialOptions;
    }

    try {
      let url = `http://localhost:8000/api/${endpoint}`;
      if (inputValue) {
        url += `?search=${encodeURIComponent(inputValue)}`;
      }

      const data = await apiFetchJson(url);

      // Formata os dados recebidos
      return data.map((item) => ({
        value: item.id,
        label: (() => {
          // IIFE para executar imediatamente
          switch (type) {
            case "clients":
              return item.nome_completo;
            case "documents":
              return `Documento - ${item.id} - ${item.receita_nome}`;
            case "foods":
              return item.nome;
            default:
              return "Item sem nome";
          }
        })(),
        data: item,
      }));
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
      // Fallback para o cache local
      return initialOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
  };

  return {
    initialOptions,
    fetchOptions: (inputValue, endpoint) =>
      fetchOptionsWithApi(inputValue, endpoint),
  };
};
