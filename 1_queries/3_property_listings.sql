SELECT properties.id, owner_id, title, cost_per_night,parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, provence, post_code, ROUND(avg(property_reviews.rating),0) as average_rating
FROM properties
JOIN property_reviews
ON properties.id = property_reviews.property_id
WHERE city LIKE '%ancouv%'
GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY properties.cost_per_night
LIMIT 10;