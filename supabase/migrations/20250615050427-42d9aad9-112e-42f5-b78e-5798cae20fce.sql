
-- Add user_id column to portfolio_holdings table to establish proper user relationships
ALTER TABLE public.portfolio_holdings 
ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update existing holdings to link them to their portfolio owners
UPDATE public.portfolio_holdings 
SET user_id = (
  SELECT p.user_id 
  FROM public.portfolios p 
  WHERE p.id = portfolio_holdings.portfolio_id
);

-- Make user_id NOT NULL after populating existing data
ALTER TABLE public.portfolio_holdings 
ALTER COLUMN user_id SET NOT NULL;

-- Update RLS policy to use user_id directly for better performance
DROP POLICY IF EXISTS "Users can view their own holdings" ON public.portfolio_holdings;

CREATE POLICY "Users can view their own holdings" ON public.portfolio_holdings
  FOR ALL USING (auth.uid() = user_id);

-- Add index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_user_id 
ON public.portfolio_holdings(user_id);
