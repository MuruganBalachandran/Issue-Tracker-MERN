// region imports
import dotenv from "dotenv";
// endregion

// region load env
dotenv.config();
// endregion

// region parse
let env = {};

try {
  env = JSON.parse(process.env.APP || "{}");
} catch (error) {
  console.error("Invalid APP JSON in .env");
  process.exit(1);
}
// endregion

console.log(env)

// region exports
export { env };
// endregion
