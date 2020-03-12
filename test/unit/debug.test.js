import { DebugUser } from '../../src/index';

import app from './app.html';

DebugUser.timeoutLimit = 5;
DebugUser.sleepTime = 0.1;

describe('DebugUser', () => {
    let user;
    let beforeCall;
    let afterCall;
    let inputWrapper;

    beforeEach(() => {
        document.body.innerHTML = app;
        user = new DebugUser();
        beforeCall = jest.fn();
        afterCall = jest.fn();
        user.on('beforeCall', beforeCall);
        user.on('afterCall', afterCall);
    });

    // it('will return debug child wrappers', () => {
    //     inputWrapper = user.getElementById('a');
    //     expect(inputWrapper.debug).toBe(true);
    // });

    it('will emit beforeCall', () => {
        user.find({ text: 'Input' });

        expect(beforeCall).toHaveBeenCalledWith({
            method: 'find',
            args: [{ text: 'Input' }],
        });
    });

    it('will emit afterCall', () => {
        user.find({ text: 'Input' });

        expect(afterCall).toHaveBeenCalledWith({
            method: 'find',
            args: [{ text: 'Input' }],
            returned: expect.any(Promise),
        });
    });
});
