//if we want to seed our database, we can run this file and run node seeds/index.js in the terminal
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Gym = require('../models/gyms');
const express = require('express');
const path = require('path');

const app = express();

mongoose.connect('mongodb://localhost:27017/gym-guide');//other parameters can be added to the connect method

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Gym.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random100 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 20 + 10);
        const category = `${sample(places)}`;
        const index1 = 1 + Math.floor(Math.random() * 23);
        const index2 = 1 + Math.floor(Math.random() * 23);

        const gym = new Gym({
            author: "664bfcb6b93fb22d08cbd3ee",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            category,
            images: [
                {
                    url:  `/pictures/${category}/${index1}.jpg`,
                    filename: 'GymGuide/nhhmqd8zlzprbqejytwp'
                },
                {
                    url: `/pictures/${category}/${index2}.jpg`,
                    filename:  'GymGuide/yrcfsnpaumhsis9atxsh'
                }
            ],
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random100].longitude,
                    cities[random100].latitude
                ]
            },

            description: `${sample(descriptors)}`,
            features: `${sample(descriptors)}`,
            createTime: Date.now()
        });
        await gym.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});









