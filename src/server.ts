import moduleAlias from "module-alias";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

moduleAlias.addAliases({
  "@": path.resolve(__dirname, "../src"),
});

import mongoose from "mongoose";
import { createApp } from "./app";

const databaseUrl = process.env.DATABASE!;

mongoose.connect(databaseUrl).catch((err) => {
  console.error("DB connect error", err);
});

(async () => {
  const port = process.env.PORT!;
  const app = createApp();
  app.set("port", port);
  const server = app.listen(port, () => {
    const address = server.address();
    if (address && typeof address === "object") {
      console.log(`Express running → On PORT: ${(address as any).port}`);
    } else {
      console.log("Express running → Unable to determine PORT");
    }
  });
})();
