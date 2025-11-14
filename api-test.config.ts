const processNew = process.env.TEST_ENV
const env = processNew || "qa" //"dev" is the default environment and could be changed to "test" or "prod"
console.log('Test environment '+ env);

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
// if (env === "prod") {
//     config.userEmail = "prod.user@test.com";
//     config.userPassword = "prodpassword";
// }

export {config}