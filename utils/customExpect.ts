import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';

let aPILogger: APILogger;

export const setCostomExpectLogger = (logger: APILogger) => {
    aPILogger = logger;
}

declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T> {
            shouldEqual(expected: T): R;
            shouldBeLessThanOrEqual(expected: T): R;
        }
    }
}


export const expect = baseExpect.extend({
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
