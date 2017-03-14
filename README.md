LogAnalyzer
===========

LogAnalyzer is a web application allowing a system administrator to analyze the logs of a cluster of servers, in real time.

This project is based on [Symfony2](https://symfony.com/) and [MongoDB](https://www.mongodb.com). It has been conceived to be used with [RSYSLOG](http://www.rsyslog.com/).

For any matter, you can reach me at [felix.veysseyre@gmail.com](mailto:felix.veysseyre@gmail.com).

1 - Clone this repository
-------------------------
```
git clone https://github.com/felixveysseyre/LogAnalyzer.git
```

2 - Install vendors with Composer
---------------------------------------
```
curl -s https://getcomposer.org/installer | php
composer.phar install
```

3 - Set your local server root to ./web/
---------------------------------------

4 - Set correct permissions to Symfony directories
---------------------------------------
```
HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
sudo setfacl -R -m u:"$HTTPDUSER":rwX -m u:`whoami`:rwX app/cache app/logs
sudo setfacl -dR -m u:"$HTTPDUSER":rwX -m u:`whoami`:rwX app/cache app/logs
```

See Symfony [documentation](http://symfony.com/doc/2.7/setup/file_permissions.html) for more information.

5 - Create MongoDB database
---------------------------------------
```
mongo
use LogAnalyzer
quit()
```

6 - Modify LogAnalyzer configuration file
---------------------------------------
Modify `./app/config/parameters.yml`.
If file is not created, you can copy it from `./app/config/parameters.yml.dist`.

7 - Initialize LogAnalyzer
---------------------------------------
```
./script/initializeProject.sh
```

8 - Create assets symbolic link
---------------------------------------
```
ln -s /FullPathToLogAnalyzerDirectory/src/LogAnalyzer/CoreBundle/Resources/public/ ./web/assets
```

9 - Create crontab for periodic tasks scripted
---------------------------------------
See scripts in ./scripts:
- `cleanLiveGraph.sh`: every day
- `cleanLog.sh`: every day
- `computeLiveGraph.sh`: see configuration ('projectConfiguration/manageProject') in the application
- `sendNotification.sh`: every 5 minutes

10 - Configure RSYSLOG to integrate data into MongoDB
---------------------------------------
The data expected format is the following:
```
{
    "_id": ObjectId("55b8c845a6712207a0ab9e0b"),
    "receptionTime": "2015-06-12 14:29:45",
    "reportedTime": "2015-06-12 14:29:45",
    "priority": "6",
    "facility": "23",
    "host": "hostName",
    "service": "serviceName",
    "message": "messsage",
    "syslogTag": "syslogTag"
}
```