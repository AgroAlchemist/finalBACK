import express from 'express';
import cors from 'cors';
import farmerRoutes from './routes/farmer.js';
import cropRoutes from './routes/crops.js';
import userRoutes from './routes/users.js';
import rentalRoutes from './routes/rental.js';
import { showTables } from './database.js';

const app = express();

// Middleware
app.use(cors()); // Allow all orig  ins for now
app.use(express.json());

// Routes
app.use('/farmer', farmerRoutes);
app.use('/crops', cropRoutes);
app.use('/users', userRoutes);
app.use('/rental', rentalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
    

