module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1629993991047, function(require, module, exports) {
/*global exports*/
var SignStream = require('./lib/sign-stream');
var VerifyStream = require('./lib/verify-stream');

var ALGORITHMS = [
  'HS256', 'HS384', 'HS512',
  'RS256', 'RS384', 'RS512',
  'PS256', 'PS384', 'PS512',
  'ES256', 'ES384', 'ES512'
];

exports.ALGORITHMS = ALGORITHMS;
exports.sign = SignStream.sign;
exports.verify = VerifyStream.verify;
exports.decode = VerifyStream.decode;
exports.isValid = VerifyStream.isValid;
exports.createSign = function createSign(opts) {
  return new SignStream(opts);
};
exports.createVerify = function createVerify(opts) {
  return new VerifyStream(opts);
};

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1629993991047);
})()
//miniprogram-npm-outsideDeps=["./lib/sign-stream","./lib/verify-stream"]
//# sourceMappingURL=index.js.map