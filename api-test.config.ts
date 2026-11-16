// TEST_ENV: "prod" (default, credentials from .env / CI secrets) or "qa" (shared test account)
const env = process.env.TEST_ENV || "prod"

const credentials = env === "qa"
    ? { userEmail: "pwtest@test.com", userPassword: "Welcome2" }
    : { userEmail: process.env.PROD_USERNAME as string, userPassword: process.env.PROD_PASSWORD as string }

const config = {
    apiUrl: "https://conduit-api.bondaracademy.com/api",
    ...credentials
}

export {config}
