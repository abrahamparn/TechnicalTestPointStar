import { createContainer, asFunction, asValue } from "awilix";
import { getClient } from "./infra/db/index.js";
import { logger } from "./infra/logger/index.js";
import { env } from "./config/index.js";
import { makeTestDbRepository } from "./core/repositories/testDb.repository.js";

// test import //! Remove this later
import { makeTestDbService } from "./core/services/testDb.service.js";

// Authentication import
import { makeAuthService } from "./core/services/auth.service.js";
import { makeAuthRepository } from "./core/repositories/auth.repository.js";

// Email import
import { makeMailerService } from "./infra/mailer/index.js";

// Note import
import { makeNoteService } from "./core/services/note.service.js";
import { makeNoteRepository } from "./core/repositories/note.repository.js";

// Create the DI container
const container = createContainer();

// Register infrastructure components
container.register({
  logger: asValue(logger),
  env: asValue(env),
  prisma: asValue(getClient()),
});

// Core application components
container.register({
  testDbRepository: asFunction(makeTestDbRepository).singleton(),
  testDbService: asFunction(makeTestDbService).singleton(),

  // Authentication service
  authService: asFunction(makeAuthService).singleton(),
  authServiceRepository: asFunction(makeAuthRepository).singleton(),

  // Send email
  mailerService: asFunction(makeMailerService).singleton(),

  // note service
  noteServiceRepository: asFunction(makeNoteRepository).singleton(),
  noteService: asFunction(makeNoteService).singleton(),
});

export default container;
