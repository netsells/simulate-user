import SimulateUser from '../../src/index';
import app from './app.html';

describe('SimulateUser', () => {
    beforeEach(() => {
        document.body.innerHTML = app;
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

    describe('finders', () => {
        let user;

        beforeEach(() => {
            user = new SimulateUser();
        });

        describe('querySelectorAll', () => {
            it('returns all elements matching the query', () => {
                const labels = user.querySelectorAll('label');

                expect(labels.length).toBe(5);
                expect(labels[0].node.textContent).toBe('Input');
                expect(labels[4].node.textContent).toBe('File');
            });
        });
    });
});
