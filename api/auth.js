// api/auth.js
import { json } from '@vercel/node';
import { google } from 'googleapis';
import { Pool } from 'pg';

// Setup PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idToken } = req.body;

    // Verifikasi ID token Google
    const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    // Ambil email atau ID Google
    const { email } = payload;

    // Cek apakah user sudah ada di database
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      // Jika belum ada, tambahkan ke database
      await pool.query('INSERT INTO users(email) VALUES($1)', [email]);
    }

    res.status(200).json({ message: 'Login berhasil', email });
  } else if (req.method === 'GET') {
    // Logout: hapus session atau token
    res.status(200).json({ message: 'Logout berhasil' });
  }
}
