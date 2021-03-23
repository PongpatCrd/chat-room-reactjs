const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient({
  host: "127.0.0.1",
  port: 6379
})

const multi = promisify(client.multi).bind(client);
const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const getList = promisify(client.lrange).bind(client);

module.exports = {
  multi,
  get,
  set,
  getList
}