/* eslint class-methods-use-this: "off" */

import chalk from 'chalk';
import firebase from './firebase';
import config from './../config';
import Mongo from './Mongo';


const initialData = Symbol('initialData');
const getName = Symbol('getName');
const docParse = Symbol('docParse');
class FirebaseWatcher {
  constructor(database) {
    this.database = database;
    console.log(chalk.green(`starting firebaseWatcher on [${database.path}]`));
    this[initialData]();
  }

  // private function
  [initialData]() {
    console.log(chalk.blue(`fetching on ref ${this.database.path}`));
    this.ref = firebase.ref(this.database.path);
    this.addWatcher = this.ref.on('child_added', (data) => {
      console.log(chalk.cyan(`added ${this[getName](this.database, data.key)}`));
      const doc = this[docParse](data);
      const mongo = new Mongo(config.mongodb);
      mongo.connect(() => {
        mongo.insert(doc, this.database.collection);
      });
    });
    this.changedWatcher = this.ref.on('child_changed', (data) => {
      console.log(chalk.magenta(`updated ${this[getName](this.database, data.key)}`));
      const doc = this[docParse](data);
      const mongo = new Mongo(config.mongodb);
      mongo.connect(() => {
        mongo.update(doc, this.database.collection);
      });
    });
    this.removedWatcher = this.ref.on('child_removed', (data) => {
      console.log(chalk.red(`removed ${this[getName](this.database, data.key)}`));
      const doc = this[docParse](data);
      const mongo = new Mongo(config.mongodb);
      mongo.connect(() => {
        mongo.remove(doc, this.database.collection);
      });
    });
  }
  [getName](database, key) {
    return `${database.path}/${key}`;
  }
  [docParse](data) {
    let doc = data.val();
    if (this.database.parser !== undefined && typeof this.database.parser === 'function') {
      doc = this.database.parser(doc);
    }
    doc.fbKey = data.key;
    doc.fireTime = new Date();
    return doc;
  }


}


export default FirebaseWatcher;
