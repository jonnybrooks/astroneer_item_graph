const { Pool } = require("pg");
const api = require("express")();
const cors = require("cors");
const logger = require("morgan");
const httpErrors = require("http-errors");
require("dotenv").config();

api.use(logger("dev"));
api.use(cors());
const pool = new Pool();

// api.get("/", async function(req, res) {
//     try {
//         const nodes = await pool.query("SELECT * FROM v_node_data");
//         const edges = await pool.query("SELECT * FROM v_edge_data");
//         res.json(nodes.rows.concat(edges.rows));
//     } catch(e) {
//         console.error("Query failed", e);
//     }
// });

api.get("/api/items", async function(req, res) {
    try {
        const items = await pool.query("SELECT * FROM items");
        res.json(items.rows);
    } catch(e) {
        console.error("Query failed", e);
    }
});

api.get("/api/tags", async function(req, res) {
    try {
        const tags = await pool.query("SELECT * FROM tags");
        const tagMap = tags.rows.reduce((map, tag) =>
            Object.assign(map, {[tag.name]: tag.description}), {});
        res.json(tagMap);
    } catch(e) {
        console.error("Query failed", e);
    }
});

api.get("/api/tree/:source", async function(req, res) {
    const source = req.params.source;
    const getNodesSql = `
        WITH dependency_tree AS(SELECT * FROM sp_get_dependency_tree(${source}))
        SELECT * FROM v_node_data
            WHERE id IN (SELECT concat('n', source_id) FROM dependency_tree)
            OR id IN (SELECT concat('n', target_id) FROM dependency_tree);
    `;

    const getEdgesSql = `
        WITH dependency_tree AS(SELECT * FROM sp_get_dependency_tree(${source}))
        SELECT * FROM v_edge_data WHERE id IN (SELECT concat('e', id) FROM dependency_tree);
    `;

    try {
        const nodes = await pool.query(getNodesSql);
        const edges = await pool.query(getEdgesSql);
        res.json(nodes.rows.concat(edges.rows));
    } catch(e) {
        console.error("Query failed", e);
    }
});

// catch 404 and forward to error handler
api.use(function(req, res, next) {
    next(httpErrors(404));
});

// error handler
api.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err || {};

    // render the error page
    res.status(err.status || 500);
    res.send("Server Error");
});


api.listen(3000);