import chalk from 'chalk';
import figlet from 'figlet';
import clear from 'clear';
import firebase from './lib/firebase';
import FirebaseWatcher from './lib/FirebaseWatcher';
import config from './config';

const initialDatabase = () => {
  config.databases.forEach(database => new FirebaseWatcher(database));
};

clear();
console.log(
  chalk.red(
    figlet.textSync('FireLeaves', { horizontalLayout: 'full' }),
  ),
);
console.log(chalk.yellow(`Connecting to firebase ${config.firebase.databaseUrl}`));
firebase.init(config.firebase.databaseUrl, config.firebase.serviceAccount);
console.log(chalk.bgGreen(`Connecting to MongoDB mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`));
initialDatabase();
