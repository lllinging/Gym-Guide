# Gym Guide 🏋️‍♂️

![Gym Guide Homepage](./screenshots/home.png)

## Introduction
A full-stack dynamic website that serves as a Gym Guide, allowing users to browse gym information, leave comments, rate their experiences, and manage personal accounts. The project includes features like search, filtering, sorting, and pagination for enhanced user experience. The application was built using Node.js, Express.js, MongoDB, and EJS, and deployed on Render.
[Visit the deployed app on Render](https://gym-guide-ynyl.onrender.com)

## Features
**Gym Information**
![Gym Guide view, Edit and delete gym](./screenshots/view-edit-delete-gym.png)

**Search, Filter, Sort, Pagination**
Find gyms based on specific criteria with ease.
![Gym Guide View all yyms](./screenshots/all-gyms.png)

**User Management**
Sign up and log in to leave reviews, rate gyms, like or unlike posts, and view your posts and favorites.
* Log in
![Gym Guide Login](./screenshots/login.png)
* Register
![Gym Guide Register](./screenshots/register.png)
* Manage user
![Gym Guide User management](./screenshots/user-management.png)
* View my profile
![Gym Guide View myprofile](./screenshots/myprofile.png)
* View my posts
![Gym Guide View myposts](./screenshots/myposts.png)
* View my favorites
![Gym Guide view myfavorites](./screenshots/myfavorites.png)

**Map Integration**
Displays gyms on a clustered map using MapBox based on geocoded locations.
![Gym Guide view, Edit and delete gym](./screenshots/view-edit-delete-gym.png)

**Image Upload**
Users can upload gym images with support from Cloudinary for storage.



## Tech Stack
**Backend:** Node.js, Express.js
**Frontend:** EJS (Embedded JavaScript), HTML, CSS, JavaScript
**Database:** MongoDB
**Image Hosting:** Cloudinary
**Maps:** MapBox API
**Deployment:** Render (https://gym-guide-ynyl.onrender.com)

## Installation
1. Clone the repository
2. Install dependencies: npm install
3. Set up environment variables:
Create a .env file in the root directory and add the following:
```
    DATABASE_URL=<your-mongodb-url>
    CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
    CLOUDINARY_API_KEY=<your-cloudinary-api-key>
    CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
    MAPBOX_API_KEY=<your-mapbox-api-key>
```
4. Run the app: `npm start`

## Usage:
Home Page: View a list of gyms with the ability to search, filter, sort, and paginate.
Gym Detail Page: View detailed information about each gym, including reviews and ratings.
User Accounts: Sign up and log in to leave reviews, rate gyms, and manage your personal account.

