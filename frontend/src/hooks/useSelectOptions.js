// hooks/useSelectOptions.js
import { useMemo } from "react";

export const useSelectOptions = (type, clients, documents) => {
  // Formata as opções baseadas no tipo
  const formatOption = (item, itemType) => {
    if (itemType === "clients") {
      return {
        value: item.id,
        label: item.nome_completo,
        data: item,
      };
    } else if (itemType === "documents") {
      return {
        value: item.id,
        label: `Documento - ${item.id} - ${item.receita_nome}`,
        data: item,
      };
    }
    return null;
  };

  // Opções iniciais do cache
  const initialOptions = useMemo(() => {
    if (type === "clients") {
      return clients.map(cliente => formatOption(cliente, type));
    } else if (type === "documents") {
      return documents.map(documento => formatOption(documento, type));
    }
    return [];
  }, [clients, documents, type]);

  // Função para buscar opções da API
  const fetchOptions = async (inputValue, endpoint, itemType, initialOpts) => {
    // Se não digitou nada ou digitou menos de 3 caracteres, retorna do cache
    if (!inputValue || inputValue.length < 3) {
      return initialOpts;
    }

    try {
      const url = `http://localhost:8000/api/${endpoint}?search=${encodeURIComponent(inputValue)}`;
      const response = await fetch(url, { credentials: "include" });
      
      if (!response.ok) throw new Error("Erro na requisição");
      
      const data = await response.json();
      return data.map(item => formatOption(item, itemType));
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
      // Em caso de erro, retorna opções do cache filtradas
      return initialOpts.filter(option => 
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
  };

  return {
    initialOptions,
    fetchOptions: (inputValue, endpoint) => 
      fetchOptions(inputValue, endpoint, type, initialOptions),
  };
};