# Supabase Database Setup

This directory contains the complete database schema for the Immersive Travel application.

## Quick Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the contents of `schema.sql`
4. Paste and run in the SQL Editor
5. Verify tables were created in **Table Editor**

## What Gets Created

### Tables

1. **profiles**
   - Stores user profile information
   - Automatically created when user signs up
   - Linked to Supabase Auth via UUID

2. **destinations**
   - Core content library
   - Stores travel destination data with parallax layers
   - Includes 4 sample destinations

3. **user_saves**
   - Junction table for bookmarks
   - Links users to their saved destinations
   - Prevents duplicate saves with UNIQUE constraint

### Security (Row Level Security)

All tables have RLS enabled with appropriate policies:

- **profiles**: Users can only update their own profile
- **destinations**: Public read, authenticated write
- **user_saves**: Users can only see/modify their own saves

### Triggers

- **on_auth_user_created**: Automatically creates profile when user signs up
- **update_updated_at**: Automatically updates `updated_at` timestamp

### Indexes

Performance indexes on:
- `user_saves.user_id`
- `user_saves.destination_id`
- `destinations.category`
- `destinations.featured`

## Sample Data

The schema includes 4 sample destinations:
1. Misty Peaks of Patagonia (Mountains)
2. Azure Dreams of Santorini (Beaches)
3. Neon Pulse of Tokyo (Cities)
4. Emerald Whispers of Iceland (Wilderness)

## Modifying the Schema

To add new fields or tables:

1. Write your SQL in a new file or modify `schema.sql`
2. Run in Supabase SQL Editor
3. Update TypeScript types in `src/types/database.ts`

## Helpful Queries

### Get all destinations with save count
```sql
SELECT 
  d.*,
  COUNT(us.id) as save_count
FROM destinations d
LEFT JOIN user_saves us ON d.id = us.destination_id
GROUP BY d.id;
```

### Get user's saved destinations
```sql
SELECT d.*
FROM destinations d
INNER JOIN user_saves us ON d.id = us.destination_id
WHERE us.user_id = 'user-uuid-here';
```

### Get featured destinations
```sql
SELECT * FROM destinations
WHERE featured = true
ORDER BY created_at DESC;
```

## Troubleshooting

### RLS Policy Errors

If you get "row level security policy violation":
1. Check user is authenticated
2. Verify policies exist: **Database > Policies**
3. Check Supabase logs: **Authentication > Logs**

### Trigger Not Working

If profiles aren't created automatically:
1. Verify trigger exists in **Database > Triggers**
2. Check function exists: `handle_new_user()`
3. Test by signing up a new user

### Performance Issues

If queries are slow:
1. Check indexes exist: **Database > Indexes**
2. Use `EXPLAIN ANALYZE` to debug queries
3. Consider adding more indexes for your use case

## Resources

- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
