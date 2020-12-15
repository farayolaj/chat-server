import mongoose from 'mongoose';

const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/chatty', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });

    console.log('Connected to database');
  } catch (err) {
    console.log('Error connecting to database');
  }
}

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (err) {
    console.log('Error disconnecting from database');
  }
}

export default { connect, disconnect };