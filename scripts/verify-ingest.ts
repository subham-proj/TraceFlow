import { prisma } from "../src/lib/prisma";
import { connectKafka, produceEvent, startConsumer } from "../src/lib/kafka";
import { processTraceEvent } from "../src/services/trace.processor";
import { randomUUID } from "crypto";
import { KAFKA_TOPIC } from "../src/config/constants";

const ORG_ID = "org_123";
const PROJECT_ID = "proj_abc";
const TRACE_ID = randomUUID();

const main = async () => {
  console.log("🚀 Starting Verification...");

  try {
    // 1. Seed Organization and Project
    console.log("🌱 Seeding Database...");

    // Ensure Org exists
    const org = await prisma.organization.upsert({
      where: { id: ORG_ID },
      update: {},
      create: {
        id: ORG_ID,
        name: "Test Org",
      },
    });
    console.log(`✅ Organization ensured: ${org.id}`);

    // Ensure Project exists
    const project = await prisma.project.upsert({
      where: { id: PROJECT_ID },
      update: {},
      create: {
        id: PROJECT_ID,
        orgId: ORG_ID,
        name: "Test Project",
      },
    });
    console.log(`✅ Project ensured: ${project.id}`);

    // 2. Connect to Kafka
    console.log("🔌 Connecting to Kafka...");
    await connectKafka();

    // Start Consumer to process the event we are about to send
    console.log("👂 Starting Consumer...");
    await startConsumer(KAFKA_TOPIC, processTraceEvent);

    // 3. Produce Event
    const payload = {
      org_id: ORG_ID,
      project_id: PROJECT_ID,
      events: [
        {
          timestamp: new Date().toISOString(),
          endpoint: "/api/test",
          method: "POST",
          status: 200,
          latency_ms: 100,
          trace_id: TRACE_ID, // Use unique trace ID to verify this specific run
          response_size: 512,
          tags: {
            userAgent: "TestAgent/1.0",
            env: "test-script",
          },
          service: "test-service",
        },
      ],
    };

    console.log("📨 Producing Event to Kafka...");
    await produceEvent(payload);

    // 4. Wait for Processing
    console.log("⏳ Waiting for 5 seconds for consumer to process...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 5. Verify in DB
    console.log("🔍 Verifying in Database...");
    const savedEvent = await prisma.traceEvent.findFirst({
      where: { traceId: TRACE_ID },
    });

    if (savedEvent) {
      console.log("🎉 SUCCESS! Event found in DB:");
      console.log(savedEvent);
    } else {
      console.error("❌ FAILURE! Event NOT found in DB.");
    }
  } catch (error) {
    console.error("💥 Error during verification:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

main();
