var digo = require("digo");

exports.default = function () {
	digo.src("fixtures/*.js").pipe("../").dest("_build");
};
