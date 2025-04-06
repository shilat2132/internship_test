const express = require("express");
const router = express.Router();
const db = require("../db");
const {filterObj} = require("../utils/utils");

const addUser = (req, res) => {
    if (!req.body.name || !req.body.email) {
        return res.status(400).json("Please provide name and email");
    }

    const {name, email} = req.body

    const query = `INSERT INTO users (name, email) VALUES ('${name}', '${email}')`

    db.query(query, (err, results)=>{
        if(err){
            console.error('Error executing query:', err);
            return res.status(500).send(err);
        }
        res.status(200).json("User created successfully")
    })
}

const updateUser = (req, res) => {
    const id = req.params.id
    
    let updateValues = ""

    for ([key, value] of Object.entries(req.body)){
        updateValues += `${key} = '${value}', `
    }
    updateValues = updateValues.slice(0, -2) // Remove the last comma and space

    const query = `UPDATE users set ${updateValues} WHERE id = ${id}`

    db.query(query, (err, results)=>{
        if(err){
            console.error('Error executing query:', err);
            return res.status(500).send(err);
        }
        res.status(200).json("User updated successfully")
    })
}



const getAllUsers = (req, res) => {
    const query = `SELECT * FROM users`

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send(err);
        }
        res.status(200).json(results)
    })
}


const getAUser = (req, res, next) => {
    const query = `
        SELECT 
            users.id AS user_id, 
            users.name AS user_name, 
            users.email AS user_email, 
            meetings.id AS meeting_id, 
            meetings.title AS meeting_title, 
            meetings.date AS meeting_date, 
            meetings.start_hour AS meeting_start_hour, 
            meetings.end_hour AS meeting_end_hour
        FROM 
            users
        LEFT JOIN 
            meetings 
        ON 
            users.id = meetings.user_id
        WHERE 
            users.id = ${req.params.id}
    `;

    db.query(query, (err, results) => {
        if (err) {
            return next(new AppError('Database query failed', 500)); // Pass the error to the error handler
        }
        if (results.length === 0) {
            return next(new AppError('User not found', 404)); // Custom 404 error
        }

        const user = {
            id: results[0].user_id,
            name: results[0].user_name,
            email: results[0].user_email,
            meetings: results
                .filter(row => row.meeting_id !== null)
                .map(row => ({
                    id: row.meeting_id,
                    title: row.meeting_title,
                    date: row.meeting_date,
                    start_hour: row.meeting_start_hour,
                    end_hour: row.meeting_end_hour
                }))
        };

        res.status(200).json(user);
    });
};



router.route("/").get(getAllUsers).post(addUser)
router.route("/:id").get(getAUser).patch(updateUser)


module.exports = router