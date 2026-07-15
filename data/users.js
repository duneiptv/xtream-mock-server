// Test accounts for the mock Xtream server.
// Add/edit accounts here to simulate different client-side scenarios.

const now = Math.floor(Date.now() / 1000);
const ONE_DAY = 86400;

const users = [
  {
    username: "test",
    password: "test",
    status: "Active",
    // exp_date null = never expires
    exp_date: null,
    is_trial: "0",
    max_connections: "1",
    active_cons: "0",
    allowed_output_formats: ["m3u8", "ts", "mp4"],
  },
  // Give each tester their own login rather than sharing "test/test" - makes
  // it obvious in server logs which requests came from whom, and avoids one
  // tester's session/max_connections limit interfering with another's.
  // Add/remove entries here as your QA team changes.
  {
    username: "qa1",
    password: "qa1pass",
    status: "Active",
    exp_date: null,
    is_trial: "0",
    max_connections: "2",
    active_cons: "0",
    allowed_output_formats: ["m3u8", "ts", "mp4"],
  },
  {
    username: "qa2",
    password: "qa2pass",
    status: "Active",
    exp_date: null,
    is_trial: "0",
    max_connections: "2",
    active_cons: "0",
    allowed_output_formats: ["m3u8", "ts", "mp4"],
  },
  {
    username: "qa3",
    password: "qa3pass",
    status: "Active",
    exp_date: null,
    is_trial: "0",
    max_connections: "2",
    active_cons: "0",
    allowed_output_formats: ["m3u8", "ts", "mp4"],
  },
  {
    username: "trial",
    password: "trial",
    status: "Active",
    exp_date: String(now + ONE_DAY), // expires in 24h
    is_trial: "1",
    max_connections: "1",
    active_cons: "0",
    allowed_output_formats: ["m3u8", "ts", "mp4"],
  },
  {
    username: "expired",
    password: "expired",
    status: "Expired",
    exp_date: String(now - ONE_DAY), // expired yesterday
    is_trial: "0",
    max_connections: "1",
    active_cons: "0",
    allowed_output_formats: ["m3u8", "ts", "mp4"],
  },
  {
    username: "disabled",
    password: "disabled",
    status: "Disabled",
    exp_date: String(now + 30 * ONE_DAY),
    is_trial: "0",
    max_connections: "1",
    active_cons: "0",
    allowed_output_formats: ["m3u8", "ts", "mp4"],
  },
  {
    username: "multiuser",
    password: "multiuser",
    status: "Active",
    exp_date: String(now + 30 * ONE_DAY),
    is_trial: "0",
    max_connections: "2", // test simultaneous-connection limits
    active_cons: "0",
    allowed_output_formats: ["m3u8", "ts", "mp4"],
  },
];

function findUser(username, password) {
  return users.find(
    (u) => u.username === username && u.password === password
  );
}

module.exports = { users, findUser };
