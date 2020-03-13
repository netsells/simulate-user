import { getDebugUser } from '../../src/index';
import app from './app.html';

const DebugUser = getDebugUser();

DebugUser.timeoutLimit = 5;
DebugUser.sleepTime = 0.1;

describe('DebugUser', () => {
    let user;
    let beforeCall;
    let afterCall;

    beforeEach(() => {
        document.body.innerHTML = app;
        user = new DebugUser();
        beforeCall = jest.fn();
        afterCall = jest.fn();
        user.on('beforeCall', beforeCall);
        user.on('afterCall', afterCall);
    });

    describe('when calling', () => {
        beforeEach(() => {
            user.find({ text: 'Input' });
        });

        it('will emit beforeCall', () => {
            expect(beforeCall).toHaveBeenCalledWith({
                method: 'find',
                args: [{ text: 'Input' }],
                target: user,
            });
        });

        it('will emit afterCall', () => {
            expect(afterCall).toHaveBeenCalledWith({
                method: 'find',
                args: [{ text: 'Input' }],
                target: user,
                returned: expect.any(Promise),
            });
        });
    });

    describe('with a child wrapper', () => {
        let inputWrapper;

        beforeEach(() => {
            inputWrapper = user.getElementById('a');
        });

        it('will return debug child wrappers', () => {
            expect(inputWrapper).toBeInstanceOf(DebugUser);
        });

        it('will emit beforeCall on the existing callbacks', () => {
            inputWrapper.find({ text: 'Textarea' });

            expect(beforeCall.mock.calls[1]).toEqual([{
                method: 'find',
                args: [{ text: 'Textarea' }],
                target: inputWrapper,
            }]);
        });
    });
});
