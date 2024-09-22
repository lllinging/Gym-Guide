const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

//define a custom joi rule to sanitize the html that we are getting from the user
//joi is a library that allows us to define a schema for the data that we are expecting to get from the user
//extend the base joi with the extension which is used to sanitize the html that we are getting from the user
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.htmlSafe': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            //sanitizeHTML is a library that we can use to sanitize the html that we are getting from the user
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                }
                );
                if (clean !== value) return helpers.error('string.escapeHTML', { value });
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension); //extend the base joi with the extension

//not use app.use(): we do not want this middleware to run on every single request
//it is a middleware function, so the signature is (req, res, next)

// const gymSchema = (req, res, next) => {

    //purpose: prevent the user from submitting an empty form
  //why throw not next? because we are not in a middleware function, we are in a async callback function. we need to throw an error to the catchAsync function and then handle it in the catchAsync function and to app.use((err, req, res, next) => {})
  // the problem is that we can post the data with just title(because we just validate !req.body.gym) in postmon, we need to validate the data that we are getting from the user. With Joi, we can use joi to define a schema
  // if (!req.body.gym) throw new ExpressError('Invalid Gym Data', 400);

  //define a schema, not a mongoose schema, a joi schema this will validate the data before we attempt to save it to the database
  module.exports.gymSchema = Joi.object({
      gym: Joi.object({//gym is the key that we are looking for
          title: Joi.string().required().escapeHTML(),//
        //   category: Joi.string().required().escapeHTML(),
          category: Joi.string().escapeHTML(),
          price: Joi.number().required().min(0),
          //???????????constant err if not comment this sentence
        //   image: Joi.string().required(),
          features: Joi.string().required(),   
          location: Joi.string().required().escapeHTML(),
          description: Joi.string().required().escapeHTML()
      }).required(),
        deleteImages: Joi.array()//why need this???? because we are going to be sending an array of strings to the server, we need to validate that the data that we are getting is an array of strings and that each string is a valid url that we can use to delete the image from cloudinary.otherwise
  });

//purpose: prevent the user from submitting an empty form from the sever side. we have validate the form from the client side but we need to validate it from the server side as well eg: postman, ajax, etc which could bypass the client side validation and send a empty form
//want the object has a key of review and the value is an object that has a key of rating and body
module.exports.reviewSchema = Joi.object({ 
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()//.htmlsafe() is a custom joi method that we are going to create in the joi extension file to help us sanitize the html that we are getting from the user
    }).required()
})
    


  /*
  //{error} : because result.error.detail is an array. we need .turn it into a tring and join together.. we are destructuring the result object and getting the error property from it
  const {error} = gymSchema.validate(req.body);
  

  //if there is an error, we want to throw an error to
  //because we are in an async function, we need to throw an error to the catchAsync function and then handle it in the catchAsync function and to app.use((err, req, res, next) => {}) 

  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400);
  } else {
      next();//if there is no error, we want to move on to the next middleware,important part 
  }
 
}
*/
