// contexts/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

// Tipos de ações
const ACTION_TYPES = {
  SET_LOADING: "SET_LOADING",
  SET_USER: "SET_USER",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  LOGOUT: "LOGOUT",
};

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        isAuthenticated: false,
        user: null,
      };

    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };

    case ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticação ao inicializar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

      const result = await authService.getUser();

      if (result.status === 200) {
        dispatch({ type: ACTION_TYPES.SET_USER, payload: result.data });
      } else {
        dispatch({ type: ACTION_TYPES.LOGOUT });
      }
    } catch (error) {
      dispatch({ type: ACTION_TYPES.LOGOUT });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });

      const result = await authService.login(credentials);

      if (result.status === 200) {
        await checkAuth(); // Busca os dados do usuário após login
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: result.data?.erro || "Erro ao fazer login",
        });
        return { success: false, error: result.data?.erro };
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: error.message || "Erro ao fazer login",
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });

      const result = await authService.register(userData);

      if (result.status === 201) {
        await checkAuth(); // Busca os dados do usuário após registro
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: result.data?.erro || "Erro ao criar conta",
        });
        return { success: false, error: result.data?.erro };
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: error.message || "Erro ao criar conta",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const result = await authService.logout();
      if (result.status === 200) {
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: result.data?.erro || "Erro ao sair da conta",
        });
        return { success: false, error: result.data?.erro };
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      dispatch({ type: ACTION_TYPES.LOGOUT });
    }
  };

  const clearError = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
