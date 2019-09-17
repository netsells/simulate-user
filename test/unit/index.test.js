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

            it('works with an array of queries', () => {
                const items = user.querySelectorAll(['label', 'input']);

                expect(items.length).toBe(9);
                expect(items[6].tag).toBe('input');
            });
        });

        describe('getElementById', () => {
            it('gets the element matching ID', () => {
                const el = user.getElementById('a');

                expect(el.tag).toBe('input');
            });
        });

        describe('getElementsByName', () => {
            it('gets the elements matching name', () => {
                const els = user.getElementsByName('foo');

                expect(els.length).toBe(2);
                expect(els[0].tag).toBe('input');
                expect(els[1].tag).toBe('textarea');
            });
        });

        describe('closest', () => {
            it('gets the nearest parent', () => {
                const el = user.getElementById('a');
                const tr = el.closest('tr');

                expect(tr.tag).toBe('tr');
                expect(tr.getElementById('a').tag).toBe('input');
            });
        });

        describe('all', () => {
            it('can get elements by a query', () => {
                const els = user.all({ query: 'input' });
                expect(els.length).toBe(4);
                expect(els[0].tag).toBe('input');
                expect(els[3].tag).toBe('input');
            });

            it('can get elements by text case insensitive', () => {
                const els = user.all({ query: 'label', text: 'input' });

                expect(els.length).toBe(1);
                expect(els[0].tag).toBe('label');
                expect(els[0].text).toBe('Input');
            });

            it('can get elements by text case sensitive', () => {
                let els = user.all({
                    query: 'label',
                    text: 'input',
                    caseSensitive: true,
                });

                expect(els.length).toBe(0);

                els = user.all({
                    query: 'label',
                    text: 'Input',
                    caseSensitive: true,
                });

                expect(els.length).toBe(1);
            });

            it('can get elements by exact text', () => {
                let els = user.all({
                    query: 'label',
                    text: 'inp',
                    exact: true,
                });

                expect(els.length).toBe(0);

                els = user.all({
                    query: 'label',
                    text: 'input',
                    exact: true,
                });

                expect(els.length).toBe(1);
            });

            it('can get elements by child elements text', () => {
                const els = user.all({
                    query: 'td',
                    text: 'input',
                });

                expect(els.length).toBe(1);
                expect(els[0].tag).toBe('td');
                expect(els[0].text).toBe('Input');
            });

            it('can get elements by direct text', () => {
                let els = user.all({
                    query: 'td',
                    text: 'input',
                    direct: true,
                });

                expect(els.length).toBe(0);

                els = user.all({
                    text: 'input',
                    direct: true,
                });

                expect(els.length).toBe(1);
                expect(els[0].tag).toBe('label');
                expect(els[0].text).toBe('Input');
            });

            it('can filter elements by a predicate', () => {
                const els = user.all({
                    query: 'tr',
                    predicate(el) {
                        return el.text === 'Input';
                    },
                });

                expect(els.length).toBe(1);
                expect(els[0].tag).toBe('tr');
                expect(els[0].text).toBe('Input');
            });
        });

        describe('find', () => {
            it('will wait to find an element', async () => {
                const promise = user.find({ query: 'p', text: 'Added' });

                await new Promise(resolve => setTimeout(resolve, 100));

                const p = document.createElement('p');
                p.textContent = 'Added';
                document.body.appendChild(p);

                const wrapper = await promise;

                expect(wrapper.node).toBe(p);
                expect(wrapper.text).toBe('Added');
            });

            it('will timeout if waiting too long', async () => {
                await expect(user.find({ query: 'p', text: 'Added' })).rejects.toThrow();
            });

            it('will find most similar based on text if similar option passed', async () => {
                const els = await user.find({
                    query: 'label',
                    text: 'Inpot',
                    similar: true,
                });

                expect(els.tag).toBe('label');
                expect(els.text).toBe('Input');
            });

            it('will error if similar option passed but no similar elements', async () => {
                await expect(user.find({
                    query: 'b',
                    text: '',
                    similar: true,
                })).rejects.toThrow();
            });

            it('will reject with any other error thrown', async () => {
                const e = new Error();

                await expect(user.find({
                    predicate() {
                        throw e;
                    },
                })).rejects.toThrow(e);
            });
        });
    });
});