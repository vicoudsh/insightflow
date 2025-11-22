-- Enable Realtime for stacks table
-- This allows the frontend to subscribe to changes on the stacks table

-- Add stacks table to the realtime publication
-- This enables change tracking (INSERT, UPDATE, DELETE) for realtime subscriptions
ALTER publication supabase_realtime ADD TABLE stacks;

-- Note: If you want to enable Realtime for other tables as well, you can add them:
-- ALTER publication supabase_realtime ADD TABLE roadmaps;
-- ALTER publication supabase_realtime ADD TABLE tasks;
-- ALTER publication supabase_realtime ADD TABLE subtasks;

