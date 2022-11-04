import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    start_ip: String,
    end_ip: String,
    join_key: String,
    city: String,
    region: String,
    country: String,
    latitude: Number,
    longitude: Number,
    postal_code: String,
    timezone: String,
    start_ip_int: Number,
    end_ip_int: Number,
    join_key_int: { type: Number, index: true }
  },
  {
    versionKey: false,
    toObject: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.join_key;
        delete ret.start_ip;
        delete ret.end_ip;
        delete ret.join_key_int;
        delete ret.start_ip_int;
        delete ret.end_ip_int;
      }
    },
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.join_key;
        delete ret.start_ip;
        delete ret.end_ip;
        delete ret.join_key_int;
        delete ret.start_ip_int;
        delete ret.end_ip_int;
      }
    }
  });

const IPInfoModel = mongoose.model('ipinfo', schema);

export default IPInfoModel;
