const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { Users } = require("./models");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("./middlewares/Auth");

app.use(express.json());
app.use(cors());

const db = require("./models");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "guessthecodedb",
});

//Routes

const userRouter = require("./routes/Users");
app.use("/users", userRouter);

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);

  connection.query(
    "INSERT INTO users (username, email, password) VALUES (?,?,?)",
    [username, email, password],
    (err, result) => {
      if (err) {
        console.error("Error during registration:", err);
        res
          .status(500)
          .json({ error: "Registration failed. Please try again later." });
      } else {
        res.status(200).json({ message: "Registration successful" });
      }
    }
  );
});

app.get("/check", (req, res) => {
  const email = req.body.email;
  const username = req.body.username;

  connection.query(
    "SELECT * FROM users WHERE email = ? or username = ?",
    [email, username],
    (err, result) => {
      if (err) {
        console.log("Chek je eroer" + err);
      } else {
        console.log("proslo je " + result);
        res.send(result);
      }
    }
  );
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Users.findOne({ where: { email: email } });

  if (!user) return res.status(400).send("User with this email is not found");
  console.log(res);
  const validPassword = await bcrypt.compare(password, user.password);
  console.log(res);
  if (!validPassword) return res.status(400).send("Invalid password");
  const token = sign({ username: user.username, id: user.id }, "jwtPrivateKey");
  res.json({ token });
});

app.get("/profile/:id", async (req, res) => {
  const userId = req.params.id;
  // Use userId to query the database and get user data
  const userData = await Users.findByPk(userId);
  console.log(userData);
  res.json(userData);
});

app.get("/game/:id", async (req, res) => {
  const userIdGame = req.params.id;
  const userDataGame = await Users.findByPk(userIdGame);
  console.log(userDataGame);
  res.json(userDataGame);
});

app.get("/leaderboard", (req, res) => {
  const searchTerm = req.query.searchTerm || ""; // Default to empty string if not provided
  const orderBy = req.query.orderBy || "score"; // Default to "score" if not provided
  const orderDirection = req.query.orderDirection || "desc"; // Default to "desc" if not provided

  const query = `
    SELECT username, score, average_score, number_of_games
    FROM users
    WHERE username LIKE ?
    ORDER BY ${orderBy} ${orderDirection}
  `;

  connection.query(query, [`%${searchTerm}%`], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error fetching leaderboard data" });
    } else {
      res.status(200).json(result);
    }
  });
});

app.put("/profile/:id", async (req, res) => {
  const userId = req.params.id;
  const newUsername = req.body.username;

  try {
    // Assuming you have a "Users" model and Sequelize initialized as "sequelize"
    const user = await Users.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the username
    user.username = newUsername;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/game/:id", async (req, res) => {
  const userId = req.params.id;
  const newScore = req.body.score;
  try {
    const user = await Users.findOne({ where: { id: userId } });
    user.score = user.score + newScore;
    user.number_of_games += 1;
    user.average_score = user.score / user.number_of_games;
    await user.save();
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Exampleasdistening on port 3000!");
  });
});
