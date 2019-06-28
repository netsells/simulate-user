import { timeout, TimeoutError } from 'promise-timeout';

/**
 * Simulate a user
 */
export default class SimulateUser {
    /**
     * Create a SimulateUser class for a page element
     *
     * @param {HTMLElement} node
     */
    constructor(node = document) {
        this.node = node;
    }

    /**
     * Proxy for console.log
     *
     * @param {*} ...args
     */
    log(...args) {
        console.log(...args); // eslint-disable-line no-console
    }

    /**
     * Proxy for console.error
     *
     * @param {*} ...args
     */
    error(...args) {
        console.error(...args);  // eslint-disable-line no-console
    }

    /**
     * Returns a promise which resolves in a certain amount of milliseconds
     *
     * @param {Number} timeout
     *
     * @returns {Promise<undefined>}
     */
    sleep(timeout) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    /**
     * Returns a promise which times out if the passed in promise doesn't
     * resolve in time
     *
     * @param {Function} func
     * @param {Number} limit
     *
     * @returns {Promise<*>}
     */
    timeout(func, limit = 2000) {
        return timeout(func(), limit);
    }

    /**
     * Get options for an event
     *
     * @param {Object} options
     *
     * @returns {Object}
     */
    getEventOptions(options) {
        return {
            target: this.node,
            ...options,
        };
    }

    // Finders/Queries

    /**
     * Proxy for querySelectorAll but returns an array of wrappers instead of
     * nods
     *
     * @param {String|Array<String>} query
     *
     * @returns {Array<SimulateUser>}
     */
    querySelectorAll(query) {
        const queries = Array.isArray(query) ? query : [query];

        const nodes = [];

        queries.forEach(q => {
            try {
                const nodeList = this.node.querySelectorAll(q);

                nodes.push(...Array.from(nodeList));
            } catch(e) {
                this.error(e);
            }
        });

        return nodes.map(n => new SimulateUser(n));
    }

    /**
     * getElementById but returns a wrapper
     *
     * @param {String} id
     *
     * @returns {SimulateUser|null}
     */
    getElementById(id) {
        this.log('getElementById', id);

        return this.first({ query: `#${ id }` });
    }

    /**
     * getElementsByName but returns an array of wrappers
     *
     * @param {String} name
     *
     * @returns {Array<SimulateUser>}
     */
    getElementsByName(name) {
        this.log('getElementsByName', name);

        return this.all({ query: `[name="${ name }"]` });
    }

    /**
     * closest but returns a wrapper
     *
     * @param {*} ...args
     *
     * @returns {SimulateUser|null}
     */
    closest(...args) {
        const node = this.node.closest(...args);

        return node && new SimulateUser(node);
    }

    /**
     * Search through page elements as a user would, using text
     *
     * @param {Object} options
     * @param {String} [options.text] - Text to search on
     * @param {String} [options.query] - Optional query to filter on
     * @param {Boolean} [options.caseSensitive] - Whether text is case sensitive
     * @param {Boolean} [options.exact] - Whether text match should be exact (not including trimmed white space)
     *
     * @returns {SimulateUser|null}
     */
    all({
        text,
        query = '*',
        caseSensitive = false,
        exact = false,
    }) {
        let all = this.querySelectorAll(query);

        if (text) {
            all = all.filter(wrapper => {
                let texts = [wrapper.text, text].map(t => (t || '').toString());

                if (!caseSensitive) {
                    texts = texts.map(t => t.toLowerCase());
                }

                return exact
                    ? texts[0] === texts[1]
                    : texts[0].includes(texts[1]);
            });
        }

        return all;
    }

    /**
     * Get the first element of a query to `all`
     *
     * @param {Object} options
     *
     * @returns {SimulateUser|null}
     */
    first(options) {
        return this.all(options)[0];
    }

    /**
     * Get the first element of a query to `all`, but throws an error if it's
     * not found. Will wait for an element to appear (e.g. if a form is
     * updating)
     *
     * @param {Object} options
     * @param {Number} limit
     *
     * @returns {SimulateUser}
     * @throws {Error}
     */
    async find(options, limit) {
        this.log('find', options);

        try {
            return await this.timeout(async() => {
                let node;

                do {
                    await this.sleep(10);

                    node = this.first(options);
                } while(!node);

                return node;
            }, limit);
        } catch(e) {
            if (e instanceof TimeoutError) {
                throw new Error(`Could not find element: ${ JSON.stringify(options, null, 2 ) }`);
            }

            throw e;
        }
    }

    /**
     * Get a field based on its label
     *
     * @param {String} label
     *
     * @returns {SimulateUser|null}
     * @throws {Error}
     */
    async field(label) {
        const wrapper = await this.find({ query: 'label', text: label, caseSensitive: true });

        this.log('field', label, '->', wrapper.node);

        return this.getElementById(wrapper.htmlFor) || this.getElementsByName(wrapper.htmlFor)[0];
    }

    // Actions

    /**
     * Proxy for dispatchEvent
     *
     * @param {Event} event
     */
    dispatchEvent(event) {
        this.node.dispatchEvent(event);
    }

    /**
     * Click this node
     */
    click() {
        this.log('click', this.node);

        this.dispatchEvent(new MouseEvent('mousedown'));
        this.dispatchEvent(new MouseEvent('mouseup'));
        this.node.click();
    }

    /**
     * Attach files to this input element
     *
     * @param {Enumerable<Files>} files
     */
    async attach(files) {
        const dataTransfer = new DataTransfer();

        for (const file of files) {
            dataTransfer.items.add(file);
        }

        this.node.files = dataTransfer.files;

        this.sendChangeEvent();
    }

    /**
     * Check this checkbox
     *
     * @param {Boolean} checked
     */
    check(checked = true) {
        this.log('check', this.node);

        this.node.checked = checked;
    }

    /**
     * Focus this element
     */
    focus() {
        this.node.focus();
        this.dispatchEvent(new FocusEvent(this.getEventOptions({ relatedTarget: this.node })));
    }

    /**
     * Type a single key on this element
     *
     * @param {String} key
     */
    typeKey(key) {
        this.dispatchEvent(new KeyboardEvent('keydown', this.getEventOptions({ key })));
        this.dispatchEvent(new KeyboardEvent('keypress', this.getEventOptions({ key })));
        this.dispatchEvent(new KeyboardEvent('keyup', this.getEventOptions({ key })));
    }

    /**
     * Type a string on this element
     *
     * @param {String} text
     */
    type(text) {
        text.forEach(key => this.typeKey(key));
    }

    /**
     * Type into a fields value. Only simulates the final key press then
     * triggers a single change event
     *
     * @param {String} text
     */
    typeValue(text) {
        this.log('typeValue', text);

        this.focus();
        this.node.value = text;

        const key = (text || '').toString().slice(-1)[0];

        if (key) {
            this.typeKey(key);
        }

        this.sendChangeEvent();
    }

    /**
     * Find a field by its label then fill it in
     *
     * @param {String} label
     * @param {String} value
     *
     * @returns {SimulateUser} - The field wrapper
     */
    async fillIn(label, value) {
        this.log('fillIn', label);

        const field = await this.field(label);

        switch (field.tag) {
            case 'select': {
                await field.select({ text: value });

                break;
            }

            default: {
                await field.typeValue(value);
            }
        }

        return field;
    }

    /**
     * Find a select by its label then fill it in
     *
     * @param {String} label
     * @param {String} text
     * @param {Object} options
     *
     * @returns {SimulateUser} - The field wrapper
     */
    async fillSelect(label, text, options = {}) {
        const field = await this.field(label);

        await field.select({
            text,
            ...options,
        });

        return field;
    }

    /**
     * Change a value by the option text
     *
     * @param {Object} options
     */
    async select({ text, exact, caseSensitive }) {
        this.log('select', { text, exact, caseSensitive });

        const option = await this.find({
            query: 'option',
            text,
            exact,
            caseSensitive,
        });

        this.node.value = option.value;

        this.sendChangeEvent();
    }

    /**
     * Send a change event
     */
    sendChangeEvent() {
        this.dispatchEvent(new Event('input', this.getEventOptions()));
        this.dispatchEvent(new Event('change', this.getEventOptions()));
    }

    // Getters

    /**
     * nextElementSibling but returns a wrapper
     *
     * @returns {SimulateUser|null}
     */
    get nextElementSibling() {
        return this.node.nextElementSibling && new SimulateUser(this.node.nextElementSibling);
    }

    /**
     * Get all select option values
     *
     * @returns {Array<String>}
     */
    get options() {
        const options = this.all({ query: 'option' });

        return options.map(({ value }) => value);
    }

    /**
     * Get trimmed text content
     *
     * @returns {String}
     */
    get text() {
        return (this.node.textContent || '').trim();
    }

    /**
     * Proxy for value
     *
     * @returns {String}
     */
    get value() {
        return this.node.value;
    }

    /**
     * Proxy for htmlFor
     *
     * @returns {String}
     */
    get htmlFor() {
        return this.node.htmlFor;
    }

    /**
     * tagName but lower case
     *
     * @returns {String}
     */
    get tag() {
        return this.node.tagName.toLowerCase();
    }
}
