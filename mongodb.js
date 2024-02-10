const { MongoClient, ServerApiVersion } = require('mongodb')
/**
 * ================
 * HEALTH ENDPOINTS
 * ================
 */
//const uri = "YOUR_MONGODB_CONNECTION_STRING";
const uri = "mongodb+srv://expertstheweb:expertstheweb@cluster0.gvcd5pl.mongodb.net/sample_db?retryWrites=true&w=majority";

routes.post('/submit-form', async (req, res) => {
    const client = new MongoClient(uri)
    try {
        await client.connect();
        const database = client.db("sample_db");
        const collection = database.collection("users");
        
        // Destructure data from form
        const { email, mobileNo } = req.body;

        // Check if the email or mobile number already exists
        const existingUser = await collection.findOne({ $or: [{ email }, { mobileNo }] });

        if (existingUser) {
            res.status(400).send("Email or Mobile Number already exists!");
        } else {
            // Insert the data from the form
            await collection.insertOne(req.body);
            res.send("Data saved to MongoDB");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Error saving data");
    } finally {
        await client.close();
    }
});
