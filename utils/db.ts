import { MongoClient } from 'mongodb';

const baseURL = 'mongodb://mandeep:sairam@127.0.0.1:27017/mrits';
export const client = new MongoClient(baseURL);
export const db = client.db('mrits');
