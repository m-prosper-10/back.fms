import { loginSchema, registerSchema } from "../modules/auth/auth.validation";

describe("auth validation", () => {
  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse({
      firstName: "Prosper",
      lastName: "Mugisha",
      email: "prosper@example.com",
      password: "StrongPass123"
    });

    expect(result.success).toBe(true);
  });

  it("rejects a weak registration password", () => {
    const result = registerSchema.safeParse({
      firstName: "Prosper",
      lastName: "Mugisha",
      email: "prosper@example.com",
      password: "weak"
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid login email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "Password123"
    });

    expect(result.success).toBe(false);
  });
});
