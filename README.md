# Domo - extendable home automation

This repository demonstrates the usage of sequelize within an express application.
The implemented logic is a simple task tracking tool.

## Starting the app

```
npm install
npm start
```

This will start the application and create an sqlite database in your app dir.
Just open [http://localhost:3000](http://localhost:3000).

## The setup

In order to understand how this application has been built, you can find the
executed steps in the following snippet. You should be able to adjust those
steps according to your needs. Please note that the view and the routes aren't
described. You can find those files in the repo.

```bash

sudo apt-get update && sudo apt-get upgrade

git clone git://git.drogon.net/wiringPi
cd wiringPi
./build

wget -O lights.zip https://www.dropbox.com/s/nxdrkuk94w9fpqo/lights.zip?dl=1
unzip lights.zip
rm -r lights.zip

cd lights
g++ -o kaku kaku.cpp -I/usr/local/include -L/usr/local/lib -lwiringPi

sudo chown root /home/pi/wiringPi/lights/kaku
sudo chmod ug+sx /home/pi/wiringPi/lights/kaku

./kaku C 1 on
./kaku C 1 off

cd
sudo nano .bashrc
add - export PATH=$PATH:/home/pi/wiringPi/lights/

bash

wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb

node -v

mkdir apps
cd apps
git clone https://github.com/FunkeyFlo/domo.git
cd domo
npm install
node app.js

```

And finally you have to adjust the `config/config.json` to fit your environment.
Once thats done, your database configuration is ready!
