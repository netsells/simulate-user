"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DebugUser", {
  enumerable: true,
  get: function get() {
    return _DebugUser["default"];
  }
});
exports["default"] = void 0;

var _SimulateUser = _interopRequireDefault(require("./SimulateUser"));

var _DebugUser = _interopRequireDefault(require("./DebugUser"));

var _default = _SimulateUser["default"];
exports["default"] = _default;