const { liveStreams } = require("../data/live");

const SHOW_TITLES = [
  "Morning Roundup",
  "Wildlife Documentary",
  "Midday Report",
  "Feature Presentation",
  "Evening News",
  "Late Night Special",
];

function xmltvTimestamp(date) {
  // Xtream/XMLTV format: YYYYMMDDHHMMSS +0000
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    " +0000"
  );
}

// Generates a rolling 24h schedule per channel, 2-hour blocks, for anything
// that needs sample EPG data (client channel-guide UI, get_short_epg, xmltv.php).
function generateScheduleForChannel(channelId) {
  const blocks = [];
  const start = new Date();
  start.setUTCMinutes(0, 0, 0);
  start.setUTCHours(start.getUTCHours() - (start.getUTCHours() % 2)); // align to even hour

  for (let i = 0; i < 12; i++) {
    const blockStart = new Date(start.getTime() + i * 2 * 3600 * 1000);
    const blockStop = new Date(blockStart.getTime() + 2 * 3600 * 1000);
    blocks.push({
      channelId,
      title: SHOW_TITLES[i % SHOW_TITLES.length],
      start: blockStart,
      stop: blockStop,
    });
  }
  return blocks;
}

function getShortEpgForChannel(streamId) {
  const channel = liveStreams.find((s) => s.stream_id === streamId);
  if (!channel) return [];

  return generateScheduleForChannel(streamId).map((block, idx) => ({
    id: String(streamId * 100 + idx),
    epg_id: String(streamId),
    title: Buffer.from(block.title).toString("base64"),
    lang: "en",
    start: block.start.toISOString().replace("T", " ").substring(0, 19),
    end: block.stop.toISOString().replace("T", " ").substring(0, 19),
    description: Buffer.from(`${block.title} on ${channel.name}`).toString("base64"),
    channel_id: String(streamId),
    start_timestamp: String(Math.floor(block.start.getTime() / 1000)),
    stop_timestamp: String(Math.floor(block.stop.getTime() / 1000)),
  }));
}

function generateXmltv() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<tv generator-info-name="xtream-mock-server">\n`;

  liveStreams.forEach((ch) => {
    xml += `  <channel id="${ch.stream_id}">\n    <display-name>${escapeXml(
      ch.name
    )}</display-name>\n  </channel>\n`;
  });

  liveStreams.forEach((ch) => {
    generateScheduleForChannel(ch.stream_id).forEach((block) => {
      xml += `  <programme channel="${ch.stream_id}" start="${xmltvTimestamp(
        block.start
      )}" stop="${xmltvTimestamp(block.stop)}">\n    <title>${escapeXml(
        block.title
      )}</title>\n  </programme>\n`;
    });
  });

  xml += `</tv>\n`;
  return xml;
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = { getShortEpgForChannel, generateXmltv };
