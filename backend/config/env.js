// Centralized environment configuration.
// Keep defaults dev-friendly, but require secrets in production.

function getEnv(name, fallback) {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

const NODE_ENV = getEnv('NODE_ENV', 'development');

module.exports = {
  NODE_ENV,
  PORT: Number(getEnv('PORT', '3001')),
  MONGO_URI: getEnv('MONGO_URI', ''),
  JWT_SECRET: getEnv('JWT_SECRET', 'dev-secret-change-me'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN', 'http://localhost:5173'),
};
