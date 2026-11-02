/////////////////////////////////
////      MAIN WORKFLOW      ////
/////////////////////////////////
import 'dotenv/config';
import { commands } from './commands.js';
import { interactions } from './interactions.js';
import express from 'express';
import {
  Client,
  GatewayIntentBits,
} from 'discord.js';

const app = express();

app.use(express.json());

// Client, Permissions i think
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// PORT, WEBHOOK
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;


//-----Health check-----
app.get("/", (req, res) => {
  res.send("Discord bot is online.");
});

// ===========================
//    APPS SCRIPT TRIGGER
// ===========================
app.post("/trigger", async (req, res) => {

  console.log("Received webhook from Google Apps Script");

  try {
    // Authenticate Connection
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      console.log("Invalid webhook secret");

      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    // Get Info from Apps Script
    const {
      notifType,
      channelId,
      orderId,
      info,
    } = req.body;

    // Log Info Received
    console.log("Webhook data:", req.body);

    // Handle Channel ID Existence
    if (!channelId) { // || !message
      return res.status(400).json({
        success: false,
        error: "channelId is required",
      });
    }
    console.log("chnl check");

    console.log(client.isReady());
    let channel = await client.channels.fetch(channelId);

    // Handle Channel Validity
    if (!channel || !channel.isTextBased()) {
      return res.status(400).json({
        success: false,
        error: "Invalid Discord channel",
      });
    }
    console.log("chnl check 2");

    console.log("erm");
////// SEND PROMPT - based on trigger notif type
    var action = commands(channel, res, orderId, notifType, info);
    action();
  
  } catch (error) {
    console.error("Webhook error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// =========================
// BUTTON INTERACTIONS
// =========================
globalThis.firstClick = {};

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton() && !interaction.isModalSubmit()) return;

  console.log(
    `Button clicked: ${interaction.customId} by ${interaction.user.tag}`
  );

  try {
    var interactionId = interaction.customId.split("_");
    var notifType = interactionId[0];
    var buttonId = interactionId.length > 2 ? interactionId[1] : "none";
    var orderId = interactionId.length > 2 ? interactionId[2] : interactionId[1];

    // Acknowledge Button Click
    if (notifType !== "price") { await interaction.deferReply(); }

////// ACT ON BUTTON CLICK - based on notif type
    console.log(interactionId[0] + "+" + interactionId[1]);
    var interact = await interactions(notifType, buttonId, orderId, interaction);
    await interact();
    console.log(interactionId[0] + "+" + interactionId[1]);

  } catch (error) {
    console.error("Button interaction error:", error);

    // Try to respond if the interaction hasn't been acknowledged
    if (!interaction.deferred && !interaction.replied) {
      await interaction.reply({
        content: "❌ Something went wrong.",
        ephemeral: true,
      });
    }
  }
});

// =========================
// DISCORD CONFIGURATION
// =========================
// -----Discord ready-----
client.once("ready", () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
});

// -----Start server-----
app.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

// -----Login-----
/*client.login(process.env.DISCORD_TOKEN).catch((error) => { console.error("Discord login error:", error); });

client.on("error", (error) => {
  console.error("Discord client error:", error);
});*/
console.log("Starting Discord login", {
  tokenConfigured: Boolean(process.env.DISCORD_TOKEN),
});

client.on("shardReady", (id) => console.log(`Discord shard ${id} ready`));
client.on("shardReconnecting", (id) => console.warn(`Discord shard ${id} reconnecting`));
client.on("shardDisconnect", (event, id) =>
  console.error(`Discord shard ${id} disconnected`, event.code, event.reason)
);
client.on("shardError", (error, id) =>
  console.error(`Discord shard ${id} error`, error)
);
client.on("error", (error) => console.error("Discord client error:", error));

client.on("debug", (message) => console.log("[Discord debug]", message));
client.on("warn", (message) => console.warn("[Discord warn]", message));

client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log("Discord login completed"))
  .catch((error) => console.error("Discord login failed:", error));