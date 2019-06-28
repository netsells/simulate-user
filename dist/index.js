"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _promiseTimeout = require("promise-timeout");

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
  }
  /**
   * Proxy for console.log
   *
   * @param {*} ...args
   */


  (0, _createClass2["default"])(SimulateUser, [{
    key: "log",
    value: function log() {
      var _console;

      (_console = console).log.apply(_console, arguments); // eslint-disable-line no-console

    }
    /**
     * Proxy for console.error
     *
     * @param {*} ...args
     */

  }, {
    key: "error",
    value: function error() {
      var _console2;

      (_console2 = console).error.apply(_console2, arguments); // eslint-disable-line no-console

    }
    /**
     * Returns a promise which resolves in a certain amount of milliseconds
     *
     * @param {Number} timeout
     *
     * @returns {Promise<undefined>}
     */

  }, {
    key: "sleep",
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
     * nods
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
        try {
          var nodeList = _this.node.querySelectorAll(q);

          nodes.push.apply(nodes, (0, _toConsumableArray2["default"])(Array.from(nodeList)));
        } catch (e) {
          _this.error(e);
        }
      });
      return nodes.map(function (n) {
        return new SimulateUser(n);
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

  }, {
    key: "all",
    value: function all(_ref) {
      var text = _ref.text,
          _ref$query = _ref.query,
          query = _ref$query === void 0 ? '*' : _ref$query,
          _ref$caseSensitive = _ref.caseSensitive,
          caseSensitive = _ref$caseSensitive === void 0 ? false : _ref$caseSensitive,
          _ref$exact = _ref.exact,
          exact = _ref$exact === void 0 ? false : _ref$exact;
      var all = this.querySelectorAll(query);

      if (text) {
        all = all.filter(function (wrapper) {
          var texts = [wrapper.text, text].map(function (t) {
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

      return all;
    }
    /**
     * Get the first element of a query to `all`
     *
     * @param {Object} options
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
     * @param {Object} options
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

                if (!(_context2.t0 instanceof _promiseTimeout.TimeoutError)) {
                  _context2.next = 11;
                  break;
                }

                throw new Error("Could not find element: ".concat(JSON.stringify(options, null, 2)));

              case 11:
                throw _context2.t0;

              case 12:
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
     */

  }, {
    key: "click",
    value: function click() {
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

  }, {
    key: "attach",
    value: function () {
      var _attach = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(files) {
        var dataTransfer, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                dataTransfer = new DataTransfer();
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 4;

                for (_iterator = files[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  file = _step.value;
                  dataTransfer.items.add(file);
                }

                _context4.next = 12;
                break;

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context4.t0;

              case 12:
                _context4.prev = 12;
                _context4.prev = 13;

                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }

              case 15:
                _context4.prev = 15;

                if (!_didIteratorError) {
                  _context4.next = 18;
                  break;
                }

                throw _iteratorError;

              case 18:
                return _context4.finish(15);

              case 19:
                return _context4.finish(12);

              case 20:
                this.node.files = dataTransfer.files;
                this.sendChangeEvent();

              case 22:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[4, 8, 12, 20], [13,, 15, 19]]);
      }));

      function attach(_x4) {
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
      this.dispatchEvent(new FocusEvent(this.getEventOptions({
        relatedTarget: this.node
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

      text.forEach(function (key) {
        return _this3.typeKey(key);
      });
    }
    /**
     * Type into a fields value. Only simulates the final key press then
     * triggers a single change event
     *
     * @param {String} text
     */

  }, {
    key: "typeValue",
    value: function typeValue(text) {
      this.log('typeValue', text);
      this.focus();
      this.node.value = text;
      var key = (text || '').toString().slice(-1)[0];

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

  }, {
    key: "fillIn",
    value: function () {
      var _fillIn = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(label, value) {
        var field;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.log('fillIn', label);
                _context5.next = 3;
                return this.field(label);

              case 3:
                field = _context5.sent;
                _context5.t0 = field.tag;
                _context5.next = _context5.t0 === 'select' ? 7 : 10;
                break;

              case 7:
                _context5.next = 9;
                return field.select({
                  text: value
                });

              case 9:
                return _context5.abrupt("break", 12);

              case 10:
                _context5.next = 12;
                return field.typeValue(value);

              case 12:
                return _context5.abrupt("return", field);

              case 13:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function fillIn(_x5, _x6) {
        return _fillIn.apply(this, arguments);
      }

      return fillIn;
    }()
    /**
     * Find a select by its label then fill it in
     *
     * @param {String} label
     * @param {String} text
     * @param {Object} options
     *
     * @returns {SimulateUser} - The field wrapper
     */

  }, {
    key: "fillSelect",
    value: function () {
      var _fillSelect = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(label, text) {
        var options,
            field,
            _args6 = arguments;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                options = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : {};
                _context6.next = 3;
                return this.field(label);

              case 3:
                field = _context6.sent;
                _context6.next = 6;
                return field.select((0, _objectSpread2["default"])({
                  text: text
                }, options));

              case 6:
                return _context6.abrupt("return", field);

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function fillSelect(_x7, _x8) {
        return _fillSelect.apply(this, arguments);
      }

      return fillSelect;
    }()
    /**
     * Change a value by the option text
     *
     * @param {Object} options
     */

  }, {
    key: "select",
    value: function () {
      var _select = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(_ref3) {
        var text, exact, caseSensitive, option;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                text = _ref3.text, exact = _ref3.exact, caseSensitive = _ref3.caseSensitive;
                this.log('select', {
                  text: text,
                  exact: exact,
                  caseSensitive: caseSensitive
                });
                _context7.next = 4;
                return this.find({
                  query: 'option',
                  text: text,
                  exact: exact,
                  caseSensitive: caseSensitive
                });

              case 4:
                option = _context7.sent;
                this.node.value = option.value;
                this.sendChangeEvent();

              case 7:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function select(_x9) {
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
      this.dispatchEvent(new Event('input', this.getEventOptions()));
      this.dispatchEvent(new Event('change', this.getEventOptions()));
    } // Getters

    /**
     * nextElementSibling but returns a wrapper
     *
     * @returns {SimulateUser|null}
     */

  }, {
    key: "nextElementSibling",
    get: function get() {
      return this.node.nextElementSibling && new SimulateUser(this.node.nextElementSibling);
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
      return options.map(function (_ref4) {
        var value = _ref4.value;
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
  }]);
  return SimulateUser;
}();

exports["default"] = SimulateUser;