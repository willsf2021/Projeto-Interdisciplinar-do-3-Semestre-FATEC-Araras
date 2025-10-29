// services/authService.js
export const authService = {
  login: async ({ email, password, remember }) => {
    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember }),
      credentials: "include",
    });

    const data = await response.json();
    return {
      status: response.status,
      data,
    };
  },
  register: async ({ email, password, name, type }) => {
    const response = await fetch("http://localhost:8000/api/registro/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, type }),
      credentials: "include",
    });

    const data = await response.json();
    return {
      status: response.status,
      data,
    };
  },
};
