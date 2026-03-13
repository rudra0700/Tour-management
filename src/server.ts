import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import seedSuperAdmin from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  console.log(`Running on ${envVars.NODE_ENV} mode`);
  try {
    await mongoose.connect(envVars.DB_URL);

    console.log("Connected to DB");

    server = app.listen(5000, () => {
      console.log(`Tour management backend is running on PORT ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer()
  await seedSuperAdmin()
})()


// Unhandled rejection error - when we forgot to catch the error in promise blog.
// Promise.reject(new Error("I forgot to catch the error")) // uncomment this line to check the unhandledRejection error.
process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection detected, server is shutting down...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// Uncaught rejection error - its a king of error which is not connected with promise, can be basically typing something unknown out of mistake,like unknow variable or something type in regardless , and mistakenly this error is also does not catch by catch blog.
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception detected, server is shutting down...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// throw new Error("I forgot to catch the local error") // uncomment this line to check the uncaught rejection error.

//  * Signal Termination or sigTerm - We host our local express app into cloud server unfortunately that server may be go into maintainance phase. During that time the cloud system sent some signal that , their system will shut down for a moment . so thats why we need to catch to signal termination so that we can gracefully shut down our server

process.on("SIGTERM", () => {
  console.log("SIGTERM signal is received, server is shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal is received, server is shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
