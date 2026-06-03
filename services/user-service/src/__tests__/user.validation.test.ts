import { changePasswordSchema, roleSchema, updateMeSchema } from "../modules/users/user.validation";

describe("user validation", () => {
  it("accepts a valid profile update", () => {
    const result = updateMeSchema.safeParse({
      firstName: "Amina",
      lastName: "Nkurunziza"
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid role", () => {
    const result = roleSchema.safeParse({
      role: "manager"
    });

    expect(result.success).toBe(false);
  });

  it("rejects identical password changes", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "Password123",
      newPassword: "Password123"
    });

    expect(result.success).toBe(false);
  });
});
