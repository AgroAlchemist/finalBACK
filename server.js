import express from 'express';
import cors from 'cors';
import farmerRoutes from './routes/farmer.js';
import cropRoutes from './routes/crops.js';
import userRoutes from './routes/users.js';
import rentalRoutes from './routes/rental.js';
import { showTables } from './database.js';
import path from "path";
const __dirname = path.resolve();

const app = express();

// Middleware
app.use(cors()); // Allow all orig  ins for now
app.use(express.json());

// Routes
app.use('/farmer', farmerRoutes);
app.use('/crops', cropRoutes);
app.use('/users', userRoutes);
app.use('/rental', rentalRoutes);
// app.get('/', (req, res) => {
//     res.sendFile('C:/Users/oskul/Downloads/webdevops/befe/backend/landing.html', (er)=>{
//         console.log("Could not load landing page");
//     })
// })

app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "landing.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
    

