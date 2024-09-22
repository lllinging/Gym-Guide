const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const AvatarSchema = new Schema({
    url: String,
    filename: String,

});

AvatarSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/h_100,w_200');
});

const UserSchema = new Schema({
    avatar: [
        AvatarSchema
    ],
    email: {
        type: String,
        required: true,
        unique: true
    },
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Gym'
        }
    ],
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Gym'
        }
    ],
    description: String,

});

//UserSchema.plugin is a way to add a plugin to a schema, passportLocalMongoose is a plugin that will add a username, hash and salt field to store the username, the hashed password and the salt value
//this wll add on to the schema, the username and password fields
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);