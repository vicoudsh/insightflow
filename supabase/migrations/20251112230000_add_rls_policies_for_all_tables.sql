-- RLS Policies for all tables
-- This migration creates coherent RLS policies that follow the ownership chain:
-- user -> projects -> (roadmaps, stacks) -> tasks -> subtasks

-- ============================================================================
-- STEP 1: ADD user_id COLUMN TO projects TABLE (if it doesn't exist)
-- ============================================================================
-- First, ensure the projects table has a user_id column for ownership tracking

DO $$ 
BEGIN
  -- Check if user_id column exists, if not, add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'projects' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE projects 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    
    -- Add comment
    COMMENT ON COLUMN projects.user_id IS 'Owner of the project - references auth.users(id)';
  END IF;
END $$;

-- ============================================================================
-- STEP 2: ENABLE RLS ON ALL TABLES (if not already enabled)
-- ============================================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: PROJECTS TABLE POLICIES
-- ============================================================================
-- Users can only access their own projects

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Policy: Users can SELECT their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can INSERT their own projects
CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can UPDATE their own projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can DELETE their own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- STEP 4: ROADMAPS TABLE POLICIES
-- ============================================================================
-- Roadmaps belong to projects, so access is controlled via projects.user_id

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view roadmaps for own projects" ON roadmaps;
DROP POLICY IF EXISTS "Users can insert roadmaps for own projects" ON roadmaps;
DROP POLICY IF EXISTS "Users can update roadmaps for own projects" ON roadmaps;
DROP POLICY IF EXISTS "Users can delete roadmaps for own projects" ON roadmaps;

-- Policy: Users can SELECT roadmaps for their own projects
CREATE POLICY "Users can view roadmaps for own projects"
  ON roadmaps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = roadmaps.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can INSERT roadmaps for their own projects
CREATE POLICY "Users can insert roadmaps for own projects"
  ON roadmaps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = roadmaps.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can UPDATE roadmaps for their own projects
CREATE POLICY "Users can update roadmaps for own projects"
  ON roadmaps FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = roadmaps.project_id 
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = roadmaps.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can DELETE roadmaps for their own projects
CREATE POLICY "Users can delete roadmaps for own projects"
  ON roadmaps FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = roadmaps.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================================================
-- STEP 5: STACKS TABLE POLICIES
-- ============================================================================
-- Stacks belong to projects, so access is controlled via projects.user_id

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view stacks for own projects" ON stacks;
DROP POLICY IF EXISTS "Users can insert stacks for own projects" ON stacks;
DROP POLICY IF EXISTS "Users can update stacks for own projects" ON stacks;
DROP POLICY IF EXISTS "Users can delete stacks for own projects" ON stacks;

-- Policy: Users can SELECT stacks for their own projects
CREATE POLICY "Users can view stacks for own projects"
  ON stacks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = stacks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can INSERT stacks for their own projects
CREATE POLICY "Users can insert stacks for own projects"
  ON stacks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = stacks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can UPDATE stacks for their own projects
CREATE POLICY "Users can update stacks for own projects"
  ON stacks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = stacks.project_id 
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = stacks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can DELETE stacks for their own projects
CREATE POLICY "Users can delete stacks for own projects"
  ON stacks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = stacks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================================================
-- STEP 6: TASKS TABLE POLICIES
-- ============================================================================
-- Tasks belong to roadmaps, so access is controlled via roadmaps -> projects.user_id

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view tasks for own projects" ON tasks;
DROP POLICY IF EXISTS "Users can insert tasks for own projects" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks for own projects" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks for own projects" ON tasks;

-- Policy: Users can SELECT tasks for roadmaps in their own projects
CREATE POLICY "Users can view tasks for own projects"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM roadmaps
      INNER JOIN projects ON projects.id = roadmaps.project_id
      WHERE roadmaps.id = tasks.roadmap_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can INSERT tasks for roadmaps in their own projects
CREATE POLICY "Users can insert tasks for own projects"
  ON tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM roadmaps
      INNER JOIN projects ON projects.id = roadmaps.project_id
      WHERE roadmaps.id = tasks.roadmap_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can UPDATE tasks for roadmaps in their own projects
CREATE POLICY "Users can update tasks for own projects"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM roadmaps
      INNER JOIN projects ON projects.id = roadmaps.project_id
      WHERE roadmaps.id = tasks.roadmap_id 
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM roadmaps
      INNER JOIN projects ON projects.id = roadmaps.project_id
      WHERE roadmaps.id = tasks.roadmap_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can DELETE tasks for roadmaps in their own projects
CREATE POLICY "Users can delete tasks for own projects"
  ON tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM roadmaps
      INNER JOIN projects ON projects.id = roadmaps.project_id
      WHERE roadmaps.id = tasks.roadmap_id 
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================================================
-- STEP 7: SUBTASKS TABLE POLICIES
-- ============================================================================
-- Subtasks belong to tasks, so access is controlled via tasks -> roadmaps -> projects.user_id

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view subtasks for own projects" ON subtasks;
DROP POLICY IF EXISTS "Users can insert subtasks for own projects" ON subtasks;
DROP POLICY IF EXISTS "Users can update subtasks for own projects" ON subtasks;
DROP POLICY IF EXISTS "Users can delete subtasks for own projects" ON subtasks;

-- Policy: Users can SELECT subtasks for tasks in their own projects
CREATE POLICY "Users can view subtasks for own projects"
  ON subtasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      INNER JOIN roadmaps ON roadmaps.id = tasks.roadmap_id
      INNER JOIN projects ON projects.id = roadmaps.project_id
      WHERE tasks.id = subtasks.task_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can INSERT subtasks for tasks in their own projects
CREATE POLICY "Users can insert subtasks for own projects"
  ON subtasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      INNER JOIN roadmaps ON roadmaps.id = tasks.roadmap_id
      INNER JOIN projects ON projects.id = roadmaps.project_id
      WHERE tasks.id = subtasks.task_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can UPDATE subtasks for tasks in their own projects
CREATE POLICY "Users can update subtasks for own projects"
  ON subtasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      INNER JOIN roadmaps ON roadmaps.id = tasks.roadmap_id
      INNER JOIN projects ON projects.id = roadmaps.project_id
      WHERE tasks.id = subtasks.task_id 
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      INNER JOIN roadmaps ON roadmaps.id = tasks.roadmap_id
      INNER JOIN projects ON projects.id = roadmaps.project_id
      WHERE tasks.id = subtasks.task_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Policy: Users can DELETE subtasks for tasks in their own projects
CREATE POLICY "Users can delete subtasks for own projects"
  ON subtasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      INNER JOIN roadmaps ON roadmaps.id = tasks.roadmap_id
      INNER JOIN projects ON projects.id = roadmaps.project_id
      WHERE tasks.id = subtasks.task_id 
      AND projects.user_id = auth.uid()
    )
  );

