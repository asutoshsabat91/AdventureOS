-- Users table with biometric verification and emergency contacts
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  biometric_verified BOOLEAN DEFAULT false,
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  emergency_contacts JSONB DEFAULT '[]',
  risk_tolerance TEXT CHECK (risk_tolerance IN ('low', 'medium', 'high')) DEFAULT 'medium',
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Itineraries table with structured AI-generated data
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  adventure_preferences TEXT[] DEFAULT '{}',
  structured_data JSONB NOT NULL DEFAULT '{}',
  status TEXT CHECK (status IN ('draft', 'confirmed', 'active', 'completed')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gear rentals marketplace (P2P and B2B)
CREATE TABLE IF NOT EXISTS gear_rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  gear_type TEXT NOT NULL,
  brand_model TEXT NOT NULL,
  description TEXT NOT NULL,
  daily_rate DECIMAL(8,2) NOT NULL,
  location TEXT NOT NULL,
  availability BOOLEAN DEFAULT true,
  insurance_required BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  rental_type TEXT CHECK (rental_type IN ('p2p', 'b2b')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat rooms for community and emergency communication
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('travel_buddy', 'emergency', 'general')) NOT NULL,
  participants UUID[] DEFAULT '{}',
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for real-time chat
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'location', 'emergency')) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergencies table for SOS functionality
CREATE TABLE IF NOT EXISTS emergencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location JSONB NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'resolved')) DEFAULT 'active',
  contacts_notified TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gear_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

-- Users RLS policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Itineraries RLS policies
CREATE POLICY "Users can view own itineraries" ON itineraries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own itineraries" ON itineraries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own itineraries" ON itineraries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own itineraries" ON itineraries FOR DELETE USING (auth.uid() = user_id);

-- Gear rentals RLS policies
CREATE POLICY "Anyone can view available gear" ON gear_rentals FOR SELECT USING (availability = true);
CREATE POLICY "Owners can manage own gear" ON gear_rentals FOR ALL USING (auth.uid() = owner_id);

-- Chat rooms RLS policies
CREATE POLICY "Users can view chat rooms they participate in" ON chat_rooms FOR SELECT USING (auth.uid() = ANY(participants));
CREATE POLICY "Users can create chat rooms" ON chat_rooms FOR INSERT WITH CHECK (auth.uid() = ANY(participants));

-- Messages RLS policies
CREATE POLICY "Users can view messages in their chat rooms" ON messages FOR SELECT USING (
  auth.uid() IN (
    SELECT unnest(participants) FROM chat_rooms WHERE id = chat_room_id
  )
);
CREATE POLICY "Users can insert messages in their chat rooms" ON messages FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT unnest(participants) FROM chat_rooms WHERE id = chat_room_id
  )
);

-- Emergencies RLS policies
CREATE POLICY "Users can view own emergencies" ON emergencies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own emergencies" ON emergencies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Emergency services can view active emergencies" ON emergencies FOR SELECT USING (status = 'active');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_destination ON itineraries(destination);
CREATE INDEX IF NOT EXISTS idx_gear_rentals_location ON gear_rentals(location);
CREATE INDEX IF NOT EXISTS idx_gear_rentals_type ON gear_rentals(gear_type);
CREATE INDEX IF NOT EXISTS idx_messages_chat_room_id ON messages(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_emergencies_user_id ON emergencies(user_id);
CREATE INDEX IF NOT EXISTS idx_emergencies_status ON emergencies(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON itineraries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gear_rentals_updated_at BEFORE UPDATE ON gear_rentals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
