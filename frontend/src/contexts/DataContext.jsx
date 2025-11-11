import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useApi } from "../hooks/useApi";
import { useNotification } from "../hooks/useNotification";

const DataContext = createContext();

// Tipos de ações
const ACTION_TYPES = {
  SET_LOADING: "SET_LOADING",

  SET_CLIENTS: "SET_CLIENTS",
  SET_DOCUMENTS: "SET_DOCUMENTS",
  SET_FOODS: "SET_FOODS",

  SET_ERROR: "SET_ERROR",
  CLEAR_DATA: "CLEAR_DATA",

  ADD_CLIENT: "ADD_CLIENT",
  ADD_DOCUMENT: "ADD_DOCUMENT",
  ADD_FOOD: "ADD_FOOD",

  UPDATE_CLIENT: "UPDATE_CLIENT",
  UPDATE_DOCUMENT: "UPDATE_DOCUMENT",
  UPDATE_FOOD: "UPDATE_FOOD",

  DELETE_CLIENT: "DELETE_CLIENT",
  DELETE_DOCUMENT: "DELETE_DOCUMENT",
  DELETE_FOOD: "DELETE_FOOD",
};

// Estado inicial
const initialState = {
  clients: [],
  documents: [],
  foods: [],
  loading: false,
  error: null,
  lastFetch: null,
};

// Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTION_TYPES.SET_CLIENTS:
      return {
        ...state,
        clients: action.payload,
        lastFetch: Date.now(),
        loading: false,
        error: null,
      };

    case ACTION_TYPES.SET_DOCUMENTS:
      return {
        ...state,
        documents: action.payload,
        lastFetch: Date.now(),
        loading: false,
        error: null,
      };

    case ACTION_TYPES.SET_FOODS:
      return {
        ...state,
        foods: action.payload,
        lastFetch: Date.now(),
        loading: false,
        error: null,
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ACTION_TYPES.CLEAR_DATA:
      return initialState;

    case ACTION_TYPES.ADD_CLIENT:
      return {
        ...state,
        clients: [action.payload, ...state.clients],
      };

    case ACTION_TYPES.ADD_DOCUMENT:
      return {
        ...state,
        documents: [action.payload, ...state.documents],
      };

    case ACTION_TYPES.ADD_FOOD:
      return {
        ...state,
        foods: [action.payload, ...state.foods],
      };

    case ACTION_TYPES.UPDATE_CLIENT:
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.id === action.payload.id ? action.payload : client
        ),
      };

    case ACTION_TYPES.UPDATE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.map((document) =>
          document.id === action.payload.id ? action.payload : document
        ),
      };

    case ACTION_TYPES.UPDATE_FOOD:
      return {
        ...state,
        foods: state.foods.map((food) =>
          food.id === action.payload.id ? action.payload : food
        ),
      };

    case ACTION_TYPES.DELETE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter((client) => client.id !== action.payload),
      };

    case ACTION_TYPES.DELETE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter(
          (document) => document.id !== action.payload
        ),
      };

    case ACTION_TYPES.DELETE_FOOD:
      return {
        ...state,
        foods: state.foods.filter((food) => food.id !== action.payload),
      };

    default:
      return state;
  }
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const { isAuthenticated } = useAuth();
  const { apiFetchJson } = useApi();
  const { notify } = useNotification();

  // Carregar dados automaticamente quando usuário se autenticar
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    } else {
      // Limpar dados quando deslogar
      dispatch({ type: ACTION_TYPES.CLEAR_DATA });
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

      const [clientsData, documentsData, foodsData] = await Promise.all([
        apiFetchJson("http://localhost:8000/api/listar-clientes/"),
        apiFetchJson("http://localhost:8000/api/listar-documentos/"),
        apiFetchJson("http://localhost:8000/api/alimentos/"),
      ]);

      dispatch({ type: ACTION_TYPES.SET_CLIENTS, payload: clientsData });
      dispatch({ type: ACTION_TYPES.SET_DOCUMENTS, payload: documentsData });
      dispatch({ type: ACTION_TYPES.SET_FOODS, payload: foodsData });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
      notify("Erro ao carregar dados", "error");
    }
  };

  const refreshClients = async () => {
    try {
      const clientsData = await apiFetchJson(
        "http://localhost:8000/api/listar-clientes/"
      );
      dispatch({ type: ACTION_TYPES.SET_CLIENTS, payload: clientsData });
      return { success: true, data: clientsData };
    } catch (error) {
      notify("Erro ao atualizar clientes", "error");
      return { success: false, error: error.message };
    }
  };

  const refreshDocuments = async () => {
    try {
      const documentsData = await apiFetchJson(
        "http://localhost:8000/api/listar-documentos/"
      );
      dispatch({ type: ACTION_TYPES.SET_DOCUMENTS, payload: documentsData });
      return { success: true, data: documentsData };
    } catch (error) {
      notify("Erro ao atualizar documentos", "error");
      return { success: false, error: error.message };
    }
  };

  const refreshFoods = async () => {
    try {
      const foodsData = await apiFetchJson(
        "http://localhost:8000/api/alimentos/"
      );
      dispatch({ type: ACTION_TYPES.SET_FOODS, payload: foodsData });
      return { success: true, data: foodsData };
    } catch (error) {
      notify("Erro ao atualizar alimentos", "error");
      return { success: false, error: error.message };
    }
  };

  const addClient = (client) => {
    dispatch({ type: ACTION_TYPES.ADD_CLIENT, payload: client });
  };

  const addDocument = (document) => {
    dispatch({ type: ACTION_TYPES.ADD_DOCUMENT, payload: document });
  };

  const addFood = (food) => {
    dispatch({ type: ACTION_TYPES.ADD_FOOD, payload: food });
  };

  const updateClient = (client) => {
    dispatch({ type: ACTION_TYPES.UPDATE_CLIENT, payload: client });
  };

  const updateDocument = (document) => {
    dispatch({ type: ACTION_TYPES.UPDATE_DOCUMENT, payload: document });
  };

  const updateFood = (food) => {
    dispatch({ type: ACTION_TYPES.UPDATE_FOOD, payload: food });
  };

  const deleteClient = (clientId) => {
    dispatch({ type: ACTION_TYPES.DELETE_CLIENT, payload: clientId });
  };

  const deleteDocument = (documentId) => {
    dispatch({ type: ACTION_TYPES.DELETE_DOCUMENT, payload: documentId });
  };

  const deleteFood = (foodId) => {
    dispatch({ type: ACTION_TYPES.DELETE_FOOD, payload: foodId });
  };

  const clearError = () => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: null });
  };

  const value = {
    ...state,
    loadAllData,
    refreshClients,
    refreshDocuments,
    refreshFoods,
    addClient,
    addDocument,
    addFood,
    updateClient,
    updateDocument,
    updateFood,
    deleteClient,
    deleteDocument,
    deleteFood,
    clearError,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData deve ser usado dentro de um DataProvider");
  }
  return context;
};
