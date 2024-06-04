const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class GenreController {
  async create(req, res) {
    const { name } = req.body;
    const isExist = await prisma.genre.findFirst({
      where: {
        name: name,
      }
    });
    if (isExist) {
      res.json({ message: "Такой жанр уже существует" });
    } else {
      const genre = await prisma.genre.create({
        data: {
            name: name
        },
      });
      res.json({
        "status": 200,
        "message":"Жанр добавлен"
      });
    }
  }

  async getAll(req, res){
    const genres = await prisma.genre.findMany();

    res.json(genres)
  }

}

module.exports = new GenreController();
