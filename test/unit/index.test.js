import SimulateUser from '../../src/index';
import app from './app.html';

global.DataTransfer = class {
    constructor() {
        this.items = new Set();
    }

    get files() {
        return [...this.items];
    }
}

// Speed up tests
SimulateUser.timeoutLimit = 5;
SimulateUser.sleepTime = 0.1;

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

    describe('loggers', () => {
        ['log', 'warn', 'error'].forEach(logger => {
            describe(logger, () => {
                let wrapper;

                beforeEach(() => {
                    wrapper = new SimulateUser();
                    jest.spyOn(console, logger).mockReturnValue();
                });

                describe('when not debug mode', () => {
                    it(`does not call console.${ logger }`, () => {
                        wrapper[logger]('foobar');
                        expect(console[logger]).not.toHaveBeenCalled();
                    });
                });

                describe('when in debug mode', () => {
                    beforeEach(() => {
                        wrapper.debug = true;
                    });

                    it(`call console.${ logger } with same arguments`, () => {
                        wrapper[logger]('foobar', 'barfoo');
                        expect(console[logger]).toHaveBeenCalledWith('foobar', 'barfoo');
                    });
                });
            });
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

            it('can filter elements by visibility', () => {
                const tr = document.querySelector('tr');
                jest.spyOn(tr, 'offsetParent', 'get')
                    .mockReturnValue(tr.parentElement);

                const els = user.all({
                    query: 'tr',
                    visible: true,
                });

                expect(els.length).toBe(1);
                expect(els[0].node).toBe(tr);
            });
        });

        describe('getEventOptions', () => {
            let input;

            beforeEach(async () => {
                input = await user.find({ query: 'input' });
            });

            it('returns related as current node', () => {
                expect(input.getEventOptions().target).toBe(input.node);
            });

            it('appends extra options when supplied', () => {
                expect(input.getEventOptions({ foo: 'bar' }).foo).toBe('bar');
            });
        });

        describe('sendChangeEvent', () => {
            let input;

            beforeEach(async () => {
                input = await user.find({ query: 'input' });
            });

            ['input', 'change'].forEach(name => {
                it(`sends a ${ name } event with the correct options`, done => {
                    expect.assertions(2);

                    input.node.addEventListener(name, (e) => {
                        expect(e.bubbles).toBe(true);
                        expect(e.cancelable).toBe(true);

                        done();
                    });

                    input.sendChangeEvent();
                });
            });
        });

        describe('find', () => {
            it('will wait to find an element', async () => {
                const promise = user.find({ query: 'p', text: 'Added' });

                await new Promise(resolve => setTimeout(resolve, SimulateUser.timeoutLimit / 2));

                const p = document.createElement('p');
                p.textContent = 'Added';
                document.body.appendChild(p);

                const wrapper = await promise;

                expect(wrapper.node).toBe(p);
                expect(wrapper.text).toBe('Added');
            });

            it('will timeout if waiting too long', async () => {
                const options = { query: 'p', text: 'Added' };

                await expect(user.find(options)).rejects.toThrow(
                    new Error(`Could not find element: ${ JSON.stringify(options, null, 2 ) }`)
                );
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
                expect.assertions(7);

                let real = '';
                const expected = 'foobar';

                input.node.addEventListener('keypress', ({ key }) => {
                    expect(key.length).toBe(1);

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

        describe('fill', () => {
            it('can set an input value', async () => {
                const input = user.getElementById('a');

                input.fill('bam');

                expect(input.value).toBe('bam');
            });

            it('can set a select value', async () => {
                const select = await user.find({ query: 'select' });

                await select.fill('Foo');

                expect(select.value).toBe('foo');
            });
        });

        describe('select', () => {
            let input;

            beforeEach(async () => {
                input = await user.find({ query: 'select' });

                expect(input.value).toBe('');
            });

            it('can select by text', async () => {
                await input.select('Bar');

                expect(input.value).toBe('bar');
            });

            it('can select by query', async () => {
                await input.select({ query: '[value=foo]' });

                expect(input.value).toBe('foo');
            });

            it('sends change event', done => {
                input.node.addEventListener('change', ({ target }) => {
                    expect(target.value).toBe('bar');

                    done();
                });

                input.select('Bar');
            });

            it('sends input event', done => {
                input.node.addEventListener('input', ({ target }) => {
                    expect(target.value).toBe('bar');

                    done();
                });

                input.select('Bar');
            });
        });

        describe('attach', () => {
            let files;
            let input;
            let mock;

            beforeEach(async () => {
                files = [new Blob()];
                input = await user.field('File');
                mock = jest.spyOn(input.node, 'files', 'set').mockReturnValue();
            });

            it('attaches files to an input', async () => {
                await input.attach(files);

                expect(mock).toHaveBeenCalledWith(files);
            });

            it('sends change event', done => {
                input.node.addEventListener('change', () => done());

                input.attach(files);
            });

            it('sends input event', done => {
                input.node.addEventListener('input', () => done());

                input.attach(files);
            });
        });

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

        describe('getters', () => {
            describe('nextElementSibling', () => {
                it('gets the next element', async () => {
                    const legend = await user.find({ query: 'fieldset legend' });
                    const next = legend.nextElementSibling;
                    expect(next.tag).toBe('input');
                });
            });

            describe('options', () => {
                it('gets all the options on a select', async () => {
                    const select = await user.find({ query: 'select' });

                    expect(select.options).toEqual([
                        '',
                        'foo',
                        'bar',
                    ]);
                });
            });

            describe('text', () => {
                it('returns text trimmed', async () => {
                    const div = await user.find({ query: '.lots-of-text' });

                    const { textContent } = div.node;
                    const trimmed = textContent.trim();

                    expect(div.text).not.toEqual(textContent);
                    expect(div.text).toEqual(trimmed);
                });

                it('returns empty string when called on an element without text', async () => {
                    const input = await user.find({ query: 'input' });

                    expect(input.text).toBe('');
                });
            });

            describe('directText', () => {
                it('only returns text on this element', async () => {
                    const div = await user.find({ query: '.lots-of-text' });

                    expect(div.directText).toBe('Lots of text  here');
                });
            });

            describe('parentElement', () => {
                it('gets the parent element', async () => {
                    const select = await user.find({ query: 'select' });
                    const parent = select.parentElement;

                    expect(parent.tag).toBe('td');
                });
            });

            describe('className', () => {
                it('returns the className', async () => {
                    const div = await user.find({ query: '.lots-of-text' });

                    expect(div.className).toBe('lots-of-text');
                });
            });

            describe('visible', () => {
                let input;

                beforeEach(async () => {
                    input = await user.find({ query: 'input' });
                });

                describe('when hidden', () => {
                    beforeEach(() => {
                        jest.spyOn(input, 'hidden', 'get')
                            .mockReturnValue(true);
                    });

                    it('returns false', () => {
                        expect(input.visible).toBe(false);
                    });
                });

                describe('when not hidden', () => {
                    beforeEach(() => {
                        jest.spyOn(input, 'hidden', 'get')
                            .mockReturnValue(false);
                    });

                    it('returns true', () => {
                        expect(input.visible).toBe(true);
                    });
                });
            });

            describe('hidden', () => {
                let input;

                beforeEach(async () => {
                    input = await user.find({ query: 'input' });
                });

                describe('when offsetParent is falsy', () => {
                    beforeEach(() => {
                        expect(input.node.offsetParent).toBeFalsy();
                    });

                    it('returns true', () => {
                        expect(input.hidden).toBe(true);
                    });
                });

                describe('when offsetParent is truthy', () => {
                    beforeEach(() => {
                        jest.spyOn(input.node, 'offsetParent', 'get')
                            .mockReturnValue(input.node.parentElement);

                        expect(input.node.offsetParent).toBeTruthy();
                    });

                    it('returns false', () => {
                        expect(input.hidden).toBe(false);
                    });

                    describe('when display is set to none', () => {
                        beforeEach(() => {
                            input.node.style.display = 'none';
                        });

                        it('returns true', () => {
                            expect(input.hidden).toBe(true);
                        });
                    });
                });
            });
        });
    });
});
