const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class collectionController {
  async create(req, res) {
    const { name, description, games } = req.body;
    const isExist = await prisma.collection.findFirst({
      where: {
        name: name,
      },
    });
    if (isExist) {
      res.json({ message: "Такая подборка уже существует" });
    } else {
      const collection = await prisma.collection.create({
        data: {
          name: name,
          description: description,
        },
      });
      for (let item in games){
        const game = await prisma.game.findUnique({
            where: {
                name: item
            }
        })
        const update = await prisma.game.update({
            where:{
                id: game.id,
            },
            data: {
                collectionId: collection.id
            }
        })
      }
      res.json({
        status: 200,
        message: "Статья добавлена добавлен",
      });
    }
  }

  async getAll(req, res) {
    const collections = await prisma.collection.findMany();

    res.json(collections);
  }
}

module.exports = new collectionController();
