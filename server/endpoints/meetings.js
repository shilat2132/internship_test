const express = require("express")
const router = express.Router()

const db = require("../db")


/** an handler to get all meetings  */
const getAllMeetings = (req, res)=>{
    const query = 'SELECT * FROM meetings';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(results);
    });

}


/** an handler to create a meeting */
const createAMeeting = (req, res)=>{
    let { title, date, hour } = req.body;
    date = new Date(date).toISOString().split('T')[0]; // Format date to YYYY-MM-DD
    const query = `INSERT INTO meetings (title, date, hour) VALUES ('${title}', '${date}', '${hour}')`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json("Meeting created successfully");
    });

}


/** an handler to get a meeting */
const getAMeeting = (req, res)=>{
    const id = req.params.id

    const query = `SELECT * FROM meetings WHERE id = ${id}`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Meeting not found');
        }
        res.status(200).json(results[0]);
    });
}


/** an handler to update a meeting */
const updateAMeeting = (req, res)=>{
    const id = req.params.id

    let updateValues = ""
    
    for (const [key, value] of Object.entries(req.body)) {
        if (key !== "date") {
            updateValues += `${key}='${value}',`;
        }
    }

    if(req.body.date){
        date = new Date(req.body.date).toISOString().split('T')[0]
        updateValues += `date='${date}'`
    }else{
        updateValues = updateValues.slice(0, -1) // remove the extra comma
    }

    const query = `UPDATE meetings SET ${updateValues} WHERE id=${id}`

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json("Meeting updated successfully");
    });
}


/** an handler to delete a meeting */
const deleteAMeeting = (req, res)=>{
    const id = req.params.id

    const query = `DELETE FROM meetings WHERE id=${id}`

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json("Meeting deleted successfully");
    });
}

// route prefix = /api/meetings
router.route("/")
    .get(getAllMeetings)
    .post(createAMeeting)

router.route("/:id")
    .get(getAMeeting)
    .patch(updateAMeeting)
    .delete(deleteAMeeting)






module.exports = router