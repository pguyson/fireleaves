/* eslint no-underscore-dangle: "off" */
/* eslint class-methods-use-thos: "off" */

import mongodb from 'mongodb';
import chalk from 'chalk';

const MongoClient = mongodb.MongoClient;

const connect = Symbol('connect');
const close = Symbol('close');

class Mongo {
  constructor(config) {
    this.config = config;
  }
  async connect(callback) {
    let connectionUrl = '';
    if (this.config.auth !== undefined) {
      connectionUrl = `mongodb://${this.config.auth.user}:${this.config.auth.password}@${this.config.host}:${this.config.port}/${this.config.database}`;
    } else {
      connectionUrl = `mongodb://${this.config.host}:${this.config.port}/${this.config.database}`;
    }
    try {
      this.db = await MongoClient.connect(connectionUrl);
      // console.log(chalk.bgGreen(`connected to ${connectionUrl}`));
      callback();
    } catch (error) {
      console.log(chalk.red(`[mongodb] ${error}`));
    }
  }
  async insert(doc, collectionName) {
    const collection = this.db.collection(collectionName);
    const foundDoc = await collection.findOne({ fbKey: doc.fbKey });
    if (foundDoc !== null) {
      const result = await collection.findAndModify({ fbKey: doc.fbKey }, [], { $set: doc }, {});
      console.log(chalk.magenta(`[mongodb] document was existed, updated on ${collectionName} document id: ${result.value._id}`));
    } else {
      const result = await collection.insertOne(doc);
      console.log(chalk.cyan(`[mongodb] inserted on ${collectionName} document id: ${result.insertedId}`));
    }
    this[close]();
  }
  async update(doc, collectionName) {
    const collection = this.db.collection(collectionName);
    const result = await collection.findAndModify({ fbKey: doc.fbKey }, [], { $set: doc }, {});
    console.log(chalk.magenta(`[mongodb] updated on ${collectionName} document id: ${result.value._id}`));
    this[close]();
  }
  async remove(doc, collectionName) {
    const collection = this.db.collection(collectionName);
    await collection.deleteOne({ fbKey: doc.fbKey }, 1);
    console.log(chalk.red(`[mongodb] removed on ${collectionName} firebase key: ${doc.fbKey}`));
    this[close]();
  }


  // private function
  async [connect]() {
    let connectionUrl = '';
    if (this.config.auth !== undefined) {
      connectionUrl = `mongodb://${this.config.auth.user}:${this.config.auth.password}@${this.config.host}:${this.config.port}/${this.config.database}`;
    } else {
      connectionUrl = `mongodb://${this.config.host}:${this.config.port}/${this.config.database}`;
    }
    try {
      this.db = await MongoClient.connect(connectionUrl);
      console.log(chalk.bgGreen(`connected to ${connectionUrl}`));
    } catch (error) {
      console.log(chalk.red(`[mongodb] ${error}`));
    }
  }
  [close]() {
    this.db.close();
  }
}

export default Mongo;
