#!/bin/bash
BTRADELOC=~/Documents/zoom/admin
BUILDLOC=prod
if [ "$1" = "test" ]; then
   echo "Uploading to test system.."
   #live server 1
   # PEMFILE=
   TARGETSERVER=root@zoom.admin.dosystemsinc.com
elif [ "$1" = "-h" ]; then
   echo "Usage : adminbuild.sh [test|live]"
   exit
else
   echo "Invalid argument"
   exit 1
fi

DATE=`date +%Y-%m-%d-%H-%M`

cd $BTRADELOC

echo "Building..." 
npm run build 

if [ -d "$BTRADELOC/build" ];
then
  cd $BTRADELOC/build
  echo "Creating tar.."
  tar -cvf ~/Downloads/zoomAdmin.tar.xz *
  echo "Copying tar to server.."
  if [ "$1" = "test" ]; then
    scp ~/Downloads/zoomAdmin.tar.xz $TARGETSERVER:~/
    echo "Extracting tar in server.."
    ssh $TARGETSERVER "cd /var/www/html/zoom.admin.dosystemsinc.com/public_html; sudo rm -rf *;sudo tar -xvf ~/zoomAdmin.tar.xz"  
    echo "Successfully uploaded to zoom.admin.dosystemsinc.com";
  fi
else
   echo "Build failed"
fi

