create or replace view public.category_attributes_resolved
with (security_invoker = true)
as
with recursive category_ancestors as (
  select
    c.id as id_category,
    c.id as ancestor_id,
    c.parent_id,
    0 as distance,
    array[c.id] as visited
  from public.category c

  union all

  select
    a.id_category,
    parent.id as ancestor_id,
    parent.parent_id,
    a.distance + 1,
    a.visited || parent.id
  from category_ancestors a
  join public.category parent
    on parent.id = a.parent_id
  where not parent.id = any(a.visited)
),
effective_rules as (
  select distinct on (
    a.id_category,
    r.id_attribute_def
  )
    a.id_category,
    r.id_attribute_def,
    r.required,
    a.ancestor_id as source_category_id,
    a.distance
  from category_ancestors a
  join public.category_attribute_rules r
    on r.id_category = a.ancestor_id
  order by
    a.id_category,
    r.id_attribute_def,
    a.distance
)
select
  r.id_category,
  d.id as id_attribute_def,
  d.name,
  d.input_type,
  to_jsonb(d.options) as options,
  d.unit,
  r.required,
  r.source_category_id,
  r.distance > 0 as is_inherited
from effective_rules r
join public.attributes_definitions d
  on d.id = r.id_attribute_def;