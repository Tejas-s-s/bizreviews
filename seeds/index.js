
const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const {places,descriptors} = require('./seedhelpers');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('database connected');
}
main().catch(err => console.log(err));

const sample = (array) => array[Math.floor(Math.random()*array.length)];


const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:'66a11afe1f52d876c23336c3',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)}, ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea ad laboriosam enim recusandae dicta consectetur quidem eveniet, velit, vel minima aperiam animi ratione deserunt quos dignissimos nam minus dolor mollitia?",
            price
        })
        await camp.save();
    }
    
}

seedDB().then( ()=>{
    mongoose.connection.close();
})