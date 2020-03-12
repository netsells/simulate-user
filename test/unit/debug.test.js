import { DebugUser } from '../../src/index';

import app from './app.html';

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
            });
        });

        it('will emit afterCall', () => {
            expect(afterCall).toHaveBeenCalledWith({
                method: 'find',
                args: [{ text: 'Input' }],
                returned: expect.any(Promise),
            });
        });

        it('adds to the logs', () => {
            expect(user.logs).toEqual([{
                callback: 'beforeCall',
                args: [{
                    method: 'find',
                    args: [{ text: 'Input' }],
                }],
            }, {
                callback: 'afterCall',
                args: [{
                    method: 'find',
                    args: [{ text: 'Input' }],
                    returned: expect.any(Promise),
                }],
            }]);
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
            user.find({ text: 'Textarea' });

            expect(beforeCall).toHaveBeenCalledWith({
                method: 'find',
                args: [{ text: 'Textarea' }],
            });
        });

        it('adds to the logs', () => {
            expect(user.logs).toEqual([{
                callback: 'beforeCall',
                args: [{
                    method: 'getElementById',
                    args: ['a'],
                }],
            }, {
                child: [],
            }, {
                callback: 'afterCall',
                args: [{
                    method: 'getElementById',
                    args: ['a'],
                    returned: expect.anything(),
                }],
            }]);
        });

        describe('when calling methods on the child wrapper', () => {
            beforeEach(async () => {
                await inputWrapper.click();
            });

            it('will add to the child logs', () => {
                expect(user.logs).toEqual([{
                    callback: 'beforeCall',
                    args: [{
                        method: 'getElementById',
                        args: ['a'],
                    }],
                }, {
                    child: [{
                        callback: 'beforeCall',
                        args: [{
                            method: 'click',
                            args: [],
                        }],
                    }, {
                        callback: 'afterCall',
                        args: [{
                            method: 'click',
                            args: [],
                            returned: expect.any(Promise),
                        }],
                    }],
                }, {
                    callback: 'afterCall',
                    args: [{
                        method: 'getElementById',
                        args: ['a'],
                        returned: expect.anything(),
                    }],
                }]);
            });
        });
    });
});
