import mongoose, { Schema, model } from 'mongoose';
import { IIdentity } from 'cesieats-service-types/src/identity';

export const identitySchema = new Schema<IIdentity>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  apiKey: { type: String, required: false },
});

export const Identity = model<IIdentity>('Identity', identitySchema);

export async function connectMongoose() {
  await mongoose.connect(`mongodb://${process.env.DB_URL}/`, {
    dbName: 'cesieats-service',
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
  });
  console.log('Connected to MongoDB ');
}
