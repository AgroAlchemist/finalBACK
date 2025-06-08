import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
const pool = mysql.createPool({
    host: process.env.HOST  ,
    user: process.env.USER  ,
    password: process.env.PASSWORD ,
    database: process.env.DATABASE 
}).promise();


export  async function showTables() {
    const result = await pool.query('show tables');
    return result[0]
}

export  async function showUsers(){
    const result = await pool.query('select * from farmers')
    return result[0];
}


//showTables().then((result) => console.log(result))
export default {pool,showTables, showUsers}




