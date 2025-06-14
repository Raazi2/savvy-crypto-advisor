
-- Create financial_goals table for Goal Planning feature
CREATE TABLE public.financial_goals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    target_amount numeric NOT NULL,
    current_amount numeric DEFAULT 0,
    target_date date NOT NULL,
    category text NOT NULL DEFAULT 'other',
    monthly_contribution numeric DEFAULT 0,
    progress numeric GENERATED ALWAYS AS (
        CASE 
            WHEN target_amount > 0 THEN (current_amount / target_amount) * 100
            ELSE 0
        END
    ) STORED,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals" ON public.financial_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON public.financial_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON public.financial_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON public.financial_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.financial_goals
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
