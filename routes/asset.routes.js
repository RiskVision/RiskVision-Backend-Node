const Router = require('express');
const poolPromise = require('../database/dbSQL.js');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtiene el pool de conexiones
        const result = await pool.request().query('SELECT * FROM dbo.asset_inventory');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;

