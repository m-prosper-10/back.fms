import { exampleService } from "../services/exampleService";

describe("exampleService", () => {
  it("echoes a message", () => {
    const result = exampleService.echo("hello");

    expect(result.message).toBe("hello");
  });
});
