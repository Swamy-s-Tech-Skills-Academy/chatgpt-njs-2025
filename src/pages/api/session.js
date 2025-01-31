import { getSession } from '@auth0/nextjs-auth0';

export default async function handler(req, res) {
    try {
        const session = await getSession(req, res);
        console.log('Session: ', session);

        if (session) {
            res.status(200).json(session);
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
