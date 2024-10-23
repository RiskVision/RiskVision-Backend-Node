import db from '../database/fireBaseConfig.js';
import generateToken from '../jwUtils.js';
import bcrypt from 'bcrypt';

// Define and export the methods individually
export const addUser = async (req, res) => {
    try {
        const { user, password, role, name, privileges } = req.body;

        // Generate hashed password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user to the database with hashed password
        await db.collection('Login-info').add({
            user,
            password: hashedPassword,
            role,
            name,
            privileges
        });

        res.status(201).send({ message: "User added successfully" });
    } catch (error) {
        res.status(500).send("Error adding user");
        console.error(error);
    }
};

export const login = async (req, res) => {
    try {
        const snapshot = await db.collection('Login-info').where('user', '==', req.body.user).get();
        if (snapshot.empty) {
            return res.status(404).send({ message: "User not found" });
        }

        const user = snapshot.docs[0].data();
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (validPassword) {
            const token = generateToken(user);

            res.status(200).send({
                message: "Success",
                token,
                role: user.role
            });
        } else {
            res.status(401).send({ message: "Wrong password" });
        }
    } catch (error) {
        res.status(500).send("Error during login");
        console.error(error);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const snapshot = await db.collection('Login-info').get();

        if (snapshot.empty) {
            return res.status(404).send({ message: "No users found" });
        }

        const users = snapshot.docs.map(doc => {
            const { password, ...userWithoutPassword } = doc.data();
            return userWithoutPassword;
        });

        res.status(200).send({
            message: "Users retrieved successfully",
            users
        });
    } catch (error) {
        res.status(500).send("Error retrieving users");
        console.error(error);
    }
};
