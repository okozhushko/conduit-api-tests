import { test as base } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { APILogger } from "../utils/logger";    
import { setCostomExpectLogger } from "./customExpect";
import { config } from "../api-test.config";
import { createToken } from "../helpers/createToken";

export type TestOptions = {
    api: RequestHandler;
    config: typeof config;
}

export type WorkerFixture = {
    authToken: string;
}

export const test = base.extend<TestOptions, WorkerFixture>({
    authToken: [ async ({}, use) => {
        const authToken = await createToken(config.userEmail, config.userPassword);
        await use(authToken);
    },{ scope: 'worker' } ],

    api: async({request, authToken}, use) => {
        const logger = new APILogger();
        setCostomExpectLogger(logger);
        const reauestHandler = new RequestHandler(request, config.apiUrl, logger, authToken);
        await use(reauestHandler);
    },
    config: async ({}, use) => {
        await use(config);
    }
})
