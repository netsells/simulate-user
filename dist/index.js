"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _promiseTimeout = require("promise-timeout");

var _stringSimilarity = _interopRequireDefault(require("string-similarity"));

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
var SimulateUser =
/*#__PURE__*/
function () {
  /**
   * Create a SimulateUser class for a page element
   *
   * @param {HTMLElement} node
   */
  function SimulateUser() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    (0, _classCallCheck2["default"])(this, SimulateUser);
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


  (0, _createClass2["default"])(SimulateUser, [{
    key: "sleep",

    /**
     * Returns a promise which resolves in a certain amount of milliseconds
     *
     * @param {Number} timeout
     *
     * @returns {Promise<undefined>}
     */
    value: function sleep(timeout) {
      return new Promise(function (resolve) {
        return setTimeout(resolve, timeout);
      });
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

  }, {
    key: "timeout",
    value: function timeout(func) {
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
      return (0, _promiseTimeout.timeout)(func(), limit);
    }
    /**
     * Get options for an event
     *
     * @param {Object} options
     *
     * @returns {Object}
     */

  }, {
    key: "getEventOptions",
    value: function getEventOptions(options) {
      return (0, _objectSpread2["default"])({
        target: this.node
      }, options);
    } // Finders/Queries

    /**
     * Proxy for querySelectorAll but returns an array of wrappers instead of
     * nodes
     *
     * @param {String|Array<String>} query
     *
     * @returns {Array<SimulateUser>}
     */

  }, {
    key: "querySelectorAll",
    value: function querySelectorAll(query) {
      var _this = this;

      var queries = Array.isArray(query) ? query : [query];
      var nodes = [];
      queries.forEach(function (q) {
        var nodeList = _this.node.querySelectorAll(q);

        nodes.push.apply(nodes, (0, _toConsumableArray2["default"])(Array.from(nodeList)));
      });
      return nodes.map(function (n) {
        return _this.constructor.build(n);
      });
    }
    /**
     * getElementById but returns a wrapper
     *
     * @param {String} id
     *
     * @returns {SimulateUser|null}
     */

  }, {
    key: "getElementById",
    value: function getElementById(id) {
      this.log('getElementById', id);
      return this.first({
        query: "#".concat(id)
      });
    }
    /**
     * getElementsByName but returns an array of wrappers
     *
     * @param {String} name
     *
     * @returns {Array<SimulateUser>}
     */

  }, {
    key: "getElementsByName",
    value: function getElementsByName(name) {
      this.log('getElementsByName', name);
      return this.all({
        query: "[name=\"".concat(name, "\"]")
      });
    }
    /**
     * closest but returns a wrapper
     *
     * @param {*} ...args
     *
     * @returns {SimulateUser|null}
     */

  }, {
    key: "closest",
    value: function closest() {
      var _this$node;

      var node = (_this$node = this.node).closest.apply(_this$node, arguments);

      return node && this.constructor.build(node);
    }
    /**
     * Search through page elements as a user would, using text
     *
     * @param {SearchProperties} options
     *
     * @returns {SimulateUser|null}
     */

  }, {
    key: "all",
    value: function all(_ref) {
      var text = _ref.text,
          _ref$query = _ref.query,
          query = _ref$query === void 0 ? '*' : _ref$query,
          _ref$caseSensitive = _ref.caseSensitive,
          caseSensitive = _ref$caseSensitive === void 0 ? false : _ref$caseSensitive,
          _ref$exact = _ref.exact,
          exact = _ref$exact === void 0 ? false : _ref$exact,
          _ref$predicate = _ref.predicate,
          predicate = _ref$predicate === void 0 ? null : _ref$predicate,
          _ref$visible = _ref.visible,
          visible = _ref$visible === void 0 ? false : _ref$visible,
          _ref$direct = _ref.direct,
          direct = _ref$direct === void 0 ? false : _ref$direct;
      var all = this.querySelectorAll(query);

      if (text) {
        all = all.filter(function (wrapper) {
          var texts = [wrapper[direct ? 'directText' : 'text'], text].map(function (t) {
            return (t || '').toString();
          });

          if (!caseSensitive) {
            texts = texts.map(function (t) {
              return t.toLowerCase();
            });
          }

          return exact ? texts[0] === texts[1] : texts[0].includes(texts[1]);
        });
      }

      if (visible) {
        all = all.filter(function (wrapper) {
          return wrapper.visible;
        });
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

  }, {
    key: "first",
    value: function first(options) {
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

  }, {
    key: "find",
    value: function () {
      var _find = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(options, limit) {
        var _this2 = this;

        var wrappers, matches, bestMatchIndex, bestWrapper;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.log('find', options);
                _context2.prev = 1;
                _context2.next = 4;
                return this.timeout(
                /*#__PURE__*/
                (0, _asyncToGenerator2["default"])(
                /*#__PURE__*/
                _regenerator["default"].mark(function _callee() {
                  var node;
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return _this2.sleep(10);

                        case 2:
                          node = _this2.first(options);

                        case 3:
                          if (!node) {
                            _context.next = 0;
                            break;
                          }

                        case 4:
                          return _context.abrupt("return", node);

                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                })), limit);

              case 4:
                return _context2.abrupt("return", _context2.sent);

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](1);

                if (!options.similar) {
                  _context2.next = 17;
                  break;
                }

                wrappers = this.all((0, _objectSpread2["default"])({}, options, {
                  text: undefined
                }));

                if (!wrappers.length) {
                  _context2.next = 17;
                  break;
                }

                matches = _stringSimilarity["default"].findBestMatch(options.text.toLowerCase(), wrappers.map(function (n) {
                  return n.text.toLowerCase();
                }));
                bestMatchIndex = matches.bestMatchIndex;
                bestWrapper = wrappers[bestMatchIndex];
                this.log('most similar', bestWrapper.node);
                return _context2.abrupt("return", bestWrapper);

              case 17:
                if (!(_context2.t0 instanceof _promiseTimeout.TimeoutError)) {
                  _context2.next = 19;
                  break;
                }

                throw new Error("Could not find element: ".concat(JSON.stringify(options, null, 2)));

              case 19:
                throw _context2.t0;

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 7]]);
      }));

      function find(_x, _x2) {
        return _find.apply(this, arguments);
      }

      return find;
    }()
    /**
     * Get a field based on its label
     *
     * @param {String} label
     *
     * @returns {SimulateUser|null}
     * @throws {Error}
     */

  }, {
    key: "field",
    value: function () {
      var _field = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(label) {
        var wrapper;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.find({
                  query: 'label',
                  text: label,
                  caseSensitive: true
                });

              case 2:
                wrapper = _context3.sent;
                this.log('field', label, '->', wrapper.node);
                return _context3.abrupt("return", this.getElementById(wrapper.htmlFor) || this.getElementsByName(wrapper.htmlFor)[0]);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function field(_x3) {
        return _field.apply(this, arguments);
      }

      return field;
    }()
    /**
     * Check if the node is visible
     *
     * @returns {Boolean}
     */

  }, {
    key: "fieldSet",

    /**
     * Get a fieldset based on its legend
     *
     * @param {String} legend
     *
     * @returns {SimulateUser|null}
     * @throws {Error}
     */
    value: function () {
      var _fieldSet = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(legend) {
        var wrapper;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.find({
                  query: 'legend',
                  text: legend,
                  caseSensitive: true
                });

              case 2:
                wrapper = _context4.sent;
                this.log('fieldset', legend, '->', wrapper.node);
                return _context4.abrupt("return", wrapper.closest('fieldset'));

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fieldSet(_x4) {
        return _fieldSet.apply(this, arguments);
      }

      return fieldSet;
    }() // Actions

    /**
     * Proxy for dispatchEvent
     *
     * @param {Event} event
     */

  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      this.node.dispatchEvent(event);
    }
    /**
     * Click this node
     *
     * @param {SearchProperties?} search
     */

  }, {
    key: "click",
    value: function () {
      var _click = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5() {
        var search,
            options,
            _args5 = arguments;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                search = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : null;
                this.log('click', this.node, search);

                if (!search) {
                  _context5.next = 6;
                  break;
                }

                _context5.next = 5;
                return this.find(search).then(function (el) {
                  return el.click();
                });

              case 5:
                return _context5.abrupt("return");

              case 6:
                options = this.getEventOptions({
                  bubbles: true
                });
                this.dispatchEvent(new MouseEvent('mousedown', options));
                this.dispatchEvent(new MouseEvent('mouseup', options));
                this.node.click();

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function click() {
        return _click.apply(this, arguments);
      }

      return click;
    }()
    /**
     * Attach files to this input element
     *
     * @param {Enumerable<Files>} files
     */

  }, {
    key: "attach",
    value: function () {
      var _attach = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(files) {
        var dataTransfer, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                dataTransfer = new DataTransfer();
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context6.prev = 4;

                for (_iterator = files[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  file = _step.value;
                  dataTransfer.items.add(file);
                }

                _context6.next = 12;
                break;

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context6.t0;

              case 12:
                _context6.prev = 12;
                _context6.prev = 13;

                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }

              case 15:
                _context6.prev = 15;

                if (!_didIteratorError) {
                  _context6.next = 18;
                  break;
                }

                throw _iteratorError;

              case 18:
                return _context6.finish(15);

              case 19:
                return _context6.finish(12);

              case 20:
                this.node.files = dataTransfer.files;
                this.sendChangeEvent();

              case 22:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[4, 8, 12, 20], [13,, 15, 19]]);
      }));

      function attach(_x5) {
        return _attach.apply(this, arguments);
      }

      return attach;
    }()
    /**
     * Check this checkbox
     *
     * @param {Boolean} checked
     */

  }, {
    key: "check",
    value: function check() {
      var checked = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.log('check', this.node);
      this.node.checked = checked;
    }
    /**
     * Focus this element
     */

  }, {
    key: "focus",
    value: function focus() {
      this.node.focus();
      this.dispatchEvent(new FocusEvent('focus', this.getEventOptions({
        relatedTarget: this.node
      })));
      this.dispatchEvent(new FocusEvent('focusin', this.getEventOptions({
        relatedTarget: this.node,
        bubbles: true
      })));
    }
    /**
     * Blur this element
     */

  }, {
    key: "blur",
    value: function blur() {
      this.node.blur();
      this.dispatchEvent(new FocusEvent('blur', this.getEventOptions({
        relatedTarget: this.node
      })));
      this.dispatchEvent(new FocusEvent('focusout', this.getEventOptions({
        relatedTarget: this.node,
        bubbles: true
      })));
    }
    /**
     * Type a single key on this element
     *
     * @param {String} key
     */

  }, {
    key: "typeKey",
    value: function typeKey(key) {
      this.dispatchEvent(new KeyboardEvent('keydown', this.getEventOptions({
        key: key
      })));
      this.dispatchEvent(new KeyboardEvent('keypress', this.getEventOptions({
        key: key
      })));
      this.dispatchEvent(new KeyboardEvent('keyup', this.getEventOptions({
        key: key
      })));
    }
    /**
     * Type a string on this element
     *
     * @param {String} text
     */

  }, {
    key: "type",
    value: function type(text) {
      var _this3 = this;

      text.split('').forEach(function (key) {
        return _this3.typeKey(key);
      });
    }
    /**
     * Type into a fields value. Only simulates the final key press then
     * triggers a single change event
     *
     * @param {String|Number} text
     */

  }, {
    key: "typeValue",
    value: function typeValue(text) {
      this.log('typeValue', text);
      var value = (text || '').toString();
      this.focus();
      this.node.value = value;
      var key = value.slice(-1)[0];

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

  }, {
    key: "fillIn",
    value: function () {
      var _fillIn = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(label, value) {
        var field;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                this.log('fillIn', label);
                _context7.next = 3;
                return this.field(label);

              case 3:
                field = _context7.sent;
                _context7.next = 6;
                return field.fill(value);

              case 6:
                return _context7.abrupt("return", field);

              case 7:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function fillIn(_x6, _x7) {
        return _fillIn.apply(this, arguments);
      }

      return fillIn;
    }()
    /**
     * Fill in this node as a field
     *
     * @param {ValueSelector} value
     */

  }, {
    key: "fill",
    value: function () {
      var _fill = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee8(value) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.t0 = this.tag;
                _context8.next = _context8.t0 === 'select' ? 3 : 6;
                break;

              case 3:
                _context8.next = 5;
                return this.select(value);

              case 5:
                return _context8.abrupt("break", 8);

              case 6:
                _context8.next = 8;
                return this.typeValue(value);

              case 8:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function fill(_x8) {
        return _fill.apply(this, arguments);
      }

      return fill;
    }()
    /**
     * Find a select by its label then fill it in
     *
     * @deprecated since version 1.1.0
     *
     * @param {String} label
     * @param {String} text
     * @param {SearchProperties} options
     *
     * @returns {SimulateUser} - The field wrapper
     */

  }, {
    key: "fillSelect",
    value: function () {
      var _fillSelect = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee9(label, text) {
        var options,
            field,
            _args9 = arguments;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                options = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
                this.warn('fillSelect is deprecated. Use fillIn');
                _context9.next = 4;
                return this.field(label);

              case 4:
                field = _context9.sent;
                _context9.next = 7;
                return field.select((0, _objectSpread2["default"])({
                  text: text
                }, options));

              case 7:
                return _context9.abrupt("return", field);

              case 8:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function fillSelect(_x9, _x10) {
        return _fillSelect.apply(this, arguments);
      }

      return fillSelect;
    }()
    /**
     * Change a value by the option text
     *
     * @param {ValueSelector} value
     */

  }, {
    key: "select",
    value: function () {
      var _select = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee10(value) {
        var options, option;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                this.log('select', value);
                options = (0, _typeof2["default"])(value) === 'object' ? value : {
                  text: value
                };
                _context10.next = 4;
                return this.find((0, _objectSpread2["default"])({
                  query: 'option'
                }, options));

              case 4:
                option = _context10.sent;
                this.node.value = option.value;
                this.sendChangeEvent();

              case 7:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function select(_x11) {
        return _select.apply(this, arguments);
      }

      return select;
    }()
    /**
     * Send a change event
     */

  }, {
    key: "sendChangeEvent",
    value: function sendChangeEvent() {
      var _this4 = this;

      var options = (0, _objectSpread2["default"])({
        bubbles: true,
        cancelable: true
      }, this.getEventOptions());
      ['input', 'change'].forEach(function (event) {
        _this4.dispatchEvent(new Event(event, options));
      });
    } // Getters

    /**
     * nextElementSibling but returns a wrapper
     *
     * @returns {SimulateUser|null}
     */

  }, {
    key: "visible",
    get: function get() {
      return !this.hidden;
    }
    /**
     * Check if the node is hidden
     *
     * @returns {Boolean}
     */

  }, {
    key: "hidden",
    get: function get() {
      return !this.node.offsetParent || window.getComputedStyle(this.node).display === 'none';
    }
  }, {
    key: "nextElementSibling",
    get: function get() {
      return this.node.nextElementSibling && this.constructor.build(this.node.nextElementSibling);
    }
    /**
     * Get all select option values
     *
     * @returns {Array<String>}
     */

  }, {
    key: "options",
    get: function get() {
      var options = this.all({
        query: 'option'
      });
      return options.map(function (_ref3) {
        var value = _ref3.value;
        return value;
      });
    }
    /**
     * Get trimmed text content
     *
     * @returns {String}
     */

  }, {
    key: "text",
    get: function get() {
      return (this.node.textContent || '').trim();
    }
    /**
     * Get text content which is a direct child of this node
     *
     * @returns {String}
     */

  }, {
    key: "directText",
    get: function get() {
      return Array.from(this.node.childNodes).filter(function (node) {
        return node instanceof Text;
      }).map(function (node) {
        return node.textContent;
      }).join(' ').trim();
    }
    /**
     * Get the parentElement in a wrapper
     *
     * @returns {SimulateUser}
     */

  }, {
    key: "parentElement",
    get: function get() {
      return this.node.parentElement && this.constructor.build(this.node.parentElement);
    }
    /**
     * Proxy for className
     *
     * @returns {String}
     */

  }, {
    key: "className",
    get: function get() {
      return this.node.className;
    }
    /**
     * Proxy for value
     *
     * @returns {String}
     */

  }, {
    key: "value",
    get: function get() {
      return this.node.value;
    }
    /**
     * Proxy for htmlFor
     *
     * @returns {String}
     */

  }, {
    key: "htmlFor",
    get: function get() {
      return this.node.htmlFor;
    }
    /**
     * tagName but lower case
     *
     * @returns {String}
     */

  }, {
    key: "tag",
    get: function get() {
      return this.node.tagName.toLowerCase();
    }
  }], [{
    key: "build",
    value: function build() {
      var Klass = this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (0, _construct2["default"])(Klass, args);
    }
  }]);
  return SimulateUser;
}();

['log', 'error', 'warn'].forEach(function (which) {
  SimulateUser.prototype[which] = function () {
    if (this.debug) {
      var _console;

      (_console = console)[which].apply(_console, arguments); // eslint-disable-line no-console

    }
  };
});
var _default = SimulateUser;
exports["default"] = _default;