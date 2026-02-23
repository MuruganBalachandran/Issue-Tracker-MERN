// region imports
import kafka from "./kafkaClient.js";
import { KAFKA_TOPICS } from "./topics.js";
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/emailService.js";

// region Create consumer
const consumer = kafka.consumer({ groupId: "issue-tracker-group" });
let isConnected = false;
// endregion

// Connect and subscribe
export const startConsumer = async () => {
  try {
    // if not connected , connect.
    if (!isConnected) {
      await consumer.connect();
      isConnected = true;
      console.log(" Kafka Consumer connected");
    }

    // Subscribe to all topics
    await consumer.subscribe({
      topic: KAFKA_TOPICS.ISSUE_CREATED,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.ISSUE_UPDATED,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.ISSUE_DELETED,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.USER_CREATED,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.USER_UPDATED,
      fromBeginning: true,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.SEND_VERIFICATION_EMAIL,
      fromBeginning: true,
    });

    await consumer.subscribe({
      topic: KAFKA_TOPICS.SEND_PASSWORD_RESET_EMAIL,
      fromBeginning: true,
    });

    // Run consumer
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = message.value ? JSON.parse(message.value.toString()) : {};

        console.log(`📥 Event received [${topic}]`, event);

        try {
          switch (topic) {
            case KAFKA_TOPICS.USER_CREATED:
              console.log(" Sending welcome email...");
              await sendWelcomeEmail(event);
              break;

            case KAFKA_TOPICS.SEND_VERIFICATION_EMAIL:
              console.log(" Sending verification email...");
              await sendVerificationEmail(event);
              break;

            case KAFKA_TOPICS.SEND_PASSWORD_RESET_EMAIL:
              console.log(" Sending password reset email...");
              await sendPasswordResetEmail(event);
              break;

            default:
              console.log("No handler for topic:", topic);
          }
        } catch (err) {
          console.error(" Email processing failed:", err);
        }
      },
    });
  } catch (err) {
    console.error("❌ Kafka Consumer error:", err);
  }
};
// endregion
