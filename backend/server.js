const app = require('./app')

const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1)
})


dotenv.config({ path: 'backend/config/config.env' });

connectDatabase();


const server = app.listen(process.env.PORT , () => {
    console.log(`server is running on port ${process.env.PORT}`);
})

// Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise Rejection');
    server.close(() => {
        process.exit(1)
    })
})