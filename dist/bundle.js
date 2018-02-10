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
var Joi = _interopDefault(require('joi-browser'));

var CustomError=function(a){function b(a,c){_classCallCheck(this,b);var d=_possibleConstructorReturn(this,(b.__proto__||_Object$getPrototypeOf(b)).call(this,a));return"function"==typeof Error.captureStackTrace?Error.captureStackTrace(d,b):d.stack=new Error(a).stack, "object"===("undefined"==typeof c?"undefined":_typeof(c))&&(d.originalErr=c), d}return _inherits(b,a), b}(Error);var QuerySyncError=function(a){function b(a,c){_classCallCheck(this,b);var d=_possibleConstructorReturn(this,(b.__proto__||_Object$getPrototypeOf(b)).call(this,a,c));return d.name="QuerySyncError", d}return _inherits(b,a), b}(CustomError);

require('core-js/fn/map'), require('core-js/fn/promise');function validateOptions(a){var b=Joi.validate(a,Joi.object().keys({sync:Joi.array().items(Joi.object().keys({param:Joi.string().required(),targetStoreModule:Joi.string().required()})).required()})),c=b.error;if(null!==c)throw new QuerySyncError('incorrect options object!',err)}function pushQuery(a,b){var c=_Object$assign({},b.currentRoute.query),d={};d[param]=_JSON$stringify(a), b.push({query:_Object$assign(c,{param:d})});}function extractPropsToStore(a,b,c){var d=parseJSON(b);return null===d?next(new QuerySyncError('get-parameter '+param+' must be correct JSON')):void(c.commit(a+'/CLEAR',d), c.commit(a+'/SET_PROPS',d))}function parseJSON(a){var b;try{b=JSON.parse(a);}catch(a){b=null;}return b}function vuexQuerySync(a,b,c){validateOptions(c), c.sync.forEach(function(c){var d=c.param,e=c.targetStoreModule;a.state[e]||(a.registerModule(e,{namespased:!0,state:{},actions:{addProps:function addProps(a,c,d){var e=a.state,f=a.commit;if('object'===('undefined'==typeof c?'undefined':_typeof(c))&&0<_Object$keys(c).length)f('SET_PROPS',c);else if('string'==typeof c&&d!==void 0){var g={};g[c]=d, f('SET_PROPS',g);}else throw new QuerySyncError('incorrect arguments!');pushQuery(e,b);},removeProps:function removeProps(a,c){var d=a.state,e=a.commit;if('string'==typeof c)e('REMOVE',[c]);else if(!Joi.validate(c,Joi.array().items(Joi.string())).error)e('REMOVE',c);else throw new QuerySyncError('arg2 must be array of strings!');pushQuery(d,b);}},mutations:{SET_PROPS:function SET_PROPS(a,b){_Object$keys(b).forEach(function(c){Vue.set(a,c,b[c]);});},CLEAR:function CLEAR(a){_Object$keys(a).forEach(function(b){Vue.delete(a,b);});},REMOVE:function REMOVE(a,b){b.forEach(function(b){Vue.delete(a,b);});}}}), b.beforeRouteUpdate(function(a,b,c){a.query[d]&&extractPropsToStore(a.query[d]), c();}), b.currentRoute.query[d]&&extractPropsToStore(to.query[d]));});}

module.exports = vuexQuerySync;
