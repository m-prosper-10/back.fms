export const authService = {
  describe() {
    return {
      module: "auth",
      status: "scaffold",
      responsibilities: ["register", "login", "logout", "refresh-token"]
    };
  }
};
