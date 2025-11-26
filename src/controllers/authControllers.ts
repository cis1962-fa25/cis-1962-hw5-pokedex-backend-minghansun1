import jwt from 'jsonwebtoken';

export function createToken(req: any, res: any) {
    console.log(req.body);
    const pennkey = req.body.pennkey;
    if (!pennkey) {
        return res.status(400).json({ error: 'PennKey is required' });
    }

    const secretKey = process.env.JWT_TOKEN_SECRET;

    const payload = { pennkey };
    const token = jwt.sign(payload, secretKey!);

    res.json({ token });
}

