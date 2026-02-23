// src/kafka/kafkaClient.js
import { Kafka } from "kafkajs";
import {env} from "../config/envConfig.js"

// region Kafka instance
const kafka = new Kafka({
  clientId: env?.KAFKA_CLIENT_ID ?? "issue-tracker",
  brokers: [env?.KAFKA_BROKER ?? "localhost:9092"],
});
// endregion

export default kafka;
