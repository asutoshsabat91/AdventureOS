-- Support System Tables for AdventureOS
-- This migration adds tables for the autonomous support agent system

-- Support sessions to track conversations
CREATE TABLE IF NOT EXISTS support_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    state JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'escalated')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    intent VARCHAR(50) NOT NULL DEFAULT 'general',
    last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Support interactions for analytics and logging
CREATE TABLE IF NOT EXISTS support_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL REFERENCES support_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT,
    intent VARCHAR(50) NOT NULL DEFAULT 'general',
    sentiment VARCHAR(20) NOT NULL DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative', 'urgent')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    escalated BOOLEAN NOT NULL DEFAULT FALSE,
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    context JSONB DEFAULT '{}',
    response_time_ms INTEGER,
    satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
    agent_actions JSONB DEFAULT '[]',
    external_apis_called JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Knowledge base for support agent
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    intent VARCHAR(50) NOT NULL,
    relevance_score DECIMAL(3,2) DEFAULT 0.00 CHECK (relevance_score >= 0 AND relevance_score <= 1),
    priority INTEGER DEFAULT 0,
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- FAQ entries for quick responses
CREATE TABLE IF NOT EXISTS support_faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    intent VARCHAR(50) NOT NULL,
    priority INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Scheduled follow-up actions
CREATE TABLE IF NOT EXISTS support_follow_ups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL REFERENCES support_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    parameters JSONB DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    result JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Support agent performance metrics
CREATE TABLE IF NOT EXISTS support_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    active_sessions INTEGER DEFAULT 0,
    resolved_sessions INTEGER DEFAULT 0,
    escalated_sessions INTEGER DEFAULT 0,
    average_response_time_ms INTEGER DEFAULT 0,
    average_satisfaction_score DECIMAL(3,2) DEFAULT 0.00,
    intent_distribution JSONB DEFAULT '{}',
    sentiment_distribution JSONB DEFAULT '{}',
    priority_distribution JSONB DEFAULT '{}',
    external_api_calls INTEGER DEFAULT 0,
    knowledge_base_hits INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(date)
);

-- Emergency support requests
CREATE TABLE IF NOT EXISTS emergency_support (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL REFERENCES support_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    emergency_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    location JSONB DEFAULT '{}',
    description TEXT,
    contacts_notified JSONB DEFAULT '[]',
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated')),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_support_sessions_user_id ON support_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_support_sessions_status ON support_sessions(status);
CREATE INDEX IF NOT EXISTS idx_support_sessions_priority ON support_sessions(priority);
CREATE INDEX IF NOT EXISTS idx_support_sessions_last_activity ON support_sessions(last_activity);
CREATE INDEX IF NOT EXISTS idx_support_sessions_intent ON support_sessions(intent);

CREATE INDEX IF NOT EXISTS idx_support_interactions_session_id ON support_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_support_interactions_user_id ON support_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_support_interactions_intent ON support_interactions(intent);
CREATE INDEX IF NOT EXISTS idx_support_interactions_sentiment ON support_interactions(sentiment);
CREATE INDEX IF NOT EXISTS idx_support_interactions_priority ON support_interactions(priority);
CREATE INDEX IF NOT EXISTS idx_support_interactions_created_at ON support_interactions(created_at);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_intent ON knowledge_base(intent);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_is_active ON knowledge_base(is_active);

CREATE INDEX IF NOT EXISTS idx_support_faqs_category ON support_faqs(category);
CREATE INDEX IF NOT EXISTS idx_support_faqs_intent ON support_faqs(intent);
CREATE INDEX IF NOT EXISTS idx_support_faqs_is_active ON support_faqs(is_active);

CREATE INDEX IF NOT EXISTS idx_support_follow_ups_session_id ON support_follow_ups(session_id);
CREATE INDEX IF NOT EXISTS idx_support_follow_ups_user_id ON support_follow_ups(user_id);
CREATE INDEX IF NOT EXISTS idx_support_follow_ups_scheduled_time ON support_follow_ups(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_support_follow_ups_status ON support_follow_ups(status);

CREATE INDEX IF NOT EXISTS idx_emergency_support_user_id ON emergency_support(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_support_status ON emergency_support(status);
CREATE INDEX IF NOT EXISTS idx_emergency_support_severity ON emergency_support(severity);
CREATE INDEX IF NOT EXISTS idx_emergency_support_created_at ON emergency_support(created_at);

-- Enable Row Level Security
ALTER TABLE support_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_support ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_sessions
CREATE POLICY "Users can view their own support sessions" ON support_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own support sessions" ON support_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own support sessions" ON support_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Support agents can view all sessions" ON support_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'support_agent')
        )
    );

-- RLS Policies for support_interactions
CREATE POLICY "Users can view their own support interactions" ON support_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own support interactions" ON support_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Support agents can view all interactions" ON support_interactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'support_agent')
        )
    );

-- RLS Policies for support_follow_ups
CREATE POLICY "Users can view their own follow-ups" ON support_follow_ups
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own follow-ups" ON support_follow_ups
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Support agents can view all follow-ups" ON support_follow_ups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'support_agent')
        )
    );

-- RLS Policies for emergency_support
CREATE POLICY "Users can view their own emergency requests" ON emergency_support
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emergency requests" ON emergency_support
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Support agents can view all emergency requests" ON emergency_support
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'support_agent')
        )
    );

-- Insert initial knowledge base entries
INSERT INTO knowledge_base (title, content, category, intent, relevance_score, priority) VALUES
('Getting Started with AdventureOS', 'AdventureOS is your AI-powered adventure travel companion. Start by creating your first itinerary using our intelligent planning system, then connect with fellow travelers in our community.', 'general', 'general', 0.9, 1),
('Emergency Procedures', 'In case of emergency during your adventure: 1) Contact local emergency services immediately, 2) Use our SOS feature to notify your emergency contacts, 3) Seek help from nearby accommodations or authorities, 4) Document the incident for insurance purposes.', 'emergency', 'emergency', 1.0, 1),
('Modifying Your Itinerary', 'You can modify your itinerary at any time from your dashboard. Go to My Itineraries, select the trip you want to change, and use the edit feature. Changes will be saved and synced across all your devices.', 'itinerary_help', 'itinerary_help', 0.85, 2),
('Booking and Cancellation Policy', 'Our booking policy allows cancellations up to 24 hours before your trip start time for a full refund. Within 24 hours, a 50% refund applies. Some activities may have different policies - check your specific booking details.', 'booking_support', 'booking_support', 0.9, 2),
('Best Adventure Destinations', 'Popular adventure destinations include: Manali (India) for skiing and trekking, Rishikesh for rafting and yoga, Leh for high-altitude adventures, Goa for water sports, and Kerala for backwater experiences.', 'travel_advice', 'travel_advice', 0.8, 3),
('Troubleshooting Common Issues', 'If you experience technical issues: 1) Clear your browser cache, 2) Check your internet connection, 3) Try using a different browser, 4) Ensure your app is updated to the latest version, 5) Contact support if issues persist.', 'technical_support', 'technical_support', 0.85, 3)
ON CONFLICT DO NOTHING;

-- Insert initial FAQ entries
INSERT INTO support_faqs (question, answer, category, intent, priority) VALUES
('How do I create a new itinerary?', 'To create a new itinerary, click the "Plan New Adventure" button on your dashboard, fill in your preferences, destination, dates, and let our AI generate a personalized plan for you.', 'itinerary_help', 'itinerary_help', 1),
('Can I change my travel dates after booking?', 'Yes, you can modify your travel dates up to 24 hours before departure. Go to your itinerary and use the reschedule feature. Additional charges may apply based on provider policies.', 'booking_support', 'booking_support', 2),
('How do I find travel buddies?', 'Visit the Community section and use our Travel Buddy Matcher. Set your preferences and our AI will find compatible travelers based on adventure interests, fitness level, and travel style.', 'general', 'general', 1),
('What if I need emergency help during my trip?', 'Use the SOS feature in our app to immediately notify your emergency contacts and our support team. We also provide local emergency contact information for all destinations.', 'emergency', 'emergency', 1),
('Is my data safe and private?', 'Yes, we use industry-standard encryption and security measures. Your personal information is never shared without your explicit consent, and all payments are processed securely.', 'technical_support', 'technical_support', 3)
ON CONFLICT DO NOTHING;

-- Create function to automatically update support metrics
CREATE OR REPLACE FUNCTION update_daily_support_metrics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO support_metrics (
        date,
        total_sessions,
        active_sessions,
        resolved_sessions,
        escalated_sessions,
        average_response_time_ms,
        intent_distribution,
        sentiment_distribution,
        priority_distribution
    )
    SELECT 
        CURRENT_DATE,
        COUNT(*)::INTEGER,
        COUNT(*) FILTER (WHERE status = 'active')::INTEGER,
        COUNT(*) FILTER (WHERE status = 'ended' AND NOT escalated)::INTEGER,
        COUNT(*) FILTER (WHERE escalated = TRUE)::INTEGER,
        COALESCE(AVG(response_time_ms), 0)::INTEGER,
        jsonb_object_agg(intent, intent_count)::jsonb,
        jsonb_object_agg(sentiment, sentiment_count)::jsonb,
        jsonb_object_agg(priority, priority_count)::jsonb
    FROM (
        SELECT 
            s.*,
            COALESCE(i.response_time_ms, 0) as response_time_ms,
            COUNT(*) OVER (PARTITION BY intent) as intent_count,
            COUNT(*) OVER (PARTITION BY sentiment) as sentiment_count,
            COUNT(*) OVER (PARTITION BY priority) as priority_count
        FROM support_sessions s
        LEFT JOIN LATERAL (
            SELECT response_time_ms, intent, sentiment, priority
            FROM support_interactions si
            WHERE si.session_id = s.session_id
            ORDER BY created_at DESC
            LIMIT 1
        ) i ON true
        WHERE DATE(s.started_at) = CURRENT_DATE
    ) daily_data
    ON CONFLICT (date) DO UPDATE SET
        total_sessions = EXCLUDED.total_sessions,
        active_sessions = EXCLUDED.active_sessions,
        resolved_sessions = EXCLUDED.resolved_sessions,
        escalated_sessions = EXCLUDED.escalated_sessions,
        average_response_time_ms = EXCLUDED.average_response_time_ms,
        intent_distribution = EXCLUDED.intent_distribution,
        sentiment_distribution = EXCLUDED.sentiment_distribution,
        priority_distribution = EXCLUDED.priority_distribution,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update metrics when sessions change
CREATE TRIGGER trigger_update_support_metrics
    AFTER INSERT OR UPDATE ON support_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_support_metrics();

-- Create function to clean up old sessions (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_support_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM support_sessions 
    WHERE started_at < NOW() - INTERVAL '90 days'
    AND status IN ('ended', 'resolved');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Also clean up old interactions
    DELETE FROM support_interactions 
    WHERE created_at < NOW() - INTERVAL '90 days'
    AND session_id NOT IN (SELECT session_id FROM support_sessions);
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers for all tables
CREATE TRIGGER update_support_sessions_updated_at BEFORE UPDATE ON support_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_faqs_updated_at BEFORE UPDATE ON support_faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_follow_ups_updated_at BEFORE UPDATE ON support_follow_ups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_support_updated_at BEFORE UPDATE ON emergency_support
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_metrics_updated_at BEFORE UPDATE ON support_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
