export const configuredDatabases = [
  {
    "key": "mongodb",
    "name": "MongoDB"
  },
  {
    "key": "redis",
    "name": "Redis"
  }
] as const;

export function describeDatabaseSetup() {
  if (configuredDatabases.length === 0) {
    return "No database selected";
  }

  return configuredDatabases.map((database) => database.name).join(", ");
}
