import { configuredDatabases } from "../config/database";

export const databaseService = {
  list() {
    return configuredDatabases;
  }
};
