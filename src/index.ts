import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import connectDB from './config/db';
import { startConsumer } from './services/rabbitServiceEventEmailPublish'; 

dotenv.config();

const PORT = process.env.PORT;

connectDB().then(()=>{
  app.listen(PORT, () => {
            console.log('✅ Connected to MongoDB');
            console.log(`🚀 Server running on port ${PORT}`);
            startConsumer().then(() => {
                console.log('📥 RabbitMQ consumer started successfully');
            }).catch(err => {
                console.error('❌ Error starting RabbitMQ consumer:', err);
            });
        });
    })

