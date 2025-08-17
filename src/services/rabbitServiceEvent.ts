import amqp from "amqplib";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// RabbitMQ configuration variables
const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const RABBITMQ_EXCHANGE = process.env.RABBITMQ_EXCHANGE || 'user.exchange';
const QUEUE_CREATED = process.env.RABBITMQ_QUEUE || 'user.created.queue';
const ROUTING_KEY_CREATED = process.env.RABBITMQ_ROUTING_KEY || 'user.created';

// Routing key for password recovery event
const ROUTING_KEY_RECOVERY = 'user.recovery.requested';

// RabbitMQ connection and channel references
let connection: amqp.Connection;
let channel: amqp.Channel;

/**
 * Establishes and sets up the RabbitMQ connection and exchange/queue bindings
 */
async function setupRabbitMQ() {
  if (!connection || !channel) {
    console.log("🔌 Connecting to RabbitMQ...");

    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertExchange(RABBITMQ_EXCHANGE, 'topic', { durable: true });

    await channel.assertQueue(QUEUE_CREATED, { durable: true });
    await channel.bindQueue(QUEUE_CREATED, RABBITMQ_EXCHANGE, ROUTING_KEY_CREATED);

    console.log("✅ RabbitMQ connection and channel are ready.");
  }
}

/**
 * Publishes an event when a new user is created
 * @param user - Object containing user creation data
 */
export async function userCreatedEvent(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  creationDate: Date;
  currency: string;
}) {
  try {
    await setupRabbitMQ();

    const message = JSON.stringify(user);
    channel.publish(RABBITMQ_EXCHANGE, ROUTING_KEY_CREATED, Buffer.from(message), {
      persistent: true,
    });

    console.log(`📨 Event published: ${ROUTING_KEY_CREATED} -> ${message}`);
  } catch (error) {
    console.error(
      "❌ Error publishing user creation event:",
      error instanceof Error ? error.message : error
    );
  }
}

/**
 * Publishes a password recovery request event
 * @param data - Object containing recovery email, name, and token
 */
export async function publishRecoveryEvent(data: {
  email: string;
  name: string;
  token: string;
}) {
  try {
    await setupRabbitMQ();

    const message = JSON.stringify(data);
    channel.publish(RABBITMQ_EXCHANGE, ROUTING_KEY_RECOVERY, Buffer.from(message), {
      persistent: true,
    });

    console.log(`📨 Event published: ${ROUTING_KEY_RECOVERY} -> ${message}`);
  } catch (error) {
    console.error(
      "❌ Error publishing password recovery event:",
      error instanceof Error ? error.message : error
    );
  }
}
