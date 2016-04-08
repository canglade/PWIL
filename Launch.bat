cd server_launcher

start cmd /k mongodblaunch.bat
start cmd /k nodelaunch.bat
start cmd /k gruntlaunch.bat

cd ../utils
consoleready.bat
