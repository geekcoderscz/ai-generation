DROP TABLE IF EXISTS images;
CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY, s3Id TEXT, query TEXT, createdAt TEXT);
