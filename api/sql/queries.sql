-- @query getNodeData
-- first get the distinct dependencies for the root node
WITH dt AS (
    SELECT DISTINCT ON(tree.id) tree.source_id, tree.target_id, tree.amount
    FROM fn_get_dependency_tree($1) tree (id, source_id, target_id, amount))
-- get all target (dependency) nodes
SELECT nd.*,
    -- plus the aggregate of all amounts as totals
    sum((CASE WHEN (SELECT exists(select 1 from item_tags where tag_name = 'fabricator' and item_id = nd.real_id))
        THEN 0
        ELSE dt.amount END)) OVER (PARTITION BY dt.target_id) as total
FROM vw_node_data nd
INNER JOIN dt ON nd.real_id = dt.target_id
-- then union the root node onto the list
UNION
SELECT *, 1 FROM vw_node_data WHERE real_id = $1
ORDER BY build_rank;

-- @query getEdgeData
WITH dt AS(SELECT * FROM fn_get_dependency_tree($1))
SELECT * FROM vw_edge_data
    WHERE real_id IN (SELECT id FROM dt);

-- @query getLocalDependencies
SELECT nd.*, dp.amount FROM vw_node_data nd
INNER JOIN dependencies dp ON dp.target_id = nd.real_id
WHERE source_id = $1