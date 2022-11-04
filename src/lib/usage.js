let started = false;

const key = 'api-usage';

export const start = async () => {
  if (!started) {
    await global.statStore.bgRewriteAof();
  }
  started = true;
};

export const increase = () => global.statStore.incr(key);

export const getUsage = () => global.statStore.get(key);
