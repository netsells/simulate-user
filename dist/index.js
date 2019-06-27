import { timeout, TimeoutError } from 'promise-timeout';
export default class SimulateUser {
  constructor(node = document) {
    this.node = node;
  }

  log(...args) {
    console.log(...args); // eslint-disable-line no-console
  }

  error(...args) {
    console.error(...args); // eslint-disable-line no-console
  }

  sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  timeout(func, limit = 2000) {
    return timeout(func(), limit);
  }

  getEventOptions(options) {
    return {
      target: this.node,
      // currentTarget: this.node,
      ...options
    };
  } // Finders/Queries


  querySelectorAll(query) {
    const queries = Array.isArray(query) ? query : [query];
    const nodes = [];
    queries.forEach(q => {
      try {
        const nodeList = this.node.querySelectorAll(q);
        nodes.push(...Array.from(nodeList));
      } catch (e) {
        this.error(e);
      }
    });
    return nodes.map(n => new SimulateUser(n));
  }

  getElementById(id) {
    this.log('getElementById', id);
    return this.first({
      query: `#${id}`
    });
  }

  getElementsByName(name) {
    this.log('getElementsByName', name);
    return this.all({
      query: `[name="${name}"]`
    });
  }

  closest(...args) {
    const node = this.node.closest(...args);
    return node && new SimulateUser(node);
  }

  all({
    text,
    query = '*',
    caseSensitive = false,
    exact = false
  }) {
    let all = this.querySelectorAll(query);

    if (text) {
      all = all.filter(wrapper => {
        let texts = [wrapper.text, text].map(t => (t || '').toString());

        if (!caseSensitive) {
          texts = texts.map(t => t.toLowerCase());
        }

        return exact ? texts[0] === texts[1] : texts[0].includes(texts[1]);
      });
    }

    return all;
  }

  first(obj) {
    return this.all(obj)[0];
  }

  async find(obj, limit) {
    this.log('find', obj);

    try {
      return await this.timeout(async () => {
        let node;

        do {
          await this.sleep(10);
          node = this.first(obj);
        } while (!node);

        return node;
      }, limit);
    } catch (e) {
      if (e instanceof TimeoutError) {
        throw new Error(`Could not find element: ${JSON.stringify(obj, null, 2)}`);
      }

      throw e;
    }
  }

  async field(label) {
    const wrapper = await this.find({
      query: 'label',
      text: label,
      caseSensitive: true
    });
    this.log('field', label, '->', wrapper.node);
    return this.getElementById(wrapper.htmlFor) || this.getElementsByName(wrapper.htmlFor)[0];
  } // Actions


  dispatchEvent(event) {
    // this.log('dispatchEvent', event);
    this.node.dispatchEvent(event);
  }

  click() {
    this.log('click', this.node);
    this.dispatchEvent(new MouseEvent('mousedown'));
    this.dispatchEvent(new MouseEvent('mouseup'));
    this.node.click();
  }

  async attach(files) {
    const dataTransfer = new DataTransfer();

    for (const file of files) {
      dataTransfer.items.add(file);
    }

    this.node.files = dataTransfer.files;
    this.sendChangeEvent();
  }

  check(checked = true) {
    this.log('check', this.node);
    this.node.checked = checked;
  }

  focus() {
    this.node.focus();
    this.dispatchEvent(new FocusEvent(this.getEventOptions({
      relatedTarget: this.node
    })));
  }

  typeKey(key) {
    this.dispatchEvent(new KeyboardEvent('keydown', this.getEventOptions({
      key
    })));
    this.dispatchEvent(new KeyboardEvent('keypress', this.getEventOptions({
      key
    })));
    this.dispatchEvent(new KeyboardEvent('keyup', this.getEventOptions({
      key
    })));
  }

  type(text) {
    text.forEach(key => this.typeKey(key));
  }

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

  async fillIn(label, value) {
    this.log('fillIn', label);
    const field = await this.field(label);

    switch (field.tag) {
      case 'select':
        {
          await field.select({
            text: value
          });
          break;
        }

      default:
        {
          await field.typeValue(value);
        }
    }

    return field;
  }

  async fillSelect(label, text, options = {}) {
    const field = await this.field(label);
    await field.select({
      text,
      ...options
    });
  }

  async select({
    text,
    exact,
    caseSensitive
  }) {
    this.log('select', {
      text,
      exact,
      caseSensitive
    });
    const option = await this.find({
      query: 'option',
      text,
      exact,
      caseSensitive
    });
    this.node.value = option.value;
    this.sendChangeEvent();
  }

  sendChangeEvent() {
    this.dispatchEvent(new Event('input', this.getEventOptions()));
    this.dispatchEvent(new Event('change', this.getEventOptions()));
  } // Getters


  get nextElementSibling() {
    return this.node.nextElementSibling && new SimulateUser(this.node.nextElementSibling);
  }

  get options() {
    const options = this.all({
      query: 'option'
    });
    return options.map(({
      value
    }) => value);
  }

  get text() {
    return (this.node.textContent || '').trim();
  }

  get value() {
    return this.node.value;
  }

  get htmlFor() {
    return this.node.htmlFor;
  }

  get tag() {
    return this.node.tagName.toLowerCase();
  }

}