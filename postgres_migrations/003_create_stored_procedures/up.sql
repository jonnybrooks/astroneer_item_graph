-- Create the recursive dependency tree function
CREATE FUNCTION sp_get_dependency_tree(int)
    RETURNS TABLE(id int, source_label text, target_label text, source_id int, target_id int, amount int)
AS $$
    WITH RECURSIVE dependency_tree AS (
        SELECT id,
               (select label from items where id = source_id) as source_label,
               (select label from items where id = target_id) as target_label,
               source_id, target_id, amount
        FROM dependencies
        WHERE source_id = $1
            UNION
        SELECT d.id,
               (select label from items where id = d.source_id) as source_label,
               (select label from items where id = d.target_id) as target_label,
               d.source_id, d.target_id, d.amount
        FROM dependencies d INNER JOIN dependency_tree dt ON dt.target_id = d.source_id)
    SELECT * FROM dependency_tree;
$$
LANGUAGE SQL;