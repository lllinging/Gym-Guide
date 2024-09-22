const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

//extract image from gym schema is a method to add a virtual property to the image schema that will allow us to display a thumbnail of the image
const ImageSchema = new Schema({
    url: String,
    filename: String,

});



//virtual property: a property that is not stored in the database but is calculated on the fly
//this is a virtual property that will allow us to display a thumbnail of the image
//this is a getter that will run every time we access the thumbnail property
//this is a function that will return the url of the image but it will replace the /upload with /upload/w_200
//this will allow us to display a thumbnail of the image

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/h_100,w_200');
});

//mogoose do not support virtual properties by default when converting to res.json(), we need to add a toJSON option to the schema to tell mongoose to include any virtual properties when the document is converted to JSON              
const opts = { toJSON: { virtuals: true } };

const GymSchema = new Schema({
    title: String,
    category: String,
    popularity: {
        type: Number,
        default: 0
    },

    images: [
        ImageSchema
    ],

    geometry: {
        type: {
            type: String,//this is the type of the geometry that we are using. we are using a point geometry
            enum: ['Point'],//enum: ['Point'] means that the type of the geometry must be a point
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    price: Number,
    features: [String],
    description: String,
    location: String,

    createTime: {
        type: Date,
        default: Date.now
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],

    rating: {
        type: Number,
        default: 0
    }

}, opts);

//creat union index. 'text' is a text index that will allow us to search the gym by the title, location, and features
GymSchema.index({ features: 'text', title: 'text', location: 'text' });

//add description in cluster map: this is a virtual property that will allow us to display a thumbnail of the image
GymSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/gyms/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

//purpose: when we delete a gym, we want to delete all of the reviews associated with that gym
//this method will run after we run findOneAndDelete and it will take the document that was deleted
//this method will be hit by the middleware that we are using in the gym routes. findbyIdAndDelete() is a mongoose method that will find a gym by its id and delete it
//findbyIDAndDelete() vs findOneAndDelete(): findbyIDAndDelete() is a mongoose method that will find a gym by its id and delete it, findOneAndDelete() is a mongoose method that will find a gym by a query and delete it
//Review.delemeMany(): Review is the model that we are deleting from, deleteMany() is a mongoose method that will delete all of the reviews that have an id that is in the reviews array of the gym that was deleted
//query middleware: if we use remove or delete, we could not triger this middleware, we need to use findOneAndDelete() or findByIdAndDelete() to trigger this middleware
GymSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            //_id is the id of the review and we are looking for reviews that have an id that is in the reviews array of the gym that was deleted
            _id: {
                $in: doc.reviews
            }
        })

    }
})

module.exports = mongoose.model('Gym', GymSchema);