# Vuex-query-sync

Связывает между собой содержимое гет-параметра с хранилищем. 


## Использование

### Инициализация 

```javascript 
import querySync from 'vuex-query-sync'; 

let router = new Router({
    mode: 'history',
    routes
});

let store = new Vuex.Store({});

querySync(store, router, {
    sync: [
        {
            param: 'filters', 
            targetStoreModule: 'filters'
        }
    ]
});

const app = new Vue({
    store,
    router,
    render: h => h(App)
});
```

Теперь при попадании в GET-параметр param объекта в форме json-строки ее содержимое будет автоматически извлечено в модуль хранилища filters. 

Кроме того, при вызове экшенов хранилища и добавлении в него фильтров, эти данные автоматически попадут в гет-параметр param в форме JSON-строки. 

### Добавление и удаление параметров

```javascript
/* ДОБАВЛЕНИЕ */
store.dispatch('filters/addProps', 'size', '30m');
//на выходе будет ?filters="%7B%22size%22%3A%2230m%22%7D" 
// decode: {'size': '30m'}



//можно добавлять до любой степени вложенности, все будет сериализовано в json 
store.dispatch('filters/addProps', 'coords', {
    x: 3, y: 5
});
//на выходе будет ?filters="%7B%22x%22%3A3%2C%22y%22%3A5%7D"
// decode {"coords":{"x":3,"y":5}}

//можно добавить сразу несколько параметров 
store.dispatch('filters/addProps', {
    coords: {
        x: 3, 
        y: 5
    }, 
    size: '30m'
});

/* ОБНОВЛЕНИЕ */
//полностью аналогично добавлению с точки зрения аргументов, за тем исключением, что объект будет полностью заменен
store.dispatch('filters/setQuery', {
    coords: {
        x: 3,
        y: 5
    }.
    size: '30m'
}); 

/* УДАЛЕНИЕ */
store.dispatch('filters/removeProps', 'size');
store.dispatch('filters/removeProps', ['size', 'coords']); 

/* ОЧИСТИТЬ (удаляет гет параметр и отчищает хранилище )*/ 
store.dispatch('filters/clearProps');
```
