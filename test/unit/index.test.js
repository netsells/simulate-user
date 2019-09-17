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
            // user.debug = true;
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

        describe('field', () => {
            it('can get field based on label for id', async () => {
                const field = await user.field('Textarea');
                expect(field.tag).toBe('textarea');
            });

            it('can get field based on label for name', async () => {
                const field = await user.field('Select');
                expect(field.tag).toBe('select');
            });
        });

        describe('fieldSet', () => {
            it('can get field set by legend', async () => {
                const fieldset = await user.fieldSet('Foos');
                expect(fieldset.tag).toBe('fieldset');

                const legend = await fieldset.find({ query: 'legend' });

                expect(legend.text).toBe('Foos');
            });
        });

        describe('dispatchEvent', () => {
            it('dispatches an event on the element', done => {
                expect.assertions(1);
                const event = new Event('click');
                const input = document.getElementById('a');
                input.addEventListener('click', (e) => {
                    expect(e).toBe(event);
                    done();
                });

                const inputWrapper = user.getElementById('a');
                a.dispatchEvent(event);
            });
        });

        describe('check', () => {
            let input;

            beforeEach(async () => {
                input = await user.field('Checkbox');
                expect(input.node.checked).toBe(false);
            });

            it('can check and uncheck a checkbox', () => {
                input.check();
                expect(input.node.checked).toBe(true);

                input.check(false);
                expect(input.node.checked).toBe(false);
            });
        });

        describe('focus', () => {
            let input;

            beforeEach(async () => {
                input = await user.field('Input');
                expect(document.activeElement).toBe(document.body);
            });

            it('will focus an element', () => {
                input.focus();
                expect(document.activeElement).toBe(input.node);
            });

            it('will emit focus event', done => {
                input.node.addEventListener('focus', () => done());
                input.focus();
            });

            it('will emit focusIn event', done => {
                input.node.addEventListener('focusin', () => done());
                input.focus();
            });
        });

        describe('blur', () => {
            let input;

            beforeEach(async () => {
                input = await user.field('Input');
                input.focus();
            });

            it('will blur an element', () => {
                expect(document.activeElement).toBe(input.node);
                input.blur();
                expect(document.activeElement).not.toBe(input.node);
            });

            it('will emit blur event', done => {
                input.node.addEventListener('blur', () => done());
                input.blur();
            });

            it('will emit focusout event', done => {
                input.node.addEventListener('focusout', () => done());
                input.blur();
            });
        });

        describe('typeKey', () => {
            let input;

            beforeEach(async () => {
                input = await user.field('Input');
            });

            it('emits events in the correct order', done => {
                expect.assertions(4);

                const events = [];
                const order = ['keydown', 'keypress', 'keyup'];

                order.forEach(name => {
                    input.node.addEventListener(name, ({ key }) => {
                        events.push(name);

                        expect(key).toBe('p');

                        if (events.length === order.length) {
                            expect(events).toEqual(order);
                            done();
                        }
                    });
                });

                input.typeKey('p');
            });
        });

        describe('type', () => {
            let input;

            beforeEach(async () => {
                input = await user.field('Input');
            });

            it('emits all key events in order', done => {
                expect.assertions(1);

                let real = '';
                const expected = 'foobar';

                input.node.addEventListener('keypress', ({ key }) => {
                    real += key;

                    if (real.length === expected.length) {
                        expect(expected).toEqual(real);
                        done();
                    }
                });

                input.type('foobar');
            });
        });

        describe('typeValue', () => {
            let input;

            beforeEach(async () => {
                input = await user.field('Input');

                expect(input.value).toBe('');
            });

            it('focuses the input', () => {
                expect(document.activeElement).not.toBe(input.node);
                input.typeValue('foobar');
                expect(document.activeElement).toBe(input.node);
            });

            it('changes the inputs value', () => {
                input.typeValue('foobar');

                expect(input.value).toBe('foobar');
            });

            it('only types the last key', () => {
                let keyPresses = 0;
                let lastKey;

                input.node.addEventListener('keypress', ({ key }) => {
                    lastKey = key;
                    keyPresses++;
                });

                input.typeValue('foobar');

                expect(keyPresses).toBe(1);
                expect(lastKey).toBe('r');
            });

            it('sends change event', done => {
                input.node.addEventListener('change', ({ target }) => {
                    expect(target.value).toBe('foobar');

                    done();
                });

                input.typeValue('foobar');
            });

            it('sends input event', done => {
                input.node.addEventListener('input', ({ target }) => {
                    expect(target.value).toBe('foobar');

                    done();
                });

                input.typeValue('foobar');
            });

            describe('when typing nothing', () => {
                it('changes the inputs value', () => {
                    input.typeValue('');

                    expect(input.value).toBe('');
                });

                it('does not type any keys', () => {
                    let keyPresses = 0;

                    input.node.addEventListener('keypress', () => {
                        keyPresses++;
                    });

                    input.typeValue('');

                    expect(keyPresses).toBe(0);
                });
            });
        });

        describe('fillIn', () => {
            it('can set an input via the label', async () => {
                await user.fillIn('Input', 'filled in');

                expect(document.getElementById('a').value).toBe('filled in');
            });
        });

        // describe('attach', () => {
        //     let files;
        //     let input;

        //     beforeEach(async () => {
        //         files = [new Blob()];
        //         input = await user.field('File');
        //     });

        //     it('attaches files to an input', async () => {
        //         await input.attach(files);
        //     });
        // });

        describe('click', () => {
            let input;
            let inputWrapper;
            let tr;

            beforeEach(() => {
                input = document.getElementById('a');
                tr = input.closest('tr');
                inputWrapper = user.getElementById('a');
            });

            it('emits mousedown, mouseup and click in the correct order', done => {
                expect.assertions(1);

                const events = [];
                const order = ['mousedown', 'mouseup', 'click'];

                order.forEach(name => {
                    input.addEventListener(name, () => {
                        events.push(name);

                        if (events.length === order.length) {
                            expect(events).toEqual(order);
                            done();
                        }
                    });
                });

                inputWrapper.click();
            });

            it('bubbles up to other elements', done => {
                expect.assertions(1);

                const events = [];
                const order = ['mousedown', 'mouseup', 'click'];

                order.forEach(name => {
                    tr.addEventListener(name, () => {
                        events.push(name);

                        if (events.length === order.length) {
                            expect(events).toEqual(order);
                            done();
                        }
                    });
                });

                inputWrapper.click();
            });

            describe('when passed a search', () => {
                it('will click that element', done => {
                    input.addEventListener('click', () => done());
                    inputWrapper.closest('tr').click({ query: 'input' });
                });
            });
        });
    });
});
