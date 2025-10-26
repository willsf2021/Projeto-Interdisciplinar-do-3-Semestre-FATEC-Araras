// services/authService.js
export const authService = {
  login: async ({ email, password }) => {
    // Exemplo de chamada real (substitua o endpoint pela sua API)
    // const response = await fetch("http://localhost:3000/api/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await response.json();
    // if (!response.ok) throw new Error(data.message || "Erro ao fazer login");
    // return data;

    // ⚙️ Simulação temporária (sem dados mocados fixos)
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email && password) {
      return { token: "fake-jwt-token", user: { email } };
    } else {
      throw new Error("E-mail ou senha inválidos");
    }
  },
  register: async ({ name, email, password, confirmPassword }) => {
    // Exemplo de chamada real:
    // const response = await fetch("http://localhost:3000/api/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, email, password }),
    // });
    // const data = await response.json();
    // if (!response.ok) throw new Error(data.message || "Erro ao registrar");
    // return data;

    // Simulação temporária
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!name || !email || !password || !confirmPassword) {
      throw new Error("Preencha todos os campos");
    }

    if (password !== confirmPassword) {
      throw new Error("As senhas não coincidem");
    }

    return { token: "fake-jwt-token", user: { name, email } };
  },
};
