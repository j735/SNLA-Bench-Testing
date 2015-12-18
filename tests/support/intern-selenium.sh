#!/bin/sh

# Check if Selenium Server is already running and start it if not
printf 'Checking if Selenium server is running\n'
if $(curl --output /dev/null --silent --head --fail http://localhost:4444/wd/hub)
then
    # SERVER RUNNING
    printf 'Selenium server is already running\n'
else
    # SERVER NOT RUNNING
    printf 'Selenium server is not running yet, so load\n'

    # Start server
    osascript -e 'tell application "Terminal" to do script "cd '$PWD'; java -jar tests/support/selenium-server-standalone-2.45.0.jar; sleep 15"'
    printf 'Waiting for Selenium server to load\n'

    # Poll server
    until $(curl --output /dev/null --silent --head --fail http://localhost:4444/wd/hub); do
        printf '.' # print ticks
        sleep 1
    done
    printf 'Selenium server is loaded!\n'
fi

# Run tests
printf 'Running tests...\n'
./node_modules/.bin/intern-runner config=tests/intern
