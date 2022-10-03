mv testclient.com ../../../../etc/nginx/sites-available/$1.dosystemsinc.com 2>&1 | tee -a test12345.txt
echo testnitttttttt
mv testclient1.com ../../../../etc/nginx/sites-enabled/$1.dosystemsinc.com 2>&1 | tee -a test12345.txt

PATH="/root/.nvm/versions/node/v16.14.2/bin:$PATH"

# install node modules
/root/.nvm/versions/node/v16.14.2/bin/npm install

echo succssfully done
