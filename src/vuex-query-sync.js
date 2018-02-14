import Vue from 'vue'; 
import {QuerySyncError} from './errors'; 


function validateOptions(options) {
    if (typeof options !== "object" || !Array.isArray(options.sync) || !options.sync.length) {
        throw new QuerySyncError('incorrect options object!');
    }

    options.sync.forEach(({param, targetStoreModule}) => {
        if (typeof param !== "string" || typeof targetStoreModule !== "string") {
            throw new QuerySyncError('incorrect options object!');
        }
    });
}

function isArrayOfString(test) {
    if (!Array.isArray(test)) {
        return false; 
    } 
    return test.every(v => {
        return typeof v === "string"; 
    });
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


        let pushQuery = function(state, router) {
            let currQuery = Object.assign({}, router.currentRoute.query); 
            let newParam = {};
            newParam[param] = JSON.stringify(state); 
            router.push({
                query: Object.assign(currQuery, newParam) 
            }); 
        }     
        
        let extractPropsToStore = function(targetStoreModule, json, store, next) {
            let props = parseJSON(json);  
            if (props === null) {
                let err = new QuerySyncError(`get-parameter ${param} must be correct JSON`);
                if (next) next(err);
                if (!next) throw err; 
            } 
            store.commit(`${targetStoreModule}/CLEAR`, props);
            store.commit(`${targetStoreModule}/SET_PROPS`, props);
        } 




        if (store.state[targetStoreModule]) {
            return; 
        }

        store.registerModule(targetStoreModule, {
            namespaced: true, 
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
                    } else if (isArrayOfString(props)) {
                        commit('REMOVE', props); 
                    } else {
                        throw new QuerySyncError('arg2 must be array of strings!');
                    }
                    pushQuery(state, router);
                }, 
                clearProps({state, commit}) {
                    commit('CLEAR');
                } 
            }, 
            mutations: {
                SET_PROPS(state, props) {
                    Object.keys(props).forEach(propName => {
                        if (!props.hasOwnProperty(propName)) return; 
                        Vue.set(state, propName, props[propName]); 
                    });
                }, 
                CLEAR(state, props) {
                    Object.keys(state).forEach(propName => {
                        if (!state.hasOwnProperty(propName)) return; 
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

        router.beforeEach((to, from, next) => {
            if (to.query[param]) {
                extractPropsToStore(targetStoreModule,to.query[param], store, next);
            } else {
                store.commit(`${targetStoreModule}/CLEAR`); 
            }
            next();
        }); 

        if (router.currentRoute.query[param]) {
            extractPropsToStore(targetStoreModule,to.query[param], store);
        }
    });


}