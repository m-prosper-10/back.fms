export const exampleService = {
  describe() {
    return {
      apiStyle: "REST",
      logging: "morgan",
      monitoring: "prometheus-ready"
    };
  },

  echo(message: string) {
    return {
      message,
      receivedAt: new Date().toISOString()
    };
  }
};
