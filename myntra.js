const express = require("express");
const router = express.Router();
const connection = require('./database');

const getProducts = async (req, res, next) => {
    try {

        const { phone_no, is_active, sort_by = 'id', sort = 'ASC' } =  req.query;

        let whereArray = [];
        let whereData = [];

        if (phone_no) {
            whereArray.push('phone_no = ?');
            whereData.push(phone_no);
        }

        if (is_active) {
            whereArray.push('is_active = ?')
            whereData.push(is_active);
        }

        let whereString = ''
        let sortString = '';

        if (whereArray.length) {
           whereString = `WHERE ${whereArray.join('AND')}`
        }

        if (sort && sort_by) {
            sortString = `ORDER BY ${sort_by} ${sort}`;
        }

        let queryString = `SELECT * FROM users ${whereString} ${sortString}`;
        console.log(queryString, whereData);
        const [results] = await connection.promise().execute(queryString, [whereData]);

        res.status(200).send({results});
    } catch (err) {

    }
}


router.get("/", getProducts);

module.exports = router;