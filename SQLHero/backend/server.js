const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const secretKey = crypto.randomBytes(32).toString('hex');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sql_hero'
});

function generateAuthToken(userId) {
    const payload = { userId };
    const token = jwt.sign(payload, secretKey, { expiresIn: '10h' });
    return token;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '../frontend/src/assets/images/profile-pictures');
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
  
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [rows] = await pool.query('INSERT INTO users (username, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())', [username, email, md5(password)]);

        if (rows.affectedRows === 1) {
            res.json({ message: 'Registration successful!' });
        } else {
            res.status(500).json({ message: 'Registration failed!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error!' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM `users` WHERE `username` = ? AND password = ?', [username, md5(password)]);

        if (rows.length > 0) {
            const token = generateAuthToken(rows[0].id);
            res.json({ message: 'Login successful!', token });
        } else {
            res.status(401).json({ message: 'Invalid username or password.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

app.post('/api/query', async (req, res) => {
    const { query } = req.body;
  
    try {
        const [rows] = await pool.query(query);
        res.json({ data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error!' });
    }
});

app.get('/api/levels', async (req, res) => {
    try {
        const [rows] = await pool.query(`select * from levels`);
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.json({ success: true, rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error!' });
    }
});

app.get('/api/levels/:levelId', async (req, res) => {
    const levelId = req.params.levelId;
    try {
        const query = `select * from levels where id = ${levelId}`;
        const [rows] = await pool.query(query);
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.json({ levelData: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error!' });
    }
});

app.post('/api/update-progress', async (req, res) => {
    const { token, completedLevel } = req.body;
    console.log('user will updated level to level ',completedLevel);
    try {
        const decodeID = jwt.verify(token, secretKey);
        const userId = decodeID.userId;
        const updateProgressQuery = 'UPDATE `users` SET `current_level` = ? WHERE `id` = ?';
        const [updateResult] = await pool.query(updateProgressQuery, [completedLevel, userId]);

        if (updateResult.affectedRows === 1) {
            res.json({ message: 'User move to another level.' });
        } else {
            console.error('Error updating user progress in database.');
            res.status(500).json({ message: 'Internal server error.' });
        }
    } catch (err) {
            console.error('Error during progress update:', err);
            res.status(500).json({ message: 'Internal server error.' });
    }
});

app.post('/api/update-achievement', async (req, res) => {
    const { token, earnedAward } = req.body;
    try {
        const decodeID = jwt.verify(token, secretKey);
        const userId = decodeID.userId;
        const updateAchievementQuery = "UPDATE `users` SET `achievements` = CONCAT(IFNULL(`achievements`, ''), ', ', ?) WHERE `id` = ?";
        const [updateAchievementResult] = await pool.query(updateAchievementQuery, [earnedAward, userId]);

        if (updateAchievementResult.affectedRows === 1) {
            res.json({ message: 'User earned an achievement.' });
        } else {
            console.error('Error updating user progress in database.');
            res.status(500).json({ message: 'Internal server error.' });
        }
    } catch (err) {
            console.error('Error during progress update:', err);
            res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/api/user-data', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized access.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodeID = jwt.verify(token, secretKey);
        const userId = decodeID.userId;
        const userQuery = 'SELECT * FROM `users` WHERE `id` = ?';
        const [rows] = await pool.query(userQuery, [userId]);

        if (rows.length > 0) {
            const user = rows[0];
            res.json({ success: true, user });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        } else {
            console.error('Error fetching user data:', err);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
});

app.post('/api/post', async (req, res) => {
    const { token, help } = req.body;
    try {
        const decodeID = jwt.verify(token, secretKey);
        const userId = decodeID.userId;
        const [rows] = await pool.query('INSERT INTO community (`user_id`, `content`, `created_at`, `updated_at`) VALUES (?, ?, NOW(), NOW())', [userId, help]);

        if (rows.affectedRows === 1) {
            res.json({ message: 'Post successful!' });
        } else {
            res.status(500).json({ message: 'Post failed!' });
        }
    } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/api/fetch-posts', async (req, res) => {
    try {
        const query = `SELECT community.*, users.username, users.picture FROM community LEFT JOIN users ON community.user_id = users.id ORDER BY community.created_at DESC;`;
        const [rows] = await pool.query(query);
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.json({ data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error!' });
    }
});

app.post('/api/reply', async (req, res) => {
    const { token, reply, parentId } = req.body;
    try {
        const decodeID = jwt.verify(token, secretKey);
        const userId = decodeID.userId;
        const [rows] = await pool.query('INSERT INTO community_replies (`post_id`, `user_id`, `content`, `created_at`, `updated_at`) VALUES (?, ?, ?, NOW(), NOW())', [parentId, userId, reply]);

        if (rows.affectedRows === 1) {
            res.json({ message: 'Reply successful!' });
        } else {
            res.status(500).json({ message: 'Reply failed!' });
        }
    } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/api/fetch-replies', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT community_replies.*, users.username, users.picture FROM community_replies LEFT JOIN users ON community_replies.user_id = users.id`);
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.json({ data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error!' });
    }
});

app.post('/api/update-profile', async (req, res) => {
    const { token, username, email } = req.body;
    try {
        const decodeID = jwt.verify(token, secretKey);
        const userId = decodeID.userId;
        const updateProfileQuery = 'UPDATE `users` SET `username` = ?, `email` = ? WHERE `id` = ?';
        const [updateResult] = await pool.query(updateProfileQuery, [username, email, userId]);

        if (updateResult.affectedRows === 1) {
            res.json({ success: true, updateResult });
        } else {
            console.error('Error updating user in database.');
            res.status(500).json({ message: 'Internal server error.' });
        }
    } catch (err) {
            console.error('Error during progress update:', err);
            res.status(500).json({ message: 'Internal server error.' });
    }
});

// app.post('/api/update-profile', async (req, res) => {
//     const { token, username, email } = req.body;
//     try {
//         const decodeID = jwt.verify(token, secretKey);
//         const userId = decodeID.userId;
//         const updateProfileQuery = 'UPDATE `users` SET `username` = ?, `email` = ? WHERE `id` = ?';
//         const [updateResult] = await pool.query(updateProfileQuery, [username, email, userId]);

//         if (updateResult.affectedRows === 1) {
//             res.json({ success: true, updateResult });
//         } else {
//             console.error('Error updating user in database.');
//             res.status(500).json({ message: 'Internal server error.' });
//         }
//     } catch (err) {
//             console.error('Error during progress update:', err);
//             res.status(500).json({ message: 'Internal server error.' });
//     }
// });

app.post('/api/change-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decodeID = jwt.verify(token, secretKey);
        const userId = decodeID.userId;
        const updatePasswordQuery = 'UPDATE `users` SET `password` = ? , `updated_at` = NOW() WHERE `id` = ?';
        const [updateResult] = await pool.query(updatePasswordQuery, [md5(newPassword), userId]);

        if (updateResult.affectedRows === 1) {
            res.json({ success: true, updateResult });
        } else {
            console.error('Error updating user in database.');
            res.status(500).json({ message: 'Internal server error.' });
        }
    } catch (err) {
            console.error('Error during progress update:', err);
            res.status(500).json({ message: 'Internal server error.' });
    }
});

app.post('/api/change-picture', upload.single('profilePicture'), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decodeID = jwt.verify(token, secretKey);
        const userId = decodeID.userId;
        const imagePath = `profile-pictures/${req.file.filename}`;       
        const updateProfilePictureQuery = 'UPDATE `users` SET `picture` = ?, updated_at = NOW() WHERE `id` = ?';
        const [updateResult] = await pool.query(updateProfilePictureQuery, [imagePath, userId]);
        if (updateResult.affectedRows === 1) {
            res.json({ success: true, imagePath });
        } else {
            console.error('Error updating user in database.');
            res.status(500).json({ message: 'Internal server error.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});