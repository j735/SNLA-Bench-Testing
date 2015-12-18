#!/bin/sh
# Based on code at https://gist.github.com/kronda/3883026

JAR_FILE="tests/support/selenium-server-standalone-2.45.0.jar"
LOG_FILE="tests/reports/selenium.log"
PID_FILE="tests/support/selenium.pid"
CHROME_DRIVER="tests/support/chromedriver"

ARG=$1

if [ ${#ARG} -lt 1 ]
    then echo "USAGE: $0 {start|stop}"                                    
	exit 1
fi

if [ $ARG = stop ] 
    then SELPID=`cat $PID_FILE` && kill $SELPID 
	echo "Stopping Selenium server!"
	exit 0
fi

if [ $ARG = start ]
    then java -jar $JAR_FILE -Dwebdriver.chrome.driver=$CHROME_DRIVER > $LOG_FILE &
	echo "Starting Selenium server!"
	echo $! > $PID_FILE
	exit 0
fi
