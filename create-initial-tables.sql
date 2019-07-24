CREATE TABLE properties (
  id SERIAL PRIMARY KEY NOT NULL, 
  owner_id TEXT REFERENCES owner(id), 
  title TEXT, 
  description TEXT, 
  thumbnail_photo_url , 
  cover_photo_url , 
  cost_per_night , 
  street TEXT, 
  parking_spaces INTEGER, 
  number_of_bedrooms INTEGER, 
  number_of_bathrooms INTEGER, 
  country TEXT, 
  street TEXT, 
  city TEXT, 
  province TEXT, 
  postcode TEXT, 
  active BOOLEAN
);