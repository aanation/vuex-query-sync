require('core-js/fn/map'); 
require('core-js/fn/promise'); 


import Vue from 'vue'; 
import Joi from 'joi-browser'; 
import {QuerySyncError} from './errors';

function validateOptions(options) {
    let {error} = Joi.validate(options, Joi.object().keys({
        sync: Joi.array().items(Joi.object().keys({
            param: Joi.string().required(), 
            targetStoreModule: Joi.string().required()
        })).required()
    })); 
    if (error !== null) throw new QuerySyncError('incorrect options object!',err); 
}

function pushQuery(state, router) {
    let currQuery = Object.assign({}, router.currentRoute.query); 
    let newParam = {};
    newParam[param] = JSON.stringify(state); 
    router.push({
        query: Object.assign(currQuery, {
            param: newParam
        }) 
    }); 
}     

function extractPropsToStore(targetStoreModule, json, store) {
    let props = parseJSON(json);  
    if (props === null) return next(new QuerySyncError(`get-parameter ${param} must be correct JSON`));
    store.commit(`${targetStoreModule}/CLEAR`, props);
    store.commit(`${targetStoreModule}/SET_PROPS`, props);
} 

function parseJSON(s) {
    let obj;
    try {
        obj = JSON.parse(s); 
    } catch(err) {
        obj = null; 
    }
    return obj; 
}


/**
 * Синхронизирует хранилище и гет-параметры
 * 
 * @param {*} store - экземпляр хранилища
 * @param {*} router - экземпляр роутера
 * @param {object} options - опции инициализации  
 * @property {array.<{param: string, targetStoreModule: string}>} options.sync - массив пар из get-параметра и соответствующего названия модуля хранилища 
 * в который содержимого параметра будет извлекаться
 * 
 */

export default function(store, router, options) {
    validateOptions(options); 

    options.sync.forEach(({param, targetStoreModule}) => {
        if (store.state[targetStoreModule]) {
            return; 
        }

        store.registerModule(targetStoreModule, {
            namespased: true, 
            state: {},  
            actions: {
                addProps({state, commit}, prop, val) {
                    if (typeof prop === "object" && Object.keys(prop).length > 0) {
                        commit('SET_PROPS', prop);
                    } else if (typeof prop === "string" && val !== undefined) {
                        let obj = {}; 
                        obj[prop] = val; 
                        commit('SET_PROPS', obj);
                    } else {
                        throw new QuerySyncError('incorrect arguments!');
                    }       
                    pushQuery(state, router);

                },
                removeProps({state, commit}, props) {
                    if (typeof props === "string") {
                        commit('REMOVE', [props]);
                    } else if (!Joi.validate(props, Joi.array().items(Joi.string())).error) {
                        commit('REMOVE', props); 
                    } else {
                        throw new QuerySyncError('arg2 must be array of strings!');
                    }
                    pushQuery(state, router);
                }
            }, 
            mutations: {
                SET_PROPS(state, props) {
                    Object.keys(props).forEach(propName => {
                        Vue.set(state, propName, props[propName]); 
                    });
                }, 
                CLEAR(state, props) {
                    Object.keys(state).forEach(propName => {
                        Vue.delete(state, propName); 
                    }); 
                },  
                REMOVE(state, props) {
                    props.forEach(propName => {
                        Vue.delete(state, propName);
                    });
                }
            }
        });

        router.beforeRouteUpdate((to, from, next) => {
            if (to.query[param]) {
                extractPropsToStore(to.query[param]);
            }
            next();
        }); 

        if (router.currentRoute.query[param]) {
            extractPropsToStore(to.query[param]);
        }
    });


}