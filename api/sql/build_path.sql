-- get build plan
WITH dt AS (
      SELECT DISTINCT ON (tree.id) tree.id, tree.source_id, tree.target_id, tree.amount, tree.path
      FROM fn_get_dependency_tree(92) tree (id, source_id, target_id, amount, path)
  ), build_path AS (
      SELECT DISTINCT ON (dt.target_id) dt.target_id AS id, si.build_rank, ti.label, sum(dt.amount) AS amount
      FROM ((dt
          JOIN items si ON ((dt.target_id = si.id)))
          JOIN items ti ON ((dt.target_id = ti.id)))
      GROUP BY dt.target_id, si.build_rank, ti.label
  )
  SELECT build_path.id,
         build_path.build_rank,
         build_path.label,
         CASE
           WHEN (EXISTS(SELECT 1
                        FROM item_tags
                        WHERE ((item_tags.tag_name = 'fabricator' :: text) AND (item_tags.item_id = build_path.id))))
                   THEN (1) :: bigint
           ELSE build_path.amount
             END AS amount
  FROM build_path
  ORDER BY build_path.build_rank;

-- get terminal build paths
  WITH dt AS (
      SELECT fn_get_dependency_tree.id,
             fn_get_dependency_tree.source_id,
             fn_get_dependency_tree.target_id,
             fn_get_dependency_tree.amount,
             fn_get_dependency_tree.path
      FROM fn_get_dependency_tree(92) fn_get_dependency_tree (id, source_id, target_id, amount, path)
  )
  SELECT dt1.target_id                                                    AS leaf_node,
         dt1.amount,
         (SELECT items.label FROM items WHERE (items.id = dt1.source_id)) AS penultimate_node,
         (SELECT items.label FROM items WHERE (items.id = dt1.target_id)) AS terminating_node,
         dt1.path                                                         AS full_path
  FROM dt dt1
  WHERE (NOT (EXISTS(SELECT 1
                     FROM dt dt2
                     WHERE (array_to_string(dt2.path, ',' :: text) ~~
                            (array_to_string(dt1.path, ',' :: text) || ',%' :: text)))))
  ORDER BY (array_length(dt1.path, 1)) DESC;