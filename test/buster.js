var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "browser", // or "node"
//    environment: "node", // or "browser"
    sources: [
//        "script/mytime/**/*.js",
//        "script/dojo/dojo/dojo-minified.js"
//        "script/dojo/dojo/dojo.js"
        "script/mytime/**/*.js",
        "script/mytime/**/*.html"
    ],
    libs: [
        "test/dojoConfig.js",
        "script/dojo/dojo/dojo-minified.js"
    ],
//    resources: [
////        "script/dojo/**/*.js",
////        "script/dojo/**/*.html",
//        "script/mytime/**/*.js",
//        "script/mytime/**/*.html"
//    ],
    tests: [
        "test/mytime/**/*.bs.js"
    ]
//    extensions: [require("buster-amd")]
}

