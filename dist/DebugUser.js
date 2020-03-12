"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _events = _interopRequireDefault(require("events"));

var _SimulateUser2 = _interopRequireDefault(require("./SimulateUser"));

var OWN_PROPERTIES = ['on', 'emit'];
var CALLBACKS = {
  BEFORE_CALL: 'beforeCall',
  AFTER_CALL: 'afterCall'
};
/**
 * Helper class for providing debug information.
 */

var DebugUser =
/*#__PURE__*/
function (_SimulateUser) {
  (0, _inherits2["default"])(DebugUser, _SimulateUser);

  /**
   * Setup the class.
   *
   * @param {any} args
   * @returns {Proxy}
   */
  function DebugUser() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, DebugUser);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(DebugUser)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.emitter = new _events["default"]();
    _this.logs = [];
    return (0, _possibleConstructorReturn2["default"])(_this, new Proxy((0, _assertThisInitialized2["default"])(_this), {
      /**
       * Get the needed property.
       *
       * @param {DebugUser} target
       * @param {any} prop
       * @returns {any}
       */
      get: function get(target, prop) {
        if (OWN_PROPERTIES.includes(prop)) {
          return target[prop];
        }

        if (typeof target[prop] !== 'function') {
          return target[prop];
        }

        return function () {
          var returned;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          target.emit(CALLBACKS.BEFORE_CALL, {
            method: prop,
            args: args
          });

          try {
            returned = target[prop].apply(target, args);
            return returned;
          } finally {
            target.emit(CALLBACKS.AFTER_CALL, {
              method: prop,
              args: args,
              returned: returned
            });
          }
        };
      }
    }));
  }
  /**
   * Generate a instance using the same class constructor and debug emitter
   *
   * @param {*} ...args
   *
   * @returns {Proxy<DebugUser>}
   */


  (0, _createClass2["default"])(DebugUser, [{
    key: "build",
    value: function build() {
      var Klass = this.constructor;

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var instance = (0, _construct2["default"])(Klass, args);
      instance.emitter = this.emitter;
      this.logs.push({
        child: instance.logs
      });
      return instance;
    }
    /**
     * Emit and log an event.
     *
     * @param {string} callback
     * @param {any} args
     */

  }, {
    key: "emit",
    value: function emit(callback) {
      var _this$emitter;

      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      this.logs.push({
        callback: callback,
        args: args
      });

      (_this$emitter = this.emitter).emit.apply(_this$emitter, [callback].concat(args));
    }
    /**
     * Listen to a debug event.
     *
     * @param {any} args
     */

  }, {
    key: "on",
    value: function on() {
      var _this$emitter2;

      (_this$emitter2 = this.emitter).on.apply(_this$emitter2, arguments);
    }
  }]);
  return DebugUser;
}(_SimulateUser2["default"]);

var _default = DebugUser;
exports["default"] = _default;