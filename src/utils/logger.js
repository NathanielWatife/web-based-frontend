const isProd = process.env.NODE_ENV === 'production';

export const log = {
  info: (...args) => { if (!isProd) console.info(...args); },
  warn: (...args) => { if (!isProd) console.warn(...args); },
  error: (...args) => { if (!isProd) console.error(...args); },
};
