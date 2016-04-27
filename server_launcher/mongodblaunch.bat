set MONGO_PATH="C:\MongoDB\Server\3.2\data"

echo *** LAUNCHING MONGO DB ***

mongod --dbpath %MONGO_PATH%&pause

