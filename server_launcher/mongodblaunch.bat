set MONGO_PATH="YOUR_MONGODB_DB_PATH"

echo *** LAUNCHING MONGO DB ***

mongod --dbpath %MONGO_PATH%&pause