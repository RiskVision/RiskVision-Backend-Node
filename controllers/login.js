const {db} = require('../database/fireBaseConf')
const {generateToken} = require('../jwUtils');
const bcrypt = require('bcrypt')

module.exports = {
    addUser: async (req, res) => {
        try {
            const { user, password, role, name, privileges } = req.body;

            // Generar el hash de la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Guardar el usuario en la base de datos con la contraseña cifrada
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
            // Query the database for all users
            const snapshot = await db.collection('Login-info').get();

            if (snapshot.empty) {
                return res.status(404).send({ message: "No users found" });
            }

            // Extract users' data and filter out passwords
            const users = snapshot.docs.map(doc => {
                const { password, ...userWithoutPassword } = doc.data();
                return userWithoutPassword;
            });

            // Send the users back as a response
            res.status(200).send({
                message: "Users retrieved successfully",
                users: users
            });
        } catch (error) {
            res.status(500).send("Error retrieving users");
            console.log(error);
        }
    }
}

