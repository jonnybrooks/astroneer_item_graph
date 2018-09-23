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

api.get("/items", async function(req, res) {
    try {
        const items = await pool.query("SELECT * FROM items");
        res.json(items.rows);
    } catch(e) {
        console.error("Query failed", e);
    }
});

api.get("/tags", async function(req, res) {
    try {
        const tags = await pool.query("SELECT * FROM tags");
        const tagMap = tags.rows.reduce((map, tag) =>
            Object.assign(map, {[tag.name]: tag.description}), {});
        res.json(tagMap);
    } catch(e) {
        console.error("Query failed", e);
    }
});

api.get("/tree/:root_id", async function(req, res) {
    const source = req.params.root_id;
    const getNodesSql = `
        WITH dependency_tree AS(SELECT * FROM fn_get_dependency_tree($1))
        SELECT * FROM v_node_data
            WHERE id IN (SELECT concat('n', source_id) FROM dependency_tree)
            OR id IN (SELECT concat('n', target_id) FROM dependency_tree);
    `;

    const getEdgesSql = `
        WITH dependency_tree AS(SELECT * FROM fn_get_dependency_tree($1))
        SELECT * FROM v_edge_data WHERE id IN (SELECT concat('e', id) FROM dependency_tree);
    `;

    try {
        const nodes = await pool.query(getNodesSql, [source]);
        const edges = await pool.query(getEdgesSql, [source]);
        res.json(nodes.rows.concat(edges.rows));
    } catch(e) {
        console.error("Query failed", e);
    }
});

api.get("/build_plan/:root_id", async function(req, res) {
    const rootId = req.params.root_id;
    const sql = `
        -- get the dependency tree
        WITH dt AS (SELECT DISTINCT ON (tree.id) * FROM fn_get_dependency_tree($1) tree),
        -- generate the build path
        build_path AS (
          SELECT DISTINCT ON (dt.target_id)
            dt.target_id as id,
            si.rank AS rank,
            ti.label AS label,
            sum(dt.amount) AS amount
          FROM dt
            INNER JOIN items si ON dt.target_id = si.id
            INNER JOIN items ti ON dt.target_id = ti.id
          GROUP BY dt.target_id, si.rank, ti.label)
        SELECT
               id,
               rank,
               label,
               (CASE WHEN exists(SELECT 1 FROM item_tags WHERE tag_name = 'fabricator' AND item_id = id)
                     THEN 1
                     ELSE amount
               END)
        FROM build_path
        ORDER BY rank;`;

    const {rows} = await pool.query(sql, [rootId]);
    res.json(rows);
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