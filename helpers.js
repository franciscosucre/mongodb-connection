const mongodb = require("mongodb");

/**
 * Generates an Mongodb ObjectId, this is used so the
 * user does not have to require mongodb package for
 * creating ObjectId
 *
 * @param {string|number|ObjectID} [input]
 */
const ObjectId = input => {
  if (!input) return new mongodb.ObjectId();
  if (input instanceof mongodb.ObjectId) return input;
  if (input instanceof mongodb.ObjectID) return input;
  return new mongodb.ObjectId(input);
};

module.exports = {
  ObjectId
};
