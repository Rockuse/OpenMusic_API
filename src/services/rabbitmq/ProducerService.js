const amqp = require('amqplib');

class ProducerService {
  constructor() {
    this._amqp = amqp;
  }

  async sendMessage(queue, message) {
    const connection = await this._amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  }
}

module.exports = ProducerService;
