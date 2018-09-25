const { Pool } = require("pg");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const httpErrors = require("http-errors");
require("dotenv").config();

const app = express();
app.use(logger("dev"));
app.use(cors());

const api = express.Router();
const pool = new Pool();

(async function run() {
    // load the queries from file
    const queries = await require("../sql/loader")();

    api.get("/items", async function(req, res) {
        try {
            const items = await pool.query("SELECT * FROM items ORDER BY label");
            res.json(items.rows);
        } catch(e) {
            console.error("Query failed", e);
        }
    });

    api.get("/tree/:root_id", async function(req, res) {
        const source = req.params.root_id;
        const { getNodeData, getEdgeData } = queries;

        try {
            const nodes = await pool.query(getNodeData, [source]);
            const edges = await pool.query(getEdgeData, [source]);

            nodes.rows.forEach(node => {
                node.tag_map = node.tags.reduce((map, fullTag) => {
                    const [tag, modifier] = fullTag.split(":");
                    map[tag] = modifier || true;
                    return map;
                }, {});
            });

            res.json(nodes.rows.concat(edges.rows));
        } catch(e) {
            console.error("Query failed", e);
        }
    });

    api.get("/local_dependencies/:root_id", async function(req, res) {
        const source = req.params.root_id;
        const { getLocalDependencies } = queries;
        try {
            const edges = await pool.query(getLocalDependencies, [source]);
            res.json(edges.rows);
        } catch(e) {
            console.error("Query failed", e);
        }
    });

    // use the router
    app.use("/api", api);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(httpErrors(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = err || {};

        // render the error page
        res.status(err.status || 500);
        res.send("Server Error");
    });

    app.listen(3000);
})();