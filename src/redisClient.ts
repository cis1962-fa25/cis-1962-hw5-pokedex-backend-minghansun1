import { createClient } from 'redis';

const client = createClient();
client.connect().catch(console.error);
client.on('error', err => console.log('Redis Client Error', err));

export default client;