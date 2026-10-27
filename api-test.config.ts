// Supported values: "prod" (default) or "qa"
const env = process.env.TEST_ENV || "prod"
console.log('Test environment ' + env);

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const config = {
    apiUrl: "https://conduit-api.bondaracademy.com/api",
    userEmail: "pwapiuser@test.com",
    userPassword: "Welcome"
}

if (env === "qa") {
    config.userEmail = "pwtest@test.com";
    config.userPassword = "Welcome2";
}
if (env === "prod") {
    config.userEmail = process.env.PROD_USERNAME as string
    config.userPassword = process.env.PROD_PASSWORD as string
}

export {config}