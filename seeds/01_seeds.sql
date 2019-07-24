-- ALTER TABLE users ALTER COLUMN password
-- SET DEFAULT '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u';

DELETE FROM users; 
DELETE FROM properties;
DELETE FROM reservations;
DELETE FROM property_reviews;

ALTER SEQUENCE users_id_seq RESTART WITH 1;

ALTER SEQUENCE properties_id_seq RESTART WITH 1;

ALTER SEQUENCE reservations_id_seq RESTART WITH 1;

ALTER SEQUENCE property_reviews_id_seq RESTART WITH 1;

INSERT INTO users (name, email)
VALUES ('Emily Clarke', 'emily@gmail.com'),('Ralph Junior', 'Ralph@hotmail.com'), 
('Frankie Martin', 'Frankie@mac.com');

INSERT INTO properties (owner_id, title, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, active)
VALUES (1, 'Little house', 500, 0,1,2, 'Canada', 'Rue Beaudry', 'Montreal', 'Quebec', true), 
(2, 'Cottage', 200, 0,1,1,'UK', 'Little Lane', 'Edinburgh', 'Scotland', true ), (3, 'The big house', 100, 2, 5, 5, 'Canada', 'Highway1', 'Toronto', 'Toronto', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id) 
VALUES ('2019-12-01', '2019-12-29', 1, 1), 
('2019-01-01', '2019-01-10', 1, 2), ('2018-10-20', '2018-11-12', 2, 3);

INSERT INTO property_reviews (guest_id, reservation_id, property_id, rating, message) 
VALUES(1,2,3,9,'Lovely!'), 
(1,1,1,6, 'Lovely patio'), (1,2,1,8, 'Lovely Kitchen');
