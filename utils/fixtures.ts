import { test as base } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { APILogger } from "../utils/logger";
import { setCostomExpectLogger } from "./customExpect";

export type TestOptions = {
    api: RequestHandler;
}

export const test = base.extend<TestOptions>({
    api: async({request}, use) => {
        const baseUrl = "https://conduit-api.bondaracademy.com/api";
        const logger = new APILogger();
        setCostomExpectLogger(logger);
        const reauestHandler = new RequestHandler(request, baseUrl, logger);
        await use(reauestHandler);
    }
})
