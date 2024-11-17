import "reflect-metadata";
import { DataSource, Repository } from "typeorm";
import { User } from "./entities";

// Define repository types
interface DatabaseRepositories {
  user: Repository<User>;
}

// Initialize repositories as null
let repositories: DatabaseRepositories | null = null;

const entities = [User];

export async function initializeDatabase({
  host,
  username,
  password,
  database,
}: {
  host: string;
  username: string;
  password: string;
  database: string;
}): Promise<void> {
  try {
    const dataSource = new DataSource({
      host,
      username,
      password,
      schema: "public",
      type: "postgres",
      database,
      port: 6543,
      driver: require("pg"),
      ssl: {
        rejectUnauthorized: false,
      },
      entities,
      synchronize: process.env.NODE_ENV !== "production", // Only synchronize in development
    });

    await dataSource.initialize();
    console.info("Database connected successfully");

    // Initialize all repositories using a loop
    repositories = {} as DatabaseRepositories;
    entities.forEach((entity) => {
      const entityName =
        entity.name.charAt(0).toLowerCase() + entity.name.slice(1);
      (repositories as any)[entityName] = dataSource.getRepository(entity);
    });
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
}

// Helper function to ensure repositories are initialized
function getRepositories(): DatabaseRepositories {
  if (!repositories) {
    throw new Error(
      "Database repositories not initialized. Call initializeDatabase() first."
    );
  }
  return repositories;
}

// Export a function to get repositories
export const getRepository = <K extends keyof DatabaseRepositories>(
  name: K
): DatabaseRepositories[K] => {
  return getRepositories()[name];
};
