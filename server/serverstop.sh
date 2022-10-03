echo $1 111111111111111
echo $2 22222222222222222222
if [ "$2" = "start" ]; then
    echo uteeeeeeeeejjjjjj
    PATH="/root/.nvm/versions/node/v16.14.2/bin:$PATH"
    /root/.nvm/versions/node/v16.14.2/bin/pm2 start $1

elif [ "$2" = "stop" ]; then
    echo uteeeeeeeeejjjjjj1111111111111
    PATH="/root/.nvm/versions/node/v16.14.2/bin:$PATH"
    /root/.nvm/versions/node/v16.14.2/bin/pm2 stop $1

fi
