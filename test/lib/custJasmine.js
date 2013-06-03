function demand(moduleId) {
    var result;
    require([moduleId], function(module) {
        result = module;
    });
    return result;
}

beforeEach(function() {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute("class");
    document.body.removeAttribute("class");
});

(function() {

    if (!document.getElementById('claroCSS')) {
        var link = document.createElement("LINK");
        link.setAttribute("id", "claroCSS");
        link.setAttribute("type", "text/css");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "http://localhost:9876/script/dojo/dijit/themes/claro/claro.css");
        document.head.appendChild(link);
    }

    var originalDescribe;

    function startInterceptingDescribe(moduleIds) {
        originalDescribe = describe;
        describe = function(description, func) {
            var describeCode = func.toString();
            /* TODO: ignore commented-out demand()s */
            var regex = /\bdemand\s*\(\s*["']([^"']+)["']\s*\)/g;
            var match;

            while (match = regex.exec(describeCode)) {
                var moduleId = match[1];
                moduleIds.push(moduleId);
            }

            originalDescribe(description, func);
        }
    }

    function stopInterceptingDescribe() {
        describe = originalDescribe;
    }

    function isSpec(srcPath) {
        return srcPath.match(/^\/test\/.*\.spec\.js$/)
    }

    function loadSourceViaAMD(file, onSourceLoad) {
        console.log("loadSource", file.fileSrc, file.timestamp, file.basePath);
        if (isSpec(file.fileSrc)) {
            require([file.fileSrc], function(module) {
                onSourceLoad({
                    file: file,
                    success: true
                })
            });
            return true;
        }

        return false;
    }

    function loadSourcePreloadingDemands(file, onSourceLoad) {
        console.log("loadSource", file.fileSrc, file.timestamp, file.basePath);
        if (isSpec(file.fileSrc)) {
            var defaultPlugin = jstestdriver.pluginRegistrar.getPlugin("defaultPlugin");
            var moduleIds = [];

            startInterceptingDescribe(moduleIds);

            defaultPlugin.loadSource(file, function(result) {
                stopInterceptingDescribe();
                console.log("PRELOAD: ", moduleIds);
                require(moduleIds, function() {
                    console.log("PRELOADED: ", moduleIds);
                    onSourceLoad(result);
                });
            });

            return true;
        } else {
            return false;
        }
    }

    jstestdriver.pluginRegistrar.register({

        name: 'jasmine-amd-demand',

        loadSource: loadSourcePreloadingDemands,

        getTestRunsConfigurationFor: function(testCaseInfos, expressions, testRunsConfiguration) {
            console.log("getTestRunsConfigurationFor", testCaseInfos, expressions, testRunsConfiguration);
            return false; // allow other TestCases to be collected.
        },

        runTestConfiguration: function(config, onTestDone, onComplete) {
            console.log("runTestConfiguration", config, onTestDone, onComplete);
            return false;
        },

        onTestsStart: function() {
            console.log("onTestsStart");
        },

        onTestsFinish: function() {
            console.log("onTestsFinish");
        }

    });
})();