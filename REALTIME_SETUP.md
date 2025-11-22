# Supabase Realtime Setup for Stacks

This document describes how Supabase Realtime is configured for the stacks table to enable real-time updates in the frontend.

## What is Realtime?

Supabase Realtime allows you to listen to database changes in real-time. When a row is inserted, updated, or deleted in the `stacks` table, the frontend automatically receives the change event and refreshes the data.

## Migration

The migration file `supabase/migrations/20251122000000_enable_realtime_stacks.sql` enables Realtime for the `stacks` table by adding it to the `supabase_realtime` publication.

### Apply the Migration

To apply this migration to your Supabase database:

```bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase Dashboard:
# 1. Go to Database > Migrations
# 2. Run the migration SQL manually
```

## Frontend Implementation

### Hook: `useStacksRealtime`

Located in `frontend/src/hooks/useStacksRealtime.ts`, this React hook:
- Subscribes to Realtime changes on the `stacks` table
- Filters changes by `project_id` to only receive relevant updates
- Calls a callback function when changes occur

### Component: `ProjectDetails`

The `ProjectDetails` component:
- Uses the `useStacksRealtime` hook to subscribe to changes
- Automatically refreshes stacks when Realtime events are received
- Shows updated data without requiring a page refresh

### How It Works

1. **Initial Load**: When a project is selected, stacks are fetched via REST API
2. **Realtime Subscription**: The hook subscribes to Realtime changes filtered by `project_id`
3. **Change Detection**: When a change occurs (INSERT/UPDATE/DELETE), the hook receives an event
4. **Data Refresh**: The callback function (`refreshStacks`) fetches updated stacks from the API
5. **UI Update**: The component state is updated, and the table re-renders with new data

## Configuration

### Supabase Client

The Supabase client in `frontend/src/lib/supabase.ts` is configured with Realtime support:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})
```

### Enable Realtime in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Database** > **Replication**
3. Ensure **Realtime** is enabled for your project
4. Verify that the `stacks` table is included in the Realtime publication

## Testing

To test Realtime subscriptions:

1. **Create a Stack**: Use the MCP tools or API to create a new stack
   - The frontend should automatically refresh and show the new stack

2. **Update a Stack**: Modify an existing stack
   - The frontend should automatically refresh and show the updated data

3. **Delete a Stack**: Remove a stack
   - The frontend should automatically refresh and remove the stack from the table

## Browser Console

The hook logs useful information to the browser console:
- Subscription status (SUBSCRIBED, CHANNEL_ERROR, etc.)
- Realtime events received
- When stacks are refreshed

Check the console to debug any Realtime issues.

## Troubleshooting

### Stacks not refreshing

1. **Check Migration**: Ensure the migration has been applied
   ```sql
   SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
   ```
   You should see `stacks` in the list.

2. **Check Realtime Enablement**: In Supabase Dashboard, verify Realtime is enabled for your project

3. **Check Console**: Look for subscription errors in the browser console

4. **Check RLS**: Ensure RLS policies allow the user to read stacks (Realtime respects RLS)

### Subscription Status Errors

If you see `CHANNEL_ERROR` in the console:
- Verify your Supabase URL and anon key are correct
- Check that Realtime is enabled in your Supabase project
- Ensure RLS policies allow access to the stacks table

## Future Enhancements

You can extend this pattern to other tables:
- `roadmaps`: Enable Realtime for roadmap changes
- `tasks`: Enable Realtime for task changes
- `subtasks`: Enable Realtime for subtask changes

Simply:
1. Create a migration to add the table to the Realtime publication
2. Create a similar hook for the table
3. Use the hook in the relevant component

