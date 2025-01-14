const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  password: 'password',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */


const getUserWithEmail = function(email) {
  console.log('getting the user');
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1;
  `, [email])
    .then(res => {
      const [user] = res.rows;

      if (user) {
        return user;
      } else
        return null;
    })
    .catch(error => {
      return error;
    });
};
exports.getUserWithEmail = getUserWithEmail;


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1;
  `, [id])
    .then(res => {
      const [user] = res.rows;

      if (user) {
        return user;
      } else
        return null;
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  let userInfo = [user.name, user.email, user.password];
  console.log(userInfo);
  return pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, userInfo)
    .then(res => res.rows);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guestId, limit = 10) {
  let user = guestId;
  return pool.query(`
    SELECT reservations.*, properties.*, avg(property_reviews.rating)
    FROM reservations
    JOIN properties 
    ON reservations.property_id = properties.id
    JOIN property_reviews
    ON properties.id = property_reviews.property_id
    WHERE reservations.end_date < now()::date AND reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
  `, [user])
    .then(res => res.rows);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  
  let queryString = `SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews
  ON properties.id = property_reviews.property_id`;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` WHERE city LIKE $${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    let minPrice = Number(options.minimum_price_per_night);
    queryParams.push(minPrice);
    if (queryParams.length > 0) {
      queryString += ` AND cost_per_night > $${queryParams.length}`;
    } else {
      queryString += ` WHERE cost_per_night > $${queryParams.length}`;
    }
  }

  if (options.maximum_price_per_night) {
    let maxPrice = Number(options.maximum_price_per_night);
    queryParams.push(maxPrice);
    if (queryParams.length > 0) {
      queryString += ` AND cost_per_night < $${queryParams.length}`;
    } else {
      queryString += ` WHERE cost_per_night < $${queryParams.length}`;
    }
  }

  queryString += ` GROUP BY properties.id`;

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += ` HAVING avg(property_reviews.rating) > $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += ` ORDER BY properties.cost_per_night
  LIMIT $${queryParams.length};`
  ;

  return pool.query(queryString, queryParams)
    .then(res => res.rows);
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  console.log("property", property);
  let newProperty = [property.owner_id,
    property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.provence, property.city, property.country, property.street, property.post_code];
  console.log("newProperty", newProperty);

  return pool.query(`INSERT INTO properties (owner_id,
    title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, provence, city, country, street, post_code) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`, newProperty)
    .then(res => res.rows);
};
exports.addProperty = addProperty;
