drop table cebu;

begin;
create table cebu (
TIME date, 
id numeric,
lon numeric,
lat numeric,
a varchar,
b numeric,
c numeric
);
set maintenance_work_mem = '1024MB';
ALTER TABLE cebu SET (autovacuum_enabled = false);
copy cebu from '/home/brunosan/wb-data/Holly/grab/cebu-201501.csv' delimiters ',' csv freeze;
commit;
analyze;


CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;

ALTER TABLE cebu ADD COLUMN the_geom geometry; 

UPDATE cebu 
SET the_geom = ST_GeomFromText('POINT(' || lon || ' ' || lat || ')',4326); 

CREATE INDEX cebu_gindex  ON cebu USING GIST (the_geom);
