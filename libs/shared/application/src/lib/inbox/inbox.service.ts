import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment, ENVIRONMENT_ENV } from '@nz/config';
import { Channel, ConsumeMessage } from 'amqplib';
@Injectable()
export class InboxService implements OnModuleInit {
  private channel!: Channel;

  constructor(private readonly amqpConnection: AmqpConnection, private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.channel = this.amqpConnection.channel;

    await this.channel.assertExchange('events', 'topic', { durable: true });

    const serviceName = this.configService.getOrThrow<Environment>(ENVIRONMENT_ENV).appName;

    const q = await this.channel.assertQueue(`${serviceName}.events`, {
      durable: true,
    });

    await this.channel.bindQueue(q.queue, 'events', serviceName);

    await this.channel.consume(q.queue, this.handleMessage.bind(this), { noAck: false });
  }

  private async handleMessage(msg: ConsumeMessage | null) {
    if (!msg) {
      return;
    }

    try {
      const payload = JSON.parse(msg.content.toString());

      console.log('Received user-service event:', payload);
      this.channel.ack(msg);
    } catch (err) {
      console.error('Failed to process message', err);
      this.channel.nack(msg, false, false);
    }
  }
}
