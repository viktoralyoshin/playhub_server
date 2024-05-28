const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const generateJWT = (id, email) => {
  return jwt.sign({ id, email }, process.env.SECRET_KEY, { expiresIn: "24h" });
};

class UserController {
  async registration(req, res) {
    const { email, password, username } = req.body;
    const candidate = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (candidate) {
      res.json({ message: "Пользователь с таким E-mail уже существует" });
    } else {
    }
    const hashPassword = await bcrypt.hash(password, 6);
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashPassword,
      },
    });
    const token = generateJWT(user.id, user.email);

    res.json(token);
  }

  async login(req, res) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user){
        const comparePassword = bcrypt.compareSync(password, user.password);
        if(comparePassword){
            const token = generateJWT(user.id, user.email);
            res.json(token)
        } else{
            res.json({message: 'Неверный пароль'})
        }
    } else{
        res.json({message: "Пользователя с таким E-mail не существует"})
    }
  }
}

module.exports = new UserController();
