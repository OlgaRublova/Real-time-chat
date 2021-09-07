const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

//  to call env variables inside Node application
require("dotenv").config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;


const signup = async (req, res) => {
    try {
        //  reads the data from the network request sent from user on form submit
        //  and populates these variables with received data
        const { fullName, username, password, phoneNumber } = req.body;

        //  to create a random sequence 16-digit hex string to be a user id
        const userId = crypto.randomBytes(16).toString('hex');

        //  to make a connection string
        const serverClient = connect(api_key, api_secret, app_id);

        //  to create a password
        const hashedPassword = await bcrypt.hash(password, 10);

        //  to create a token for a user
        const token = serverClient.createUserToken(userId);

        //  return the data to front-end
        res
            .status(200)
            .json({ token, fullName, username, userId, hashedPassword, phoneNumber });


    } catch (error) {
        console.log(error);

        res
            .status(500)
            .json({message: error})
    }

}

const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const serverClient = connect(api_key, api_secret, app_id);

        //  to create a new instance of a StreamChat
        const client = StreamChat.getInstance(api_key, api_secret);

        // to query old user from db that matches this name
        const { users } = await client.queryUsers({ name: username });

        //  if there is no user(s) that matches query
        if(!users.length) {
            return res.status(400).json({message: "User not found"})
        }

        //  if the user exists:
        //
        //  1)  compare password in db with a hashed user's password
        const success = await bcrypt.compare(password, users[0].hashedPassword);

        //  2)  create a new user token
        const token = serverClient.createUserToken(users[0].id);

        //  3)  send data to front-end if it is success
        if(success) {
            res
                .status(200)
                .json({ token, fullName: users[0].fullName, username, userId: users[0].id});
        } else {
            res
                .status(500)
                .json({ message: 'Incorrect password' });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error})
    }
}

module.exports = {signup, login}