# fireleaves

![Screenshot](https://github.com/nukung/fireleaves/raw/master/screenshot.png)

Firebase Real-time database to mongoDB adapter, inspired by [Flashlight](https://github.com/firebase/flashlight)

**fireleaves** is useful for backend application, it's use mongoDB featureds for search, summary report and other things that you want to do on backend and firebase is difficult to do.

# Features

### 0.0.2
 - supported queue for large data, using [kue](https://github.com/Automattic/kue) and redis

### 0.0.1
- monitor firebase realtime database and index to mongodb
- parser data before index to mongodb

# Getting Started
- Install and run [MongoDB](https://www.mongodb.com/)
- Install and run [Redis](https://redis.io/)
- `git clone https://github.com/pguyson/fireleaves --depth=1`
- `npm -g install gulp`
- `npm install`
- get firebase service key [Guide](https://firebase.google.com/docs/admin/setup) and save to key
- copy src/config.js.example to src/config.js and edit to match your server configuration
- `npm run dev`

# Production
- copy bin to production server
- `npm run prod-install`
- `npm start`
- for pm2 `pm2 start "/usr/bin/npm" --name "fireleaves" -- start`

# Contributing
- Found a bug? or Features request, Report it on Github [Issues](https://github.com/pguyson/fireleaves/issues) and include a error message and config sample.
- Anything else? feel free to [mail me](mailto:me@panu.rocks).


# License
fireleaves is licensed under [MIT](https://github.com/pguyson/fireleaves/blob/master/LICENSE).
