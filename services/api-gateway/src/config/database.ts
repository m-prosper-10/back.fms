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
  return configuredDatabases.map((database) => database.name).join(", ");
}
