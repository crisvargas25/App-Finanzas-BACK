// Import required libraries
import * as amqp from 'amqplib';
import dotenv from 'dotenv';
import {
  registerNotifications,
  handleRecoveryEmail
} from '../controllers/email.Controller';

dotenv.config();

// Configuración general de colas
const {
  RABBITMQ_URL,
  RABBITMQ_EXCHANGE = 'user.exchange',
  RABBITMQ_QUEUE = 'user.created.queue',
  RABBITMQ_ROUTING_KEY = 'user.created',
} = process.env;

// Otras colas específicas
const RECOVERY_ROUTING_KEY = 'user.recovery.requested';
const RECOVERY_QUEUE = 'user.recovery.queue';

export async function startConsumer() {
  const connection = await amqp.connect(RABBITMQ_URL!);
  const channel: amqp.Channel = await connection.createChannel();

  await channel.assertExchange(RABBITMQ_EXCHANGE, 'topic', { durable: true });

  // --- User Created ---
  await channel.assertQueue(RABBITMQ_QUEUE!, { durable: true });
  await channel.bindQueue(RABBITMQ_QUEUE!, RABBITMQ_EXCHANGE, RABBITMQ_ROUTING_KEY!);

  // --- Password Recovery ---
  await channel.assertQueue(RECOVERY_QUEUE, { durable: true });
  await channel.bindQueue(RECOVERY_QUEUE, RABBITMQ_EXCHANGE, RECOVERY_ROUTING_KEY);

  console.log(`📥 Listening on: "${RABBITMQ_QUEUE}" and "${RECOVERY_QUEUE}"`);

  // --- Consumidor: Bienvenida ---
  channel.consume(RABBITMQ_QUEUE!, async (msg) => {
    if (msg) {
      const user = JSON.parse(msg.content.toString());
      console.log('📩 Event received (user.created):', user);

      try {
        await registerNotifications(user);
        channel.ack(msg);
      } catch (err) {
        console.error('❌ Error sending welcome email:', err);
      }
    }
  });

  // --- Consumidor: Recuperación de contraseña ---
  channel.consume(RECOVERY_QUEUE, async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      console.log('📩 Event received (user.recovery.requested):', data);

      try {
        await handleRecoveryEmail(data);
        channel.ack(msg);
      } catch (err) {
        console.error('❌ Error sending recovery email:', err);
      }
    }
  });

}
