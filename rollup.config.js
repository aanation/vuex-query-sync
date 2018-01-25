import babel from 'rollup-plugin-babel';


export default {
    input: 'src/vuex-query-sync.js',
    output: {
      file: 'dist/bundle.js',
      format: 'cjs'
    }, 
    plugins: [
        babel({
            exclude: 'node_modules/**',
            plugins: ['external-helpers'],
            externalHelpers: true,
            runtimeHelpers: true
        })
    ]
};