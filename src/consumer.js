require('dotenv').config();
const amqp = require('amqplib');

const Listener = require('./listener');
const MailSender = require('./MailSender');
const PlaylistSongService = require('./PlaylistSongService');
const config = require('./config');

const init = async () => {
  const playlistSongService = new PlaylistSongService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistSongService, mailSender);

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();
  await channel.assertQueue(config.rabbitMq.queues.exportPlaylist, {
    durable: true,
  });

  channel.consume(config.rabbitMq.queues.exportPlaylist, listener.listen, { noAck: true });
};

init();
