const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db('yourDatabase');
        const collection = db.collection('yourCollection');
        const data = await collection.find({}).toArray();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching data', error }),
        };
    } finally {
        await client.close();
    }
};
