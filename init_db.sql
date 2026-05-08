-- ≈‰‘«¡ «·ÃœÊ· Ê ›⁄Ì· «·’·«ÕÌ« 
CREATE TABLE IF NOT EXISTS real_estate (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  neighborhood_name TEXT NOT NULL,
  property_type TEXT NOT NULL,
  price NUMERIC,
  area NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE real_estate ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON real_estate FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON real_estate FOR SELECT USING (true);
