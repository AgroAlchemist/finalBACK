import db from '../database.js';

export const createRental = async (req, res) => {



    const { owner_id, name, description, price_per_day, location } = req.body;
    if (!owner_id || !name || !price_per_day || !location) {
        return res.status(400).json({ error: "All required fields must be filled" });
    }
    
    const sql = "INSERT INTO rental_products (owner_id, name, description, price_per_day, location) VALUES (?, ?, ?, ?, ?)";
    const values = [owner_id, name, description, price_per_day, location];
    db.pool.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Rental product added successfully", rental_id: result.insertId });
    });


};
export const getLocations = async (req, res) => {
    try {
      const [locations] = await db.pool.query("SELECT DISTINCT location FROM rental_products");
      res.json(locations.map(loc => loc.location)); // Return array of locations

    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  };
  
  

  export const getRents = async (req, res) => {
    const { location } = req.query; // ✅ Get location from query params
    
    if (!location) return res.status(400).json({ message: "Location required" });
  

    try {
      const rentals = await db.pool.query("SELECT * FROM rental_products WHERE location = ?", [location]);
      res.json(rentals);
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };
  


export const deleteRent = async (req, res) => {
    const {rentId}  = req.params.rentId;

        const sql = "DELETE FROM rental_products WHERE id = ?"; 
    db.pool.query(sql, [rentId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Rental product deleted successfully" });
    });



};
