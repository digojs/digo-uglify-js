# digo-uglify-js
[digo](https://github.com/digojs/digo) 插件：使用 [UglifyJS](https://github.com/mishoo/UglifyJS) 混淆、压缩或格式化 JS。

## 安装
```bash
npm install digo-uglify-js -g
```

## 使用
### 压缩 JS
```js
digo.src("*.js", "!*.min.js").pipe("digo-uglify-js");
```

### JS 语法检查
```js
digo.src("*.js").pipe("digo-uglify-js", {
	compress: false
});
```

### 格式化 JS
```js
digo.src("*.js").pipe("digo-uglify-js", {
	compress: false,
	output: {
		beautify: true
	}
});
```

### 源映射(Source Map)
本插件支持生成源映射，详见 [源映射](https://github.com/digojs/digo/wiki/源映射)。

## 用法
```js
digo.src("*.js").pipe("digo-uglify-js", {
    warnings: false,            // 是否输出警告(如删除无用代码时会产生警告)。
    parse: {
        strict: false,          // 是否启用 JS 严格模式。
        toplevel: null,         // 顶层语法树节点。
        filename: null,         // 源文件名，主要用于报错。*
    },
    mangle: {                   // 是否混淆变量名。true 表示全部混淆；false 表示全部不混淆。
        except: null,           // 禁止混淆的变量名数组。如 ['$']。
        keep_fnames: false,     // 是否保留函数名。如果设为 false，可能会导致依赖 Function.prototype.name 的代码出错。
        toplevel: false,        // 是否混淆全局变量名。
        eval: false,            // 是否混淆 eval 和 with 可能用到的变量名。
    },
    mangleProperties: false/* { // 是否混淆属性名。true 表示全部混淆；false 表示全部不混淆。
        regex: null,            // 正则表达式。如果匹配属性名则混淆。
        ignore_quoted: false,   // 是否忽略引号形式的属性调用。
    }*/,
    compress: {                 // 是否压缩代码。false 表示全部不压缩。
        drop_console: true,     // 是否删除 console.log 等调用。*
        drop_debugger: true,    // 是否删除 debugger 语句。*
        dead_code: true,        // 是否删除永远无法执行的代码。如 if(false) { }。*
        global_defs: {          // 预设全局常量。*
            DEBUG: false,
            RELEASE: true
        },
        unsafe: false,          // 是否允许不安全的深度压缩。如 new Object() → {}。详见 https://github.com/mishoo/UglifyJS2#the-unsafe-option。
        sequences: true,        // 是否将连续语句转为逗号表达式。如 a = 1; return b; → return a=1, b; 。
        properties: true,       // 是否将常量属性名转为调用表达式。如 a["foo"] → a.foo。
        comparisons: true,      // 是否优化比较运算。如 !(a <= b) → a > b (仅当 unsafe 为 true 时优化)和 a = !b && !c && !d && !e → a=!(b||c||d||e)。
        unsafe_comps: false,    // 是否将 < 和 <= 分别转为 > 和 >= 来改进比较性能。设为 true 可能导致对象比较时出错。仅当 comparisons 为 true 时生效。
        conditionals: true,     // 是否优化常量条件表达式，如 true ? a : b。
        evaluate: true,         // 是否尝试执行常量表达式。详见 https://github.com/mishoo/UglifyJS2#conditional-compilation。
        booleans: true,         // 是否优化布尔运算。如 !!a ? b : c → a ? b : c。
        loops: true,            // 是否优化常量循环。如 while(true) → while(1)
        unused: true,           // 是否删除未引用的局部变量和函数。
        hoist_funs: true,       // 是否置顶函数声明。
        hoist_vars: false,      // 是否置顶变量声明。如果为 true 可能导致代码量增加。
        if_return: true,        // 是否优化 return/continue 语句后的 if 语句。 
        join_vars: true,        // 是否合并多个 var 语句。
        cascade: true,          // 是否尝试简化逗号表达式。如 x = something(), x → x = something()。
        collapse_vars: false,   // 是否内联只用到一次的变量和常量。
        reduce_vars: false,     // 是否内联只赋值一次(类似常量)的变量。
        warnings: false,        // 是否压缩删除代码时是否输出警告。
        negate_iife: false,     // 是否将未使用返回值的立即执行的函数表达式改为 ! 表达式。如 (function(){})() → !function(){}()。
        pure_getters: false,    // 是否将所有属性和字段都作为无副作用的调用处理。
        pure_funcs: null,       // 无副作用的函数全称数组。如 ["Math.floor"],
        side_effects: true,     // 是否删除无副作用的函数调用。如 console.log() 删除后不会影响其它逻辑。
        keep_fargs: true,       // 是否保留未使用的函数参数。如果设为 false，可能会导致依赖 Function.prototype.length 的代码出错。
        keep_fnames: false,     // 是否保留函数名。如果设为 false，可能会导致依赖 Function.prototype.name 的代码出错。
		screw_ie8: false,		// 是否删除 IE8 兼容代码。
        passes: 1,              // 执行压缩的次数。
    },
    output: {
        beautify: false,        // 是否格式化代码。
        indent_level: 4,        // 缩进空格数。仅当 beautify 为 true 时有效。
        indent_start: 0,        // 首行的缩进空格数。仅当 beautify 为 true 时有效。
        width: 80,              // 允许最大列数。仅当 beautify 为 true 时有效。
        quote_keys: false,      // 是否使用引号定义 JSON 对象的键。
        quote_style: 0,         // 引号风格。0：优先使用双引号。1：全部使用单引号。2：全部使用双引号。3：保留原引号。
        keep_quoted_props: false, // 是否保留对象字面量中的引号。
        space_colon: true,      // 是否在冒号后添加一个空格。
        ascii_only: false,      // 是否编码特殊 Unicode 字符。
        inline_script: false,   // 是否编码 "</script"。
        max_line_len: 32000,    // 允许最大行号。仅当 compress 不是 false 时有效。
        screw_ie8: false,       // 是否删除 IE8 兼容代码。
        bracketize: false,      // 是否强制为嵌套语句添加花括号。
        preamble: null,         // 在最终生成的源码前追加的文本。如包含版权声明的注释。
        comments: /^!|@preserve|@license|@cc_on/i,  // 是否保留注释。true：保留所有注释；false: 删除所有注释；正则表达式：如果匹配则保留；函数：自定义保留逻辑*
        semicolons: true,       // 是否在语句后追加分号，如果为 false 则追加换行(更具可读性；GZip 前代码可能更小；GZip 后可能更大)。
    },
    inSourceMap: null,          // 输入的源映射对象。*
    outSourceMap: false,        // 是否生成源映射。*
    fromString: true,           // 表示输入是源码内容，而不是路径。*
});
```

> *: 插件内部已设置了此选项的默认值。

另参考: [https://github.com/mishoo/UglifyJS2](https://github.com/mishoo/UglifyJS2)。
