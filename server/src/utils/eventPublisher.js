// src/utils/eventPublisher.js
import { sendMessage } from "../kafka/producer.js";

// 📡 Publish Event
export const publishEvent = async (
  topic = "",
  payload = {}
) => {
  try {
    topic ??= "";
    payload ??= {};

    if (!topic) return;

    await sendMessage(topic, payload);
  } catch (err) {
    console.error("❌ Event publish failed:", err);
  }
};
