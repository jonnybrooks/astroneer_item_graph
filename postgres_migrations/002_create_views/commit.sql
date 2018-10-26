-- Generate the view for getting vertex data
CREATE OR REPLACE VIEW vw_node_data AS
    select 'n' || i.id as id,
           i.id as real_id,
           i.label,
           array_agg(t.name) as tags,
           i.colour,
           i.icon_url
    from item_tags as it
      full outer join items as i on it.item_id = i.id
      full outer join tags as t on it.tag_name = t.name
    group by i.id
    order by i.id;

-- Generate the view for getting dependency data
CREATE VIEW vw_edge_data AS
    select concat('e', id) as id,
        concat('n', source_id) as source,
        concat('n', target_id) as target,
        (select label from items where id = source_id) as source_label,
        (select label from items where id = target_id) as target_label,
        (select colour from items where id = source_id) as colour,
        amount
    from dependencies
    order by source_label;