var uglifyJS = require("uglify-js");

module.exports = function UglifyJS(file, options) {

    // 设置默认选项。
    options = merge(options, {
        sourceMap: file.sourceMap ? {
            content: file.sourceMapObject
        } : false,
        ie8: true,
        parse: {
            filename: file.srcPath
        },
        compress: {
            drop_console: true,
            dead_code: true,
            drop_debugger: true,
            global_defs: {
                DEBUG: false,
                RELEASE: true
            }
        },
        output: {
            comments: /^!|@preserve|@license|@cc_on/
        }
    });

    // 生成。
    var result = uglifyJS.minify(file.content, options);
    if (result.error) {
        return file.error({
            plugin: UglifyJS.name,
            message: result.error.message,
            line: result.error.line == undefined ? undefined : result.error.line - 1,
            column: result.error.col,
            error: result.error,
        });
    }
    if (result.warnings && result.warnings.length) {
        for (var i = 0; i < result.warnings.length; i++) {
            var warning = result.warnings[i];
            var match = /\s*\[\d+:(\d+),(\d+)\]$/.exec(warning);
            file.warning({
                plugin: UglifyJS.name,
                message: match ? warning.substr(0, match.index) : warning,
                line: match && +match[1],
                column: match && +match[2]
            });
        }
    }

    // 保存。
    file.content = result.code;
    if (result.map) {
        var map = JSON.parse(result.map);
        map.sources[0] = file.srcPath;
        file.sourceMapObject = map;
    }
};

function merge(src, dest) {
    for (var key in src) {
        if (src[key] && dest[key] && typeof src[key] === "object" && typeof dest[key] === "object") {
            merge(dest[key], src[key]);
        } else {
            dest[key] = src[key];
        }
    }
    return dest;
}
