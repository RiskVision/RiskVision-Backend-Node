const { db } = require('../database/fireBaseConf');
const { generateToken } = require('../jwUtils');
const bcrypt = require('bcrypt');

module.exports = {
    addUser: async (req, res) => {
        try {
            const { user, password, role, name, privileges } = req.body;

            // Generate hashed password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Add user to the database with encrypted password
            await db.collection('Login-info').add({
                user: user,
                password: hashedPassword,
                role: role,
                name: name,
                privileges: privileges
            });

            res.status(201).send({ message: "User added successfully" });
        } catch (error) {
            res.status(500).send("Error adding user");
            console.log(error);
        }
    },

    login: async (req, res) => {
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
                    token: token,
                    role: user.role
                });
            } else {
                res.status(401).send({ message: "Wrong password" });
            }
        } catch (error) {
            res.status(500).send("Error during login");
            console.log(error);
        }
    },

    getAllUsers: async (req, res) => {
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
                users: users
            });
        } catch (error) {
            res.status(500).send("Error retrieving users");
            console.log(error);
        }
    },

    // New function to update user details
    updateUser: async (req, res) => {
        try {
            const { user, updates } = req.body;

            // Fetch the user by username
            const snapshot = await db.collection('Login-info').where('user', '==', user).get();
            if (snapshot.empty) {
                return res.status(404).send({ message: "User not found" });
            }

            const userId = snapshot.docs[0].id; // Get the document ID of the user

            // Update the user's details in the database
            await db.collection('Login-info').doc(userId).update(updates);

            res.status(200).send({ message: "User updated successfully" });
        } catch (error) {
            res.status(500).send("Error updating user");
            console.log(error);
        }
    },

    // New function to delete a user
    deleteUser: async (req, res) => {
        try {
            const { user } = req.body;

            // Fetch the user by username
            const snapshot = await db.collection('Login-info').where('user', '==', user).get();
            if (snapshot.empty) {
                return res.status(404).send({ message: "User not found" });
            }

            const userId = snapshot.docs[0].id; // Get the document ID of the user

            // Delete the user from the database
            await db.collection('Login-info').doc(userId).delete();

            res.status(200).send({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).send("Error deleting user");
            console.log(error);
        }
    }
};
