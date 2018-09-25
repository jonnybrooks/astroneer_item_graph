const {resolve} = require("path");

module.exports = function() {
    return new Promise(function (res) {
        const reader = require("readline").createInterface({
            input: require("fs").createReadStream(resolve(__dirname, "queries.sql"))
        });

        let cursor, builder = "", queries = {};
        reader.on("line", function(line) {
            if(line.includes("@query")) {
                commitActiveQuery();
                cursor = line.match(/@query\s([\w\d_]+)/)[1];
            } else {
                builder += line + "\n";
            }
        });

        reader.on("close", function() {
            commitActiveQuery();
            res(queries);
        });

        function commitActiveQuery() {
            if(cursor) queries[cursor] = builder;
            builder = "";
        }
    });
};