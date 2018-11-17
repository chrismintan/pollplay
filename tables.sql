DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
	id SERIAL PRIMARY KEY,
	name varchar(250) NOT NULL,
	isAccessible bit NOT NULL DEFAULT '1',
	spotify_id INT NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS songs;
CREATE TABLE songs (
	id SERIAL PRIMARY KEY,
	title varchar(250) NOT NULL,
	artist varchar(250) NOT NULL,
  image varchar(255) DEFAULT NULL,
  spotify_id varchar(250) DEFAULT NULL
);

DROP TABLE IF EXISTS songs_rooms;
CREATE TABLE songs_rooms (
	id SERIAL PRIMARY KEY,
	track varchar(250) NOT NULL,
	artist varchar(250) NOT NULL,
	album_image varchar(250) NOT NULL,
	track_uri TEXT NOT NULL,
	room_code varchar(250) NOT NULL,
	upvote INT NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	spotify_id INT NOT NULL,
	spotify_display_name varchar(250) NOT NULL,
	access_token varchar(300) NOT NULL,
	refresh_token varchar(250) NOT NULL,
	token_expires_at varchar(250) NOT NULL,
	image_url varchar(250)
);

-- ALTER TABLE songs_rooms ADD CONSTRAINT songs_rooms_fk0 FOREIGN KEY (song_id) REFERENCES songs(id);

-- ALTER TABLE songs_rooms ADD CONSTRAINT songs_rooms_fk1 FOREIGN KEY (room_id) REFERENCES rooms(id);

-- ALTER TABLE rooms ADD CONSTRAINT rooms_fk0 FOREIGN KEY (user_id) REFERENCES users(id);
