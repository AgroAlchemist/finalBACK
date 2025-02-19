import db from '../database.js';
import axios from 'axios';


export const showCropRecommendation = async (req, res) => {
    try {
        const farmerId = req.farmerId;
      const [result] = await db.pool.query(
        `SELECT * FROM crop_recommendations WHERE farmer_id = ?`,
        [req.farmerId]
      );

      res.json(result);
    
            
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};





export const getCropRecommendation = async (req, res) => {
    try {
        const { 
            soil_type,
            nitrogen,
            phosphorus,
            potassium,
            temperature,
            humidity,
            ph,
            rainfall
        } = req.body;

        // Make request to Flask API with correct parameter names
        const response = await axios.post('http://localhost:5000/predict', {
            Nitrogen: Number(nitrogen),
            Phosporus: Number(phosphorus),
            Potassium: Number(potassium),
            Temperature: Number(temperature),
            Humidity: Number(humidity),
            Ph: Number(ph),
            Rainfall: Number(rainfall)
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const farmerId = req.params.id;

        // Store recommendation in database
        const [result] = await db.pool.query(
            `INSERT INTO crop_recommendations 
            (farmer_id, soil_type, nitrogen, phosphorus, potassium, 
             temperature, humidity, pH, rainfall, recommended_crop)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [farmerId, soil_type, nitrogen, phosphorus, potassium,
             temperature, humidity, ph, rainfall, response.data.crop]
        );

        res.json({
            recommendation_id: result.insertId,
            recommended_crop: response.data.crop
        });
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 