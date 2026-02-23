// region imports
import app from "./app.js";
import {connectDB} from "./config/dbConfig.js"
import { env } from "./config/envConfig.js";


import { startConsumer} from "./kafka/consumer.js";
// endregion

// region constants
const port = env?.PORT;

// region start server
const startServer = async () => {
    try {
     connectDB();
     startConsumer();
     app.listen(port,()=>{
        console.log(`Server is listening on the port ${port}`)
     })
    } catch (err) {
        console.log("error when start server");
        process.exit(1);
    }
}
// endregion

// invoke startServer
startServer();
// endregion