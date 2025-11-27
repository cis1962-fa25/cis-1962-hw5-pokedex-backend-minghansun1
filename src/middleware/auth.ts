import jwt from 'jsonwebtoken';

export function requireAuth(req: any, res: any, next: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({  code: "UNAUTHORIZED", message: 'Unauthorized' });
    }

    const secretKey = process.env.JWT_TOKEN_SECRET;
    jwt.verify(token, secretKey!, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ code: "UNAUTHORIZED", message: 'Invalid token' });
        }
        req.decoded = decoded;
        next();
    });
}
