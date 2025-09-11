# Migration Notes

This folder contains all manual SQL migrations for our project.  
Each migration is applied using:

```bash
npm run migrate:apply


### 2025-09-11 – `20250911131000_add_cities_table.sql`
- Created `cities` table
- Linked `cities.state_id` → `states.id`
- Added index on `state_id`