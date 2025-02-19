import bcrypt from 'bcrypt';
import db from '../database.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        
        // Check if user already exists
        const [existingUser] = await db.pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.pool.query(
            `INSERT INTO users (name, email, password_hash, phone, address) 
             VALUES (?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, phone, address]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user_id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                userId: user.user_id,
                role: 'buyer'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            token,
            userId: user.user_id,
            role: 'buyer',
            name: user.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const [user] = await db.pool.query(
            'SELECT user_id, name, email, phone, address, created_at FROM users WHERE user_id = ?',
            [userId]

        );

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        
        const [result] = await db.pool.query(
            `UPDATE users 
             SET name = ?, phone = ?, address = ?
             WHERE user_id = ?`,
            [name, phone, address, req.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 


export const registerFarmer = async (req, res) => {
    try {
        const { name, email, password, phone, location } = req.body;
        
        // Check if farmer already exists
        const [existingFarmer] = await db.pool.query(
            'SELECT * FROM farmers WHERE email = ?',
            [email]
        );

        if (existingFarmer.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert farmer
        const [result] = await db.pool.query(
            `INSERT INTO farmers (name, email, password_hash, phone, location) 
             VALUES (?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, phone, location]
        );

        res.status(201).json({
            message: 'Farmer registered successfully',
            farmer_id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllFarmers = async (req, res) => {
    try {
        const [farmers] = await db.pool.query('SELECT * FROM farmers');
        res.json(farmers);
    } catch (error) {
        console.error(error);   
        res.status(500).json({ error: 'Internal server error' });   
    }
};








export const loginFarmer = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [farmers] = await db.pool.query(
            'SELECT * FROM farmers WHERE email = ?',
            [email]
        );

        if (farmers.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const farmer = farmers[0];
        const validPassword = await bcrypt.compare(password, farmer.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { farmerId: farmer.farmer_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, farmerId: farmer.farmer_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getFarmerProfile = async (req, res) => {
    try {
        const farmerId = req.params.id;
        const [farmer] = await db.pool.query(
            'SELECT farmer_id, name, email, phone, location, created_at FROM farmers WHERE farmer_Id = ? ',
            [farmerId]
        );


        if (farmer.length === 0) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        res.json(farmer[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateFarmerProfile = async (req, res) => {
    try {
        const { name, phone, location } = req.body;
        
        const [result] = await db.pool.query(
            `UPDATE farmers  
             SET name = ?, phone = ?, location = ?
             WHERE farmer_id = ?`,
            [name, phone, location, req.farmerId]
        );

        if (result.affectedRows === 0) {    
            return res.status(404).json({ error: 'Farmer not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);   
        res.status(500).json({ error: 'Internal server error' });
    }
};  


