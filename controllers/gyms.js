const Gym = require("../models/gyms");
//mapbox-sdk is a Node.js client library for Mapbox web services APIs. It is used to geocode and reverse geocode location data. The library is built on top of the Mapbox HTTP API
//geocoding is the process of converting addresses (like "1600 Amphitheatre Parkway, Mountain View, CA") into geographic coordinates (like latitude 37.423021 and longitude -122.083739), which you can use to place markers on a map, or position the map
//node.js client library is a library that is used to interact with the Mapbox web services APIs in a Node.js environment and it is used to geocode and reverse geocode location data in a Node.js environment and it is built on top of the Mapbox HTTP API 
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;//we need to get the mapbox token from the environment variables
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); //we need to pass the mapbox token to the geocoding service to authenticate the request to the mapbox API. mbxGeocoding is a function that is used to create a new geocoding service. we need to pass the mapbox token to the geocoding service to authenticate the request to the mapbox API. geoCoder is a geocoding service that is used to interact with the Mapbox geocoding API. geocoding is the process of converting addresses into geographic coordinates, which you can use to place markers on a map, or position the map              
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res, next) => {

    try {
        let { page = 1, limit = 12, search, sort, rating, price, category } = req.query;
        const filter = {};

        category && (filter.category = { $in: category });
        price && (price === 'Free' ? filter.price = 0 : filter.price = { $gt: 0 });
        rating && (filter.rating = { $gte: Number(rating) });
        search && (filter.$text = { $search: search });
        req.query.sort ? (sort = req.query.sort.split(',')) : (sort = ['rating', 'desc']);

        // deal with the sort
        let sortBy = {};
        if (sort) {
            let sortOptions = sort;
            sortBy[sortOptions[0]] = sortOptions[1] === 'desc' ? -1 : 1;
        }

        const gyms = await Gym.find(filter)
            .skip((page * limit)-limit)
            .limit(limit)
            .sort(sortBy)
            .exec();

        const total = await Gym.countDocuments(filter).exec();

        const response = {
            total,
            current: page,
            pages: Math.ceil(total / limit),
            limit,
            gyms,
            query: req.query,
        };

        res.render('gyms/index', response);

    } catch (e) {
        console.log("error from controller gyms:", e);
    }

};

module.exports.renderNewForm = (req, res) => {
    res.render("gyms/new");
}

module.exports.createGym = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.gym.location,
        limit: 1
    }).send();
    //save to the gym model
    const user = req.user;
    const gym = new Gym(req.body.gym);
    gym.geometry = geoData.body.features[0].geometry;
    gym.images = req.files.map(f => ({ url: f.path, filename: f.filename }));    
    gym.author = user._id;
    await gym.save();
    //save the post to the user model
    user.posts.push(gym._id); 
    await user.save(); 

    req.flash('success', 'Successfully made a new gym!');
    res.redirect(`/gyms/${gym._id}`);
}

module.exports.showGym = async (req, res) => {
    const gym = await Gym.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!gym) {
        req.flash('error', 'Cannot find that gym!');
        return res.redirect('/gyms');
    }
    gym.popularity += 1;
    await gym.save();
    res.render("gyms/show", { gym });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    if (!gym) {
        req.flash('error', 'Cannot find that gym!');
        return res.redirect('/gyms');
    }


    res.render("gyms/edit", { gym });
}


module.exports.updateGym = async (req, res) => {
    const { id } = req.params;

    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));//req.files is an array of objects, each object has a path property, do not pass the entire req.files array to the images array, we need to map over the array and get the path property from each object
    gym.images.push(...imgs);//push all the images to the images array
    await gym.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await gym.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated gym!');
    res.redirect(`/gyms/${gym._id}`);
}

module.exports.deleteGym = async (req, res) => {
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    res.redirect('/gyms');
}


