import { timeout, TimeoutError } from 'promise-timeout';
import stringSimilarity from 'string-similarity';

import logger from './logger';

/**
 * @typedef SearchProperties
 * @type {Object}
 * @property {String} text - Text to search on
 * @property {String} query - Optional query to filter on
 * @property {Boolean} caseSensitive - Whether text is case sensitive
 * @property {Boolean} exact - Whether text match should be exact (not including trimmed white space)
 * @property {Function} predicate - Predicate function wrappers must match
 * @property {Boolean} visible - If element must be visible or not
 * @property {Boolean} direct - If text should be a direct child or not
 */

/**
 * A generic value selector. For a `textarea` or `input` it should always be a
 * string or number, for a `select` it can be a string or a `SearchProperties`
 *
 * @typedef ValueSelector
 * @type {SearchProperties|String|Number}
 */

/**
 * Simulate a user
 */
class SimulateUser {
    /**
     * Create a SimulateUser class for a page element
     *
     * @param {HTMLElement} node
     */
    constructor(node = document) {
        this.node = node;
        this.debug = false;
    }

    /**
     * Generate a instance using the same class constructor
     *
     * @param {*} ...args
     *
     * @returns {SimulateUser}
     */
    static build(...args) {
        const Klass = this;

        return new Klass(...args);
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
    timeout(func, limit = this.constructor.timeoutLimit) {
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
     * nodes
     *
     * @param {String|Array<String>} query
     *
     * @returns {Array<SimulateUser>}
     */
    querySelectorAll(query) {
        const queries = Array.isArray(query) ? query : [query];

        const nodes = [];

        queries.forEach(q => {
            const nodeList = this.node.querySelectorAll(q);

            nodes.push(...Array.from(nodeList));
        });

        return nodes.map(n => this.constructor.build(n));
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

        const node = document.getElementById(id);

        return node && this.constructor.build(node);
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

        return node && this.constructor.build(node);
    }

    /**
     * Search through page elements as a user would, using text
     *
     * @param {SearchProperties} options
     *
     * @returns {SimulateUser|null}
     */
    all({
        text,
        query = '*',
        caseSensitive = false,
        exact = false,
        predicate = null,
        visible = false,
        direct = false,
    }) {
        let all = this.querySelectorAll(query);

        if (text) {
            all = all.filter(wrapper => {
                let texts = [
                    wrapper[direct ? 'directText' : 'text'],
                    text,
                ].map(t => (t || '').toString());

                if (!caseSensitive) {
                    texts = texts.map(t => t.toLowerCase());
                }

                return exact
                    ? texts[0] === texts[1]
                    : texts[0].includes(texts[1]);
            });
        }

        if (visible) {
            all = all.filter(wrapper => wrapper.visible);
        }

        if (predicate) {
            all = all.filter(predicate);
        }

        return all;
    }

    /**
     * Get the first element of a query to `all`
     *
     * @param {SearchProperties} options
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
     * @param {SearchProperties} options
     * @param {Boolean} [options.similar] - If no exact matches found, fall back to a fuzzy search
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
                    await this.sleep(this.constructor.sleepTime);

                    node = this.first(options);
                } while(!node);

                return node;
            }, limit);
        } catch(e) {
            if (options.similar) {
                const wrappers = this.all({
                    ...options,
                    text: undefined,
                });

                if (wrappers.length) {
                    const matches = stringSimilarity.findBestMatch(
                        options.text.toLowerCase(),
                        wrappers.map(n => n.text.toLowerCase())
                    );

                    const { bestMatchIndex } = matches;
                    const bestWrapper = wrappers[bestMatchIndex];

                    this.log('most similar', bestWrapper.node);

                    return bestWrapper;
                }
            }

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

    /**
     * Check if the node is visible
     *
     * @returns {Boolean}
     */
    get visible() {
        return !this.hidden;
    }

    /**
     * Check if the node is hidden
     *
     * @returns {Boolean}
     */
    get hidden() {
        return !this.node.offsetParent || window.getComputedStyle(this.node).display === 'none';
    }

    /**
     * Get a fieldset based on its legend
     *
     * @param {String} legend
     *
     * @returns {SimulateUser|null}
     * @throws {Error}
     */
    async fieldSet(legend) {
        const wrapper = await this.find({ query: 'legend', text: legend, caseSensitive: true });

        this.log('fieldset', legend, '->', wrapper.node);

        return wrapper.closest('fieldset');
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
     *
     * @param {SearchProperties?} search
     */
    async click(search = null) {
        this.log('click', this.node, search);

        if (search) {
            await this.find(search).then(el => el.click());

            return;
        }

        const options = this.getEventOptions({ bubbles: true });

        this.dispatchEvent(new MouseEvent('mousedown', options));
        this.dispatchEvent(new MouseEvent('mouseup', options));
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
        // this.dispatchEvent(new FocusEvent('focus', this.getEventOptions({ relatedTarget: this.node })));
        this.dispatchEvent(new FocusEvent('focusin', this.getEventOptions({ relatedTarget: this.node, bubbles: true })));
    }

    /**
     * Blur this element
     */
    blur() {
        this.node.blur();
        // this.dispatchEvent(new FocusEvent('blur', this.getEventOptions({ relatedTarget: this.node })));
        this.dispatchEvent(new FocusEvent('focusout', this.getEventOptions({ relatedTarget: this.node, bubbles: true })));
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
        text.split('').forEach(key => this.typeKey(key));
    }

    /**
     * Type into a fields value. Only simulates the final key press then
     * triggers a single change event
     *
     * @param {String|Number} text
     */
    typeValue(text) {
        this.log('typeValue', text);

        const value = (text || '').toString();

        this.focus();
        this.node.value = value;

        const key = value.slice(-1)[0];

        if (key) {
            this.typeKey(key);
        }

        this.sendChangeEvent();
    }

    /**
     * Find a field by its label then fill it in
     *
     * @param {String} label
     * @param {ValueSelector} value
     *
     * @returns {SimulateUser} - The field wrapper
     */
    async fillIn(label, value) {
        this.log('fillIn', label);

        const field = await this.field(label);

        await field.fill(value);

        return field;
    }

    /**
     * Fill in this node as a field
     *
     * @param {ValueSelector} value
     */
    async fill(value) {
        switch (this.tag) {
            case 'select': {
                await this.select(value);

                break;
            }

            default: {
                await this.typeValue(value);
            }
        }
    }

    /**
     * Change a value by the option text
     *
     * @param {ValueSelector} value
     */
    async select(value) {
        this.log('select', value);

        const options = typeof value === 'object'
            ? value
            : { text: value };

        const option = await this.find({
            query: 'option',
            ...options,
        });

        this.node.value = option.value;

        this.sendChangeEvent();
    }

    /**
     * Send a change event
     */
    sendChangeEvent() {
        const options = {
            bubbles: true,
            cancelable: true,

            ...this.getEventOptions(),
        };

        ['input', 'change'].forEach(event => {
            this.dispatchEvent(new Event(event, options));
        });
    }

    // Getters

    /**
     * nextElementSibling but returns a wrapper
     *
     * @returns {SimulateUser|null}
     */
    get nextElementSibling() {
        return this.node.nextElementSibling && this.constructor.build(this.node.nextElementSibling);
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
     * Get text content which is a direct child of this node
     *
     * @returns {String}
     */
    get directText() {
        return Array.from(this.node.childNodes)
            .filter(node => node instanceof Text)
            .map(node => node.textContent)
            .join('')
            .trim();
    }

    /**
     * Get the parentElement in a wrapper
     *
     * @returns {SimulateUser}
     */
    get parentElement() {
        return this.node.parentElement && this.constructor.build(this.node.parentElement);
    }

    /**
     * Proxy for className
     *
     * @returns {String}
     */
    get className() {
        return this.node.className;
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

['log', 'error', 'warn'].forEach(which => {
    SimulateUser.prototype[which] = function(...args) {
        if (this.debug) {
            logger[which](...args);
        }
    };
});

SimulateUser.timeoutLimit = 2000;
SimulateUser.sleepTime = 10;

export default SimulateUser;
