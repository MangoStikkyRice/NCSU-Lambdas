const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // Your MongoDB connection string
const client = new MongoClient(uri);

exports.handler = async () => {
    try {
        await client.connect();
        const database = client.db('lambdas');
        const collection = database.collection('brothers');
        
        // Fetch all documents from the "brothers" collection
        const brothers = await collection.find().toArray();
        
        return {
            statusCode: 200,
            body: JSON.stringify(brothers), // Return the fetched data as JSON
        };
    } catch (error) {
        console.error('Error fetching brothers data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch brothers data' }),
        };
    } finally {
        await client.close();
    }
};
