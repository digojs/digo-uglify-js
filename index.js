var uglifyJS = require("uglify-js");

module.exports = function UglifyJS(file, options) {

    // 设置默认选项。
    options = merge(options, {
        fromString: true,
        inSourceMap: file.sourceMapObject,
        outSourceMap: file.sourceMap ? file.sourceMapPath : null,
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

    // 设置警告函数。
    if (options.warnings || options.compress.warnings) {
        var oldWarnFunction = uglifyJS.AST_Node.warn_function;
        uglifyJS.AST_Node.warn_function = function (output) {
            var match = /\s*\[\d+:(\d+),(\d+)\]$/.exec(output);
            file.warning({
                plugin: UglifyJS.name,
                message: match ? output.substr(0, match.index) : output,
                line: match && +match[1],
                column: match && +match[2]
            });
        };
    }

    // 生成。
    try {
        var result = uglifyJS.minify(file.content, options);
    } catch (e) {
        return file.error({
            plugin: UglifyJS.name,
            message: e.message,
            line: e.line - 1,
            column: e.col,
            error: e,
        });
    } finally {
        if (oldWarnFunction) {
            uglifyJS.AST_Node.warn_function = oldWarnFunction;
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
