import { Kafka, Producer, Consumer } from "kafkajs";
import * as logger from "../utils/logger";
import {
  KAFKA_CLIENT_ID,
  KAFKA_GROUP_ID,
  KAFKA_TOPIC,
} from "../config/constants";

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER || "localhost:9093"],
});

const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

export const connectKafka = async () => {
  try {
    await producer.connect();
    logger.info("Kafka Producer connected");

    await consumer.connect();
    logger.info("Kafka Consumer connected");
  } catch (error) {
    logger.error("Error connecting to Kafka:", error);
  }
};

export const startConsumer = async (
  topic: string,
  handler: (message: string | undefined) => Promise<void>
) => {
  try {
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        await handler(value);
      },
    });
    logger.info(`Kafka Consumer started for topic: ${topic}`);
  } catch (error) {
    logger.error(`Error starting consumer for topic ${topic}:`, error);
  }
};

export const produceEvent = async (payload: any) => {
  try {
    await producer.send({
      topic: KAFKA_TOPIC,
      messages: [{ value: JSON.stringify(payload) }],
    });
    logger.info("Event produced to Kafka");
  } catch (error) {
    logger.error("Error producing event to Kafka:", error);
  }
};
