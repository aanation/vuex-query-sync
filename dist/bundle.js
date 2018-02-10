'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));
var _Object$getPrototypeOf = _interopDefault(require('babel-runtime/core-js/object/get-prototype-of'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));
var Vue = _interopDefault(require('vue'));

var CustomError=function(a){function b(a,c){_classCallCheck(this,b);var d=_possibleConstructorReturn(this,(b.__proto__||_Object$getPrototypeOf(b)).call(this,a));return"function"==typeof Error.captureStackTrace?Error.captureStackTrace(d,b):d.stack=new Error(a).stack, "object"===("undefined"==typeof c?"undefined":_typeof(c))&&(d.originalErr=c), d}return _inherits(b,a), b}(Error);var QuerySyncError=function(a){function b(a,c){_classCallCheck(this,b);var d=_possibleConstructorReturn(this,(b.__proto__||_Object$getPrototypeOf(b)).call(this,a,c));return d.name="QuerySyncError", d}return _inherits(b,a), b}(CustomError);

function validateOptions(a){if('object'!==('undefined'==typeof a?'undefined':_typeof(a))||!Array.isArray(a.sync)||!a.sync.length)throw new QuerySyncError('incorrect options object!');a.sync.forEach(function(a){var b=a.param,c=a.targetStoreModule;if('string'!=typeof b||'string'!=typeof c)throw new QuerySyncError('incorrect options object!')});}function isArrayOfString(a){return!!Array.isArray(a)&&a.every(function(a){return'string'==typeof a})}function pushQuery(a,b){var c=_Object$assign({},b.currentRoute.query),d={};d[param]=_JSON$stringify(a), b.push({query:_Object$assign(c,{param:d})});}function extractPropsToStore(a,b,c){var d=parseJSON(b);if(null===d)throw new QuerySyncError('get-parameter '+param+' must be correct JSON');c.commit(a+'/CLEAR',d), c.commit(a+'/SET_PROPS',d);}function parseJSON(a){var b;try{b=JSON.parse(a);}catch(a){b=null;}return b}function vuexQuerySync(a,b,c){validateOptions(c), c.sync.forEach(function(c){var d=c.param,e=c.targetStoreModule;a.state[e]||(a.registerModule(e,{namespased:!0,state:{},actions:{addProps:function addProps(a,c,d){var e=a.state,f=a.commit;if('object'===('undefined'==typeof c?'undefined':_typeof(c))&&0<_Object$keys(c).length)f('SET_PROPS',c);else if('string'==typeof c&&d!==void 0){var g={};g[c]=d, f('SET_PROPS',g);}else throw new QuerySyncError('incorrect arguments!');pushQuery(e,b);},removeProps:function removeProps(a,c){var d=a.state,e=a.commit;if('string'==typeof c)e('REMOVE',[c]);else if(isArrayOfString(c))e('REMOVE',c);else throw new QuerySyncError('arg2 must be array of strings!');pushQuery(d,b);}},mutations:{SET_PROPS:function SET_PROPS(a,b){_Object$keys(b).forEach(function(c){Vue.set(a,c,b[c]);});},CLEAR:function CLEAR(a){_Object$keys(a).forEach(function(b){Vue.delete(a,b);});},REMOVE:function REMOVE(a,b){b.forEach(function(b){Vue.delete(a,b);});}}}), b.afterEach(function(b){b.query[d]&&extractPropsToStore(e,b.query[d],a);}), b.currentRoute.query[d]&&extractPropsToStore(e,to.query[d],a));});}

module.exports = vuexQuerySync;
