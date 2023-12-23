// Database Service - Decoupled Database Logic
const jawsdb = require("../../jawsdb.js");

require("dotenv").config();

exports.findUser = () => {
    return new Promise((resolve, reject) => {
        jawsdb.query("SELECT id FROM user", (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].id);
            }
        });
    });
}

exports.findIdByEmail = (email) => {
    return new Promise((resolve, reject) => {
        jawsdb.query("SELECT id FROM user WHERE email = ?", [email], (err, results) => {
            if (err) {
                reject(err); // Reject the promise with the error
            } else {
                if (results.length > 0) {
                    resolve(results[0].id); // Resolve the promise with the 'id' value
                } else {
                    resolve(null); // Resolve with null if no results were found
                }
            }
        });
    });
};
