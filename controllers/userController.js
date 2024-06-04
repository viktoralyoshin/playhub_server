const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "24h" });
};

class UserController {
  async registration(req, res) {
    const { email, password, username, favoriteGames, role, avatar } = req.body;
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
      const hashPassword = await bcrypt.hash(password, 6);
      const user = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashPassword,
          role: role,
          avatar: avatar
        },
      });
      for (let i = 0; i < favoriteGames.length; i++) {
        await prisma.favoriteGame.create({
          data: {
            userId: user.id,
            name: favoriteGames[i]["name"],
          },
        });
      }
      const token = generateJWT(user.id, user.email);
      res.cookie("jwt", token, {
        httpOnly: true,
      });
      res.json({ message: "success" });
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
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({ message: "success" });
      } else {
        return res.json({ message: "Неверный пароль" });
      }
    } else {
      return res.json({ message: "Пользователя с таким E-mail не существует" });
    }
  }

  async verify(req, res) {
    try {
      const cookie = req.cookies.jwt;
      console.log(req.cookies)
      const claims = jwt.verify(cookie, process.env.SECRET_KEY);


      if (!claims) {
        return res.status(401).send({ message: "Неавторизирован" });
      }

      const user = await prisma.user.findUnique({
        where: { id: claims.id },
      });

      res.send(user);
    } catch (e) {
      return res.status(401).send({ message: "Неавторизирован" });
    }
  }

  async logout(req, res) {
    res.cookie("jwt", "", { maxAge: 0 });
    res.send({
      message: 'success',
    });
  }

  async getUser(req, res){
    const {id} = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })
    res.json(user)
  }
}

module.exports = new UserController();
