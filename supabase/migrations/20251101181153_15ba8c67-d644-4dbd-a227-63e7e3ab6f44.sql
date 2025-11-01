-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create quiz_attempts table for tracking user progress
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  time_taken INTEGER, -- in seconds
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create quiz_stats view for user statistics
CREATE OR REPLACE VIEW public.quiz_stats AS
SELECT 
  user_id,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
  ROUND(AVG(CASE WHEN is_correct THEN 100 ELSE 0 END), 2) as accuracy_percentage,
  SUM(xp_earned) as total_quiz_xp,
  COUNT(DISTINCT DATE(created_at)) as days_active
FROM public.quiz_attempts
GROUP BY user_id;

-- Create quiz_streaks table for daily participation
CREATE TABLE IF NOT EXISTS public.quiz_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_quiz_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_questions
CREATE POLICY "Anyone can view quiz questions"
  ON public.quiz_questions
  FOR SELECT
  USING (true);

CREATE POLICY "Moderators can insert quiz questions"
  ON public.quiz_questions
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Moderators can update quiz questions"
  ON public.quiz_questions
  FOR UPDATE
  USING (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Moderators can delete quiz questions"
  ON public.quiz_questions
  FOR DELETE
  USING (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for quiz_attempts
CREATE POLICY "Users can view their own attempts"
  ON public.quiz_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts"
  ON public.quiz_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quiz_streaks
CREATE POLICY "Users can view their own streaks"
  ON public.quiz_streaks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks"
  ON public.quiz_streaks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON public.quiz_streaks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_created_at ON public.quiz_attempts(created_at DESC);
CREATE INDEX idx_quiz_questions_category ON public.quiz_questions(category);
CREATE INDEX idx_quiz_questions_difficulty ON public.quiz_questions(difficulty);

-- Add updated_at triggers
CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quiz_streaks_updated_at
  BEFORE UPDATE ON public.quiz_streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();