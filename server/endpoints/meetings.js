const express = require("express")
const router = express.Router()

const db = require("../db")

router.get("/", (req, res)=>{
    const query = 'SELECT * FROM meetings';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Query results:', results);
        res.json(results);
    });

})


module.exports = router