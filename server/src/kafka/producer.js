// src/kafka/producer.js
import kafka from "./kafkaClient.js";

// region create producer
const producer = kafka.producer();
let isConnected = false;
// endregion

// Connect Producer
export const connectProducer = async () => {
  try {
    if (!isConnected) {
      await producer.connect();
      isConnected = true;
      console.log("✅ Kafka Producer connected");
    }
  } catch (err) {
    console.error("❌ Kafka Producer connection failed:", err);
  }
};

// Send Message
export const sendMessage = async (
  topic = "",
  message = {}
) => {
  try {
    if (!isConnected) {
      await connectProducer();
    }

    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message ?? {}),
        },
      ],
    });
  } catch (err) {
    console.error("❌ Kafka send failed:", err);
  }
};
