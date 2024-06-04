const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TagController {
  async create(req, res) {
    const { name } = req.body;
    const isExist = await prisma.tag.findFirst({
      where: {
        name: name,
      }
    });
    if (isExist) {
      res.json({ message: "Такой тег уже существует" });
    } else {
      const tag = await prisma.tag.create({
        data: {
            name: name
        },
      });
      res.json({
        "status": 200,
        "message":"Тег добавлен"
      });
    }
  }

  async getAll(req, res){
    const genres = await prisma.genre.findMany();

    res.json(genres)
  }

}

module.exports = new TagController();
