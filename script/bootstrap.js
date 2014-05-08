require({
    packages: [
        { name: 'mytime', location: '../../script/mytime' },
        { name: 'lodash', location: '../lodash/dist', main: 'lodash.min' }
    ]
}, ['mytime/debug-helper', 'mytime/main', 'dojo/parser', 'dojo/ready'], function(_1, _2, parser, ready){
    ready(function(){
        parser.parse();
    });
});