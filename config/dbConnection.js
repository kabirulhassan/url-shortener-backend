const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        const mongoUser = process.env.MONGO_USER;
        const mongoPassword = process.env.MONGO_PASSWORD;
        const mongoDB = process.env.MONGO_DB;
        const mongoCluster = process.env.MONGO_CLUSTER;
        const mongoURI = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoCluster}/${mongoDB}?retryWrites=true&w=majority`;

        const connect = await mongoose.connect(mongoURI)
        console.log(`MongoDB Connected: ${connect.connection.host} Database Name: ${connect.connection.name}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;