import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';
import { validateSchema } from './schema-validator';

let aPILogger: APILogger;

export const setCustomExpectLogger = (logger: APILogger) => {
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
    async shouldMatchSchema(received: any, dirName: string, fileName: string, createSchemaFlag: boolean = false) { // pass createSchemaFlag = true to regenerate the schema from this response
        let pass: boolean;
        let message: string = '';

        try {
            await validateSchema(dirName, fileName, received, createSchemaFlag)
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
    shouldEqual(received: any, expected: any) {
        let pass: boolean;
        let logs: string = ''

        try {
            baseExpect(received).toEqual(expected);
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
            `Received: ${this.utils.printReceived(received)}\n` +
            `Recent API Activity Logs:\n${logs}`
        return {
            message: () => message,
            pass
        };
    },

    shouldBeLessThanOrEqual(received: any, expected: any) {
        let pass: boolean;
        let logs: string = ''

        try {
            baseExpect(received).toBeLessThanOrEqual(expected);
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
            `Received: ${this.utils.printReceived(received)}\n` +
            `Recent API Activity Logs:\n${logs}`
        return {
            message: () => message,
            pass
        };
    }
})
