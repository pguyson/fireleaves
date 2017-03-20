/* eslint class-methods-use-this: "off" */

import chalk from 'chalk';
import kue from 'kue';
import firebase from './firebase';
import config from './../config';
import Mongo from './Mongo';

const ADDED_JOB = 'ADDED_JOB';
const CHANGED_JOB = 'CHANGED_JOB';
const REMOVED_JOB = 'REMOVED_JOB';
const JOB_ATTEMPTS = 5;


const initialData = Symbol('initialData');
const initialQueueProcess = Symbol('initialQueueProcess');
const getName = Symbol('getName');
const docParse = Symbol('docParse');
const queue = kue.createQueue();
class FirebaseWatcher {
  constructor(database) {
    this.database = database;
    console.log(chalk.green(`starting firebaseWatcher on [${database.path}]`));
    this[initialQueueProcess]();
    this[initialData]();
  }

  // private function
  [initialQueueProcess]() {
    queue.process(ADDED_JOB, (job, done) => {
      const mongo = new Mongo(config.mongodb);
      mongo.connect(() => {
        mongo.insert(job.data.document, job.data.collection);
        done();
      });
    });
    queue.process(CHANGED_JOB, (job, done) => {
      const mongo = new Mongo(config.mongodb);
      mongo.connect(() => {
        mongo.update(job.data.document, job.data.collection);
        done();
      });
    });
    queue.process(REMOVED_JOB, (job, done) => {
      const mongo = new Mongo(config.mongodb);
      mongo.connect(() => {
        mongo.remove(job.data.document, job.data.collection);
        done();
      });
    });
  }

  [initialData]() {
    console.log(chalk.blue(`fetching on ref ${this.database.path}`));
    this.ref = firebase.ref(this.database.path);
    this.addWatcher = this.ref.on('child_added', (data) => {
      console.log(chalk.cyan(`added ${this[getName](this.database, data.key)}`));
      const doc = this[docParse](data);
      const job = queue.create(ADDED_JOB, { document: doc, collection: this.database.collection })
        .attempts(JOB_ATTEMPTS).save((err) => {
          if (err) {
            console.log(chalk.red(`[job] create error ${err}`));
          }
          console.log(chalk.cyan(`[job] added ${job.id} ${this[getName](this.database, data.key)}`));
        });
    });
    this.changedWatcher = this.ref.on('child_changed', (data) => {
      console.log(chalk.magenta(`updated ${this[getName](this.database, data.key)}`));
      const doc = this[docParse](data);
      const job = queue.create(CHANGED_JOB, { document: doc, collection: this.database.collection })
        .attempts(JOB_ATTEMPTS).save((err) => {
          if (err) {
            console.log(chalk.red(`[job] create error ${err}`));
          }
          console.log(chalk.cyan(`[job] updated ${job.id} ${this[getName](this.database, data.key)}`));
        });
    });
    this.removedWatcher = this.ref.on('child_removed', (data) => {
      console.log(chalk.red(`removed ${this[getName](this.database, data.key)}`));
      const doc = this[docParse](data);
      const job = queue.create(REMOVED_JOB, { document: doc, collection: this.database.collection })
        .attempts(JOB_ATTEMPTS).save((err) => {
          if (err) {
            console.log(chalk.red(`[job] create error ${err}`));
          }
          console.log(chalk.cyan(`[job] removed ${job.id} ${this[getName](this.database, data.key)}`));
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
