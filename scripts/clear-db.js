import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function clearDatabase() {
    const uri = process.env.MONGODB_DIRECT_URI || process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME;

    if (!uri) {
        console.error('MONGODB_URI or MONGODB_DIRECT_URI is not defined in .env');
        process.exit(1);
    }

    console.log('Connecting to MongoDB to clear data...');

    try {
        await mongoose.connect(uri, dbName ? { dbName } : undefined);
        console.log('Connected.');

        const collections = [
            'issues',
            'users',
            'blockchaintransactions',
            'issueupdates',
            'issueupvotes',
            'resolutionevidences',
        ];

        for (const collectionName of collections) {
            try {
                const collection = mongoose.connection.collection(collectionName);
                const exists = await collection.countDocuments().catch(() => 0);

                if (exists > 0) {
                    await collection.drop();
                    console.log(`Dropped collection: ${collectionName}`);
                } else {
                    console.log(`Collection ${collectionName} is empty or doesn't exist.`);
                }
            } catch (err) {
                if (err.code === 26) {
                    console.log(`Collection ${collectionName} does not exist (ns not found).`);
                } else {
                    console.error(`Error clearing ${collectionName}:`, err.message);
                }
            }
        }

        console.log('Database cleared successfully.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Database cleanup failed:');
        console.error(error);
        process.exit(1);
    }
}

clearDatabase();
