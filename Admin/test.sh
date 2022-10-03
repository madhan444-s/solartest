TARGETSERVER=root@api.nocode3.dosystemsinc.com
Password=JayEesh@1k

mv clientServer.com ../../../../etc/nginx/sites-available/$1.dosystemsinc.com 2>&1 | tee -a test12345.txt
echo testnitttttttt$2
echo testttttttttt $1
echo oldname $4

mv clientServer1.com ../../../../etc/nginx/sites-enabled/$1.dosystemsinc.com 2>&1 | tee -a test12345.txt

PATH="/root/.nvm/versions/node/v16.14.2/bin:$PATH"

# install node modules
# /root/.nvm/versions/node/v16.14.2/bin/npm install
ln -s ~/clientModules/node_modules/ node_modules

sshpass -p ""$Password"" ssh $TARGETSERVER "cd /var/www/html/$1.dosystemsinc.com;chmod -R 777 run.sh;" 2>&1 | tee -a test1.txt
PATH="/root/.nvm/versions/node/v16.14.2/bin:$PATH"
if [ "$3" = "update" ]; then
    /root/.nvm/versions/node/v16.14.2/bin/pm2 delete $4App
fi
/root/.nvm/versions/node/v16.14.2/bin/pm2 start "./run.sh $2" --name $1App 2>&1 | tee -a test1234.txt
# sshpass -p ""$Password"" ssh $TARGETSERVER "cd /var/www/html/$1.dosystemsinc.com;pm2 start './run.sh $2' --name $1App" 2>&1 | tee -a test1.txt

# /root/.nvm/versions/node/v16.14.2/bin/pm2 start run.sh --name $1 2>&1 | tee -a test1234.txt

echo succssfully done
