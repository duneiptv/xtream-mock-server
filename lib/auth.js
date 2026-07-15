const { findUser } = require("../data/users");
const { getPublicUrl } = require("./publicUrl");

function buildServerInfo() {
  const { protocol, host, port } = getPublicUrl();
  return {
    url: host,
    port: String(port),
    https_port: String(port),
    server_protocol: protocol,
    rtmp_port: "25462",
    timezone: "UTC",
    timestamp_now: Math.floor(Date.now() / 1000),
    time_now: new Date().toISOString().replace("T", " ").substring(0, 19),
  };
}

function buildUserInfo(user) {
  const now = Math.floor(Date.now() / 1000);
  const isExpired =
    user.exp_date !== null && Number(user.exp_date) < now;
  const status = user.status === "Disabled" ? "Disabled" : isExpired ? "Expired" : "Active";

  return {
    username: user.username,
    password: user.password,
    message: status === "Active" ? "" : `Account is ${status.toLowerCase()}`,
    auth: status === "Active" ? 1 : 0,
    status,
    exp_date: user.exp_date,
    is_trial: user.is_trial,
    active_cons: user.active_cons,
    created_at: String(now - 30 * 86400),
    max_connections: user.max_connections,
    allowed_output_formats: user.allowed_output_formats,
  };
}

/**
 * Xtream clients authenticate via query params on every request:
 * ?username=x&password=y
 * This middleware validates them and attaches req.xtreamUser.
 */
function requireAuth(req, res, next) {
  const { username, password } = req.query;
  const user = findUser(username, password);

  if (!user) {
    return res.status(200).json({
      user_info: { auth: 0, status: "Invalid credentials" },
      server_info: buildServerInfo(),
    });
  }

  req.xtreamUser = user;
  req.xtreamUserInfo = buildUserInfo(user);
  req.xtreamServerInfo = buildServerInfo();
  next();
}

module.exports = { requireAuth, buildServerInfo, buildUserInfo };
