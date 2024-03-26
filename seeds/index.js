if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocoding({accessToken: process.env.MAPBOX_TOKEN});

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => {
        console.log("Mongo connection open");
    })
    .catch((err) => {
        console.log("Mongo connection error", err);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 300; ++i) {
        const random1000 = Math.floor(Math.random() * 1000);
        const campPrice = Math.floor(Math.random() * 20) + 10;
        const locationString = `${cities[random1000].city}, ${cities[random1000].state}`;
        // const geoData = await geocoder.forwardGeocode({
        //     query: locationString,
        //     limit: 1
        // }).send();
        const camp = new Campground({
            location: locationString,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/do06plons/image/upload/v1710883023/YelpCamp/qhnir7vfjkpzqnawubbt.jpg',
                  filename: 'YelpCamp/qhnir7vfjkpzqnawubbt',
                },
                {
                  url: 'https://res.cloudinary.com/do06plons/image/upload/v1710883024/YelpCamp/ghifi6vhdjjgwyfy0bsj.jpg',
                  filename: 'YelpCamp/ghifi6vhdjjgwyfy0bsj',
                }
              ],            
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat consectetur obcaecati sed possimus eum voluptates, iure quam unde nisi repudiandae tempora quidem corrupti, dolore, expedita fugit qui laudantium sunt blanditiis!",
            price: campPrice,
            author: "65f5fc6fa5d5dcd05ba385a9"
        })
        await camp.save();
    }
}

seedDB()
    .then(() => {mongoose.connection.close();});