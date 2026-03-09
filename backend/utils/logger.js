const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const logger = {
  info: (message, ...args) => {
    console.log(`${colors.cyan}ℹ️  ${message}${colors.reset}`, ...args);
  },

  success: (message, ...args) => {
    console.log(`${colors.green}✅ ${message}${colors.reset}`, ...args);
  },

  warn: (message, ...args) => {
    console.warn(`${colors.yellow}⚠️  ${message}${colors.reset}`, ...args);
  },

  error: (message, ...args) => {
    console.error(`${colors.red}❌ ${message}${colors.reset}`, ...args);
  },

  debug: (message, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors.magenta}🔍 ${message}${colors.reset}`, ...args);
    }
  },

  http: (method, url, status) => {
    const statusColor = status >= 500 ? colors.red : status >= 400 ? colors.yellow : colors.green;
    console.log(`${colors.blue}${method}${colors.reset} ${url} ${statusColor}${status}${colors.reset}`);
  },
};

module.exports = logger;
