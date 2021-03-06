CREATE TABLE location_comments (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    text TEXT NOT NULL, 
    date_commented TIMESTAMPTZ DEFAULT now() NOT NULL, 
    location_id INTEGER REFERENCES results(id) ON DELETE CASCADE NOT NULL, 
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
);