CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    brief TEXT NOT NULL,
    service_type TEXT NOT NULL,
    style_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'idle',
    current_task_id INTEGER REFERENCES tasks(id)
);

CREATE TABLE IF NOT EXISTS agent_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER REFERENCES tasks(id),
    agent_name TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outputs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER REFERENCES tasks(id),
    agent_name TEXT NOT NULL,
    content TEXT NOT NULL,
    output_type TEXT NOT NULL DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO agents (name, role, status) VALUES
    ('Brief Agent',    'Parses and summarizes client briefs',        'idle'),
    ('Concept Agent',  'Generates thumbnail concepts and ideas',     'idle'),
    ('Prompt Agent',   'Builds optimized image generation prompts',  'idle'),
    ('Design Agent',   'Produces design specs and layout guidance',  'idle'),
    ('QA Agent',       'Runs quality checks on all outputs',         'idle'),
    ('Delivery Agent', 'Packages and prepares final deliverables',   'idle');
