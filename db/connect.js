import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://arnobpandit2033:simple@ac-dkdp5my-shard-00-00.xg38c3c.mongodb.net:27017,ac-dkdp5my-shard-00-01.xg38c3c.mongodb.net:27017,ac-dkdp5my-shard-00-02.xg38c3c.mongodb.net:27017/Data?ssl=true&replicaSet=atlas-62qt3z-shard-0&authSource=admin&retryWrites=true&w=majority&appName=project")
        console.log("db connect sucessfully");
    } catch (error) {
        console.log("db connect failed !!");
    }
}
