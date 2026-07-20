export type DatabaseQuery = {
  collection: "movies" | "users" | "reviews";

  operation: "find" | "count" | "aggregate";

  filter?: Record<string, unknown>;

  pipeline?: Record<string, unknown>[];
};
