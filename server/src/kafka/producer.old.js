// region imports
import { Kafka } from "kafkajs";
// endregion

// region create kafka client
const kafka = new Kafka({
  clientId: "my-app", // Name of the application
  brokers: ["localhost:9092"], // Address of Kafka server(s)
  // 9092 - running locally
});
// endregion

// create producer
const producer = kafka.producer();

// region run producer
const run = async () => {
  try {
    await producer.connect();
    // Opens TCP connection to broker
    // Performs metadata fetch
    // Joins Kafka cluster

    await producer.send({
      topic: "test-topic", // Where message should go
      messages: [{ value: "Hello from KafkaJS " }],
      /*
    Array of messages
    message object :{
  key: "optional-key",
  value: "message body",
  partition: 0,
  headers: {}
}
    */
    });

    console.log(" Message sent");
    // Closes network connections
    await producer.disconnect();
  } catch (err) {
    console.log("error in producer");
  }
};
// endregion

// region call func
run();
// endregion
