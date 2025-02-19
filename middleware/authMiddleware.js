import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.farmerId = decoded.farmerId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const roleMiddleware = (roles) => {
    return (req, res, next) => {
     if(!roles.includes(req.userRole)){
         return res.status(403).json({message:"Access Denied"});
     }
     next()
    }
 }
