CREATE TYPE web_vitals_type AS ENUM (
    'FCP',
    'TTFB',
    'FID',
    'LCP'
);

CREATE TABLE analytics_web_vitals (
    id SERIAL PRIMARY KEY,
    type web_vitals_type NOT NULL,
    value NUMERIC NOT NULL,
    delta NUMERIC NOT NULL,
    navigationType TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics_links (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    external BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);