import { RequestHandler } from "../utils/request-handler";
import { config } from "../api-test.config";
import { APILogger } from "../utils/logger";
import { request } from "@playwright/test";

export async function createToken(email: string, password: string) {
    const context = await request.newContext();
    const api = new RequestHandler(context, config.apiUrl, new APILogger());

    try {
        const tokenResponse = await api
            .path("/users/login")
            .body({ user: { email: email, password: password } })
            .postRequest(200);
        return "Token " + tokenResponse.user.token;
    } finally {
        await context.dispose();
    }
}
