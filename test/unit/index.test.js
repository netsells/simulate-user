import SimulateUser from '../../src/index';
import app from './app.html';

describe('SimulateUser', () => {
    beforeEach(() => {
        document.innerHTML = app;
    });

    describe('constructor', () => {
        it('uses document as default node', () => {
            const user = new SimulateUser();
            expect(user.node).toBe(document);
        });

        it('can use any element as a node', () => {
            const node = document.querySelector('td');

            const user = new SimulateUser(node);
            expect(user.node).toBe(node);
        });
    });
});
