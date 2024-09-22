// Purpose: Custom error class to handle errors in the application
//benefits: we can pass a message and a status code to the error
class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;