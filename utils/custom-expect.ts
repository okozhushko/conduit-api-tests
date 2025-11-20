import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';
import { validateSchema } from './schema-validator';

let aPILogger: APILogger;

export const setCostomExpectLogger = (logger: APILogger) => {
    aPILogger = logger;
}

declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T> {
            shouldEqual(expected: T): R;
            shouldBeLessThanOrEqual(expected: T): R;
            shouldMatchSchema(dirName: string, fileName: string, createSchemaFlag?: boolean): Promise<R>
        }
    }
}


export const expect = baseExpect.extend({
    async shouldMatchSchema(resived: any, dirName: string, fileName: string, createSchemaFlag: boolean = false) { // to refresh schema need to change bolean to TRUE
        let pass: boolean;
        let message: string = '';

        try {
            await validateSchema(dirName, fileName, resived, createSchemaFlag)
            pass = true;
            message = 'Schema validation passed';

        } catch (e: any) {
            pass = false;
            const logs = aPILogger.getRecentLogs();
            message = `${e.message}\n\n Recent API Activity:\n${logs}`
        }
        return {
            message: () => message,
            pass
        };
    },
    shouldEqual(resived: any, expected: any) {
        let pass: boolean;
        let logs: string = ''

        try {
            baseExpect(resived).toEqual(expected);
            pass = true;
            if (this.isNot) {
                logs = aPILogger.getRecentLogs();
            }
        } catch (e: any) {
            pass = false;
            logs = aPILogger.getRecentLogs();
        }

        const hint = this.isNot ? 'not' : '';
        const message = this.utils.matcherHint('shouldEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(resived)}\n` +
            `Recent API Activity Logs:\n${logs}`
        return {
            message: () => message,
            pass
        };
    },

    shouldBeLessThanOrEqual(resived: any, expected: any) {
        let pass: boolean;
        let logs: string = ''

        try {
            baseExpect(resived).toBeLessThanOrEqual(expected);
            pass = true;
            if (this.isNot) {
                logs = aPILogger.getRecentLogs();
            }
        } catch (e: any) {
            pass = false;
            logs = aPILogger.getRecentLogs();
        }

        const hint = this.isNot ? 'not' : '';
        const message = this.utils.matcherHint('shouldBeLessThanOrEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(resived)}\n` +
            `Recent API Activity Logs:\n${logs}`
        return {
            message: () => message,
            pass
        };
    }
})
