import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const securityService = {
  async hashPassword(value: string) {
    return bcrypt.hash(value, 12);
  },
  issueToken(subject: string) {
    return jwt.sign({ sub: subject }, process.env.JWT_SECRET || "change-me", {
      expiresIn: "1h"
    });
  },
  describe() {
    return "bcrypt password hashing + JWT issuance";
  }
};
