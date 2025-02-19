import express from 'express';
import db from '../database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(express.json());

// Get all crops listed for sale
router.get('/', async (req, res) => {
    try {
        const [crops] = await db.pool.query(`
            SELECT c.*, f.name as farmer_name, f.location as farm_location 
            FROM crops_for_sale c 
            JOIN farmers f ON c.farmer_id = f.farmer_id
            WHERE c.quantity > 0
            ORDER BY c.created_at DESC
        `);
        res.status(200).json(crops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new crop listing
router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            crop_name,
            quantity,
            unit,
            price_per_unit,
            description,
            harvest_date,
            image_url,
            is_organic
        } = req.body;

        const [result] = await db.pool.query(
            `INSERT INTO crops_for_sale (
                farmer_id, crop_name, quantity, unit, price_per_unit,
                description, harvest_date, image_url, is_organic
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.farmerId,
                crop_name,
                quantity,
                unit,
                price_per_unit,
                description,
                harvest_date,
                image_url,
                is_organic
            ]
        );

        res.status(201).json({
            message: "Crop listed successfully",
            crop_id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get crops by farmer ID
router.get('/farmer/:farmerId', async (req, res) => {
    try {
        const [crops] = await db.pool.query(
            `SELECT c.*, f.name as farmer_name, f.location as farm_location 
             FROM crops_for_sale c 
             JOIN farmers f ON c.farmer_id = f.farmer_id 
             WHERE c.farmer_id = ?`,
            [req.params.farmerId]
        );
        res.status(200).json(crops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific crop listing
router.get('/:id', async (req, res) => {
    try {
        const [crops] = await db.pool.query(
            `SELECT c.*, f.name as farmer_name, f.location as farm_location 
             FROM crops_for_sale c 
             JOIN farmers f ON c.farmer_id = f.farmer_id 
             WHERE c.crop_id = ?`,
            [req.params.id]
        );

        if (crops.length === 0) {
            return res.status(404).json({ error: "Crop listing not found" });
        }
        res.status(200).json(crops[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a crop listing
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const {
            crop_name,
            quantity,
            unit,
            price_per_unit,
            description,
            harvest_date,
            image_url,
            is_organic
        } = req.body;

        const [result] = await db.pool.query(
            `UPDATE crops_for_sale 
             SET crop_name = ?, quantity = ?, unit = ?, price_per_unit = ?,
                 description = ?, harvest_date = ?, image_url = ?, is_organic = ?
             WHERE crop_id = ? AND farmer_id = ?`,
            [
                crop_name,
                quantity,
                unit,
                price_per_unit,
                description,
                harvest_date,
                image_url,
                is_organic,
                req.params.id,
                req.userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({
                message: "You can only update your own crop listings"
            });
        }

        res.json({ message: "Crop listing updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a crop listing
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const [result] = await db.pool.query(
            'DELETE FROM crops_for_sale WHERE crop_id = ? AND farmer_id = ?',
            [req.params.id, req.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Crop listing not found" });
        }
        res.status(200).json({
            message: `Deleted crop listing with id ${req.params.id}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search crops by name or location
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const [crops] = await db.pool.query(
            `SELECT c.*, f.name as farmer_name, f.location as farm_location 
             FROM crops_for_sale c 
             JOIN farmers f ON c.farmer_id = f.farmer_id 
             WHERE c.crop_name LIKE ? OR f.location LIKE ?`,
            [`%${query}%`, `%${query}%`]
        );
        res.status(200).json(crops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 