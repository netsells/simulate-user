import SimulateUser from '../../src/index';

describe('SimulateUser', () => {
    beforeEach(() => {
        document.innerHTML = '';
    });

    describe('constructor', () => {
        it('uses document as default node', () => {
            const user = new SimulateUser();
            expect(user.node).toBe(document);
        });
    });
});
