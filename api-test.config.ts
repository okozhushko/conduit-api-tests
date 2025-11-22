const processNew = process.env.TEST_ENV
const env = processNew || "prod" //"dev" is the default environment and could be changed to "test" or "prod"
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
// if (env === "stage") {
//     config.userEmail = "stage.user@test.com";
//     config.userPassword = "stagepassword";
// }
if (env === "prod") {
    config.userEmail = process.env.PROD_USERNAME as string
    config.userPassword = process.env.PROD_PASSWORD as string
}

export {config}