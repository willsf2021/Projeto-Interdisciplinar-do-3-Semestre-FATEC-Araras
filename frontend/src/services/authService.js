// services/authService.js
const API_BASE_URL = "http://localhost:8000/api";

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || `Erro HTTP: ${response.status}`);
  }

  return {
    status: response.status,
    data,
  };
};

const handleError = (error) => {
  if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
    throw new Error("Erro de conexão. Verifique sua internet.");
  }
  throw error;
};

export const authService = {
  login: async ({ email, password, remember }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
        credentials: "include",
      });

      return await handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  register: async ({ email, password, name, type }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/registro/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, type }),
        credentials: "include",
      });

      return await handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-user/`, {
        method: "GET",
        credentials: "include",
      });

      return await handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: "POST",
        credentials: "include",
      });

      return await handleResponse(response);
    } catch (error) {
      return {
        status: 200,
        data: { mensagem: "Logout realizado" },
      };
    }
  },

  refreshToken: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/refresh/`, {
        method: "POST",
        credentials: "include",
      });

      return await handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  verifySession: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-session/`, {
        method: "GET",
        credentials: "include",
      });

      return await handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  deleteAccount: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete-account/`, {
        method: "DELETE",
        credentials: "include",
      });

      return await handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
};
