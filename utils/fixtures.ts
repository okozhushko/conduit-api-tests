import { test as base } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { APILogger } from "../utils/logger";    
import { setCostomExpectLogger } from "./customExpect";
import { config } from "../api-test.config";

export type TestOptions = {
    api: RequestHandler;
    config: typeof config;
}

export const test = base.extend<TestOptions>({
    api: async({request}, use) => {
        const logger = new APILogger();
        setCostomExpectLogger(logger);
        const reauestHandler = new RequestHandler(request, config.apiUrl, logger);
        await use(reauestHandler);
    },
    config: async ({}, use) => {
        await use(config);
    }
})
