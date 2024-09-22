// Description: This file is used to catch errors in async functions and pass them to the
// error handling middleware. It is a higher order function that takes a function as an argument
// and returns a new function that catches any errors that occur in the original function and passes them to the next middleware.
//differece with ExpressError class: ExpressError class is used to create custom errors with a message and a status code, while catchAsync is used to catch errors in async functions and pass them to the error handling middleware.
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}