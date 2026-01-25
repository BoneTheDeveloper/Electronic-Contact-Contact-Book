-- Add get_parent_children RPC function
-- This function fetches all children for a parent with their class info
-- Used by mobile app's child selection screen

CREATE OR REPLACE FUNCTION get_parent_children(p_parent_id UUID)
RETURNS TABLE (
  id UUID,
  student_code TEXT,
  full_name TEXT,
  avatar_url TEXT,
  class_id TEXT,
  grade_id TEXT,
  is_primary BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.student_code,
    p.full_name,
    p.avatar_url,
    e.class_id,
    c.grade_id,
    sg.is_primary
  FROM student_guardians sg
  JOIN students s ON s.id = sg.student_id
  JOIN profiles p ON p.id = s.id
  JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
  JOIN classes c ON c.id = e.class_id
  WHERE sg.guardian_id = p_parent_id
    AND p.status = 'active';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_parent_children(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_parent_children(UUID) TO anon;
