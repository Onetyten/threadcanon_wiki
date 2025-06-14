import { app} from './app.js';
import mongoConnect from './utils/mongoConnect.js';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    console.log("Attempting to connect to the ThreadCanon wiki database");
    await mongoConnect();
    console.log("Connected to the questlog database");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("ThreadCanon has encountered an error", err);
  }
};

startServer();
