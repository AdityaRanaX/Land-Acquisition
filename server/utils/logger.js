const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

const formatTime = () => new Date().toISOString();

const logger = {
  info: (msg, meta = '') => {
    console.log(`${colors.cyan}[INFO]${colors.reset} ${colors.dim}[${formatTime()}]${colors.reset} ${msg}`, meta ? meta : '');
  },
  success: (msg, meta = '') => {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${colors.dim}[${formatTime()}]${colors.reset} ${msg}`, meta ? meta : '');
  },
  warn: (msg, meta = '') => {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${colors.dim}[${formatTime()}]${colors.reset} ${msg}`, meta ? meta : '');
  },
  error: (msg, meta = '') => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${colors.dim}[${formatTime()}]${colors.reset} ${msg}`, meta ? meta : '');
  },
  debug: (msg, meta = '') => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors.magenta}[DEBUG]${colors.reset} ${colors.dim}[${formatTime()}]${colors.reset} ${msg}`, meta ? meta : '');
    }
  }
};

module.exports = logger;
