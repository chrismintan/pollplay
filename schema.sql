DROP DATABASE IF EXISTS pollplay;

CREATE DATABASE pollplay;

USE pollplay;


DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(250) NOT NULL,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `songs`;
CREATE TABLE `songs` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`title` varchar(250) NOT NULL,
	`artist` varchar(250) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `songs_rooms`;
CREATE TABLE `songs_rooms` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`song_id` INT NOT NULL,
	`room_id` INT NOT NULL,
	`upvote` INT NOT NULL DEFAULT 0,
	`downvote` INT NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
);

ALTER TABLE `songs_rooms` ADD CONSTRAINT `songs_rooms_fk0` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`);

ALTER TABLE `songs_rooms` ADD CONSTRAINT `songs_rooms_fk1` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`);


insert into songs (title, artist) values ('Hello', 'Adele');
insert into songs (title, artist) values ('Beat It', 'Michael Jackson');
insert into songs (title, artist) values ('Chicken Fried', 'Random Country Guy');
insert into songs (title, artist) values ('Blinded By The Light', 'Manford Man');

insert into rooms (name) values ('TestRoom');
insert into rooms (name) values ('HRATX36 Graduation');
insert into rooms (name) values ('Bathroom Party');
insert into rooms (name) values ('Living Room');

insert into songs_rooms (song_id, room_id) values (1,2);
insert into songs_rooms (song_id, room_id) values (1,3);
insert into songs_rooms (song_id, room_id) values (3,3);
insert into songs_rooms (song_id, room_id) values (3,3);
insert into songs_rooms (song_id, room_id) values (3,3);