import mongoose from 'mongoose';

/** Creates mongodb client and connects to it on given url */
export const connect = async (url) => {
  await mongoose.connect(url);
  return mongoose;
};
