-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id serial PRIMARY KEY,
    username character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    role character varying(255) COLLATE pg_catalog."default" DEFAULT 'visitor'::character varying,
    CONSTRAINT constraint_name UNIQUE (email),
    CONSTRAINT username_unique UNIQUE (username)
);
	
CREATE TABLE IF NOT EXISTS public.exhibitions
(
    id serial PRIMARY KEY,
    name character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    image bytea,
    address character varying(255) COLLATE pg_catalog."default",
    datefrom date,
    dateto date,
    authorid integer NOT NULL,
	CONSTRAINT fk_users FOREIGN KEY (authorid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.pictures
(
    id serial PRIMARY KEY,
    name character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    image character varying(255) COLLATE pg_catalog."default",
    authorid integer NOT NULL,
    exhibitionid integer NOT NULL,
    height real,
    CONSTRAINT fk_exhibition FOREIGN KEY (exhibitionid)
        REFERENCES public.exhibitions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_users FOREIGN KEY (authorid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.videos
(
    id serial NOT NULL PRIMARY KEY,
	pictureId serial NOT NULL,
    path character varying(255),
    height real,
    CONSTRAINT fk_pictures FOREIGN KEY (pictureId)
        REFERENCES public.pictures (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.surveys
(
    id serial NOT NULL PRIMARY KEY,
	pictureId serial NOT NULL,
	exhibitionId serial NOT NULL,
    data text NOT NULL, 
	CONSTRAINT fk_exhibitions FOREIGN KEY (exhibitionId)
        REFERENCES public.exhibitions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_pictures FOREIGN KEY (pictureId)
        REFERENCES public.pictures (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)