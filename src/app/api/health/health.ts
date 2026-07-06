export interface HealthResult {
  body: {
    database: "reachable" | "unreachable";
    service: "careerorbit";
    status: "degraded" | "ok";
  };
  status: 200 | 503;
}

export async function checkHealth(
  queryDatabase: () => Promise<unknown>,
): Promise<HealthResult> {
  try {
    await queryDatabase();
    return {
      body: { database: "reachable", service: "careerorbit", status: "ok" },
      status: 200,
    };
  } catch {
    return {
      body: {
        database: "unreachable",
        service: "careerorbit",
        status: "degraded",
      },
      status: 503,
    };
  }
}
