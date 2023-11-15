import type { Channel, GetMessage } from "amqplib";
import { connect } from "amqplib";
import pino from "pino";

const logger = pino();
const MAX_RETRIES = 20;
const RETRY_DELAY = 5000; // 5 seconds

let channelInstance: Channel | null = null;

const connectWithRetry = async (
  url: string,
  attempt: number,
): Promise<Channel> => {
  try {
    const connection = await connect(url);
    logger.info("Connection to RabbitMQ succeeded!");
    return await connection.createChannel();
  } catch (error) {
    logger.warn(
      `Attempt ${attempt}: Unable to connect to RabbitMQ. Retrying in ${
        RETRY_DELAY / 1000
      } seconds...`,
    );
    logger.error(error);

    if (attempt >= MAX_RETRIES) {
      logger.error("Max retries reached. Exiting...");
      process.exit(1);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, RETRY_DELAY);
    });
    return connectWithRetry(url, attempt + 1);
  }
};

export const getChannelInstance = async (): Promise<Channel> => {
  if (channelInstance) {
    return channelInstance;
  }

  const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://rabbitmq";
  logger.debug("Loaded RABBITMQ_URL:", rabbitmqUrl);

  channelInstance = await connectWithRetry(rabbitmqUrl, 1);
  return channelInstance;
};

export const sendMessage = async (
  queueName: string,
  data: string,
  channel: Channel,
): Promise<boolean> => {
  await channel.assertQueue(queueName, { durable: false, autoDelete: true });
  return channel.sendToQueue(queueName, Buffer.from(data));
};

export const getMessage = async (
  queueName: string,
  channel: Channel,
): Promise<false | GetMessage> => {
  await channel.assertQueue(queueName, { durable: false, autoDelete: true });
  return channel.get(queueName, { noAck: false });
};

export const deleteQueue = async (queueName: string) => {
  const channel = await getChannelInstance();

  try {
    await channel.deleteQueue(queueName);
    logger.info(`Queue ${queueName} has been successfully deleted`);
  } catch (error) {
    logger.error(`Error occurred while trying to delete queue ${queueName}`);
    logger.error(error);
  }
};
