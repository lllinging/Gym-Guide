const Gym = require('../models/gyms');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    let gym = await Gym.findById(req.params.id)
    const currentReview = new Review(req.body.review);
    currentReview.author = req.user._id;
    gym.reviews.push(currentReview);
    await currentReview.save();
    await gym.save();
    //check if gym has rating atribute and if it does not, set it to 0 and then calculate the average rating
    gym = await Gym.findById(req.params.id).populate('reviews');
    gym.rating = gym.reviews.reduce((acc, review) => acc + review.rating, 0) / gym.reviews.length;
    await gym.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/gyms/${gym._id}`);

}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    //pull the review from the reviews array in the gym
    await Gym.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/gyms/${id}`);
}