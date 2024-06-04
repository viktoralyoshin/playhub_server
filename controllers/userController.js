const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "24h" });
};

class UserController {
  async registration(req, res) {
    const { email, password, username, favoriteGames, role } = req.body;
    const { avatar } = req.files;
    const candidate = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (candidate) {
      return res.json({
        message: "Пользователь с таким E-mail уже существует",
      });
    } else {

      let fileName = uuid.v4() + "." + avatar.name.split(".").reverse()[0];
      fs.mkdir(path.join(__dirname, "..", `games/avatars/`), (err) => {
        if (err) {
          return console.error(err);
        }
        console.log("Папка создана");
      });

      const hashPassword = await bcrypt.hash(password, 6);
      const user = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashPassword,
          role: role,
          avatar: `http://localhost:5000/avatars/${fileName}`,
        },
      });

      avatar.mv(path.resolve(__dirname, "..", `games/avatars`, fileName));

      for (let i = 0; i < favoriteGames.length; i++) {
        await prisma.favoriteGame.create({
          data: {
            userId: user.id,
            name: favoriteGames[i]["name"],
          },
        });
      }
      const token = generateJWT(user.id, user.email);

      res.json({ message: "success", token: token });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      const comparePassword = bcrypt.compareSync(password, user.password);
      if (comparePassword) {
        const token = generateJWT(user.id, user.email);
        res.json({ message: "success", token: token });
      } else {
        return res.json({ message: "Неверный пароль" });
      }
    } else {
      return res.json({ message: "Пользователя с таким E-mail не существует" });
    }
  }

  async verify(req, res) {
    try {
      const token = req.body.token;
      const claims = jwt.verify(token, process.env.SECRET_KEY);

      if (!claims) {
        return res.status(401).send({ message: "Неавторизирован" });
      }

      const user = await prisma.user.findUnique({
        where: { id: claims.id },
      });

      res.send({user, token});
    } catch (e) {
      return res.status(401).send({ message: "Неавторизирован" });
    }
  }

  async logout(req, res) {
    res.json({ message: "success", token: "" });
  }

  async getUser(req, res) {
    const { id } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    res.json(user);
  }
}

module.exports = new UserController();
