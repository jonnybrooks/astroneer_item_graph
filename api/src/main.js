const { Pool } = require("pg");
const api = require("express")();
const cors = require("cors");
require("dotenv").config();

api.use(cors());

const pool = new Pool();

api.get("/", async function(req, res) {
    try {
        const nodes = await pool.query("SELECT * FROM v_node_data");
        const edges = await pool.query("SELECT * FROM v_edge_data");
        res.json(nodes.rows.concat(edges.rows));
    } catch(e) {
        console.error("Query failed", e);
    }
});

api.get("/tree/:source", async function(req, res) {
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

api.listen(3000);