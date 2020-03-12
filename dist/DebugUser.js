"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _events = _interopRequireDefault(require("events"));

var _SimulateUser = _interopRequireDefault(require("./SimulateUser"));

/**
 * Helper class for providing debug information.
 */
var DebugUser =
/*#__PURE__*/
function () {
  /**
   * Setup the class.
   *
   * @param {any} args
   * @returns {Proxy}
   */
  function DebugUser() {
    (0, _classCallCheck2["default"])(this, DebugUser);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var user = (0, _construct2["default"])(_SimulateUser["default"], args);
    this.emitter = new _events["default"]();
    return new Proxy(this, {
      /**
       * Get the needed property.
       *
       * @param {DebugUser} target
       * @param {any} prop
       * @returns {any}
       */
      get: function get(target, prop) {
        if (target[prop]) {
          return target[prop];
        }

        if (typeof user[prop] !== 'function') {
          return user[prop];
        }

        return function () {
          var returned;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          target.emitter.emit('beforeCall', {
            method: prop,
            args: args
          });

          try {
            returned = user[prop].apply(user, args);
            return returned;
          } finally {
            target.emitter.emit('afterCall', {
              method: prop,
              args: args,
              returned: returned
            });
          }
        };
      }
    });
  }
  /**
   * Listen to a debug event.
   *
   * @param {any} args
   */


  (0, _createClass2["default"])(DebugUser, [{
    key: "on",
    value: function on() {
      var _this$emitter;

      (_this$emitter = this.emitter).on.apply(_this$emitter, arguments);
    }
  }]);
  return DebugUser;
}();

var _default = DebugUser;
exports["default"] = _default;