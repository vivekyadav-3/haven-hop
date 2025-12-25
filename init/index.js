const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/haven_hop";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const User = require("../models/user.js");

const initDB = async () => {
  await Listing.deleteMany({});
  
  const user = await User.findOne({});
  const ownerId = user ? user._id : null;
  
  if (!ownerId) {
      console.log("No user found. Please create a user first (signup) or run data init after signup.");
      return;
  }

  initData.data = initData.data.map((obj) => ({ 
      ...obj, 
      owner: ownerId,
      geometry: { type: 'Point', coordinates: [77.209, 28.6139] } 
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized with owner:", ownerId);
};

initDB();
