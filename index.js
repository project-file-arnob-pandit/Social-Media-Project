import { server } from "./app.js"; // Assuming app.js exports 'server'
import { connectDB } from "./db/connect.js";

const port = 8000;

connectDB().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Database connection error:', err);
});
