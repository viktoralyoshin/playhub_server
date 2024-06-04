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
      for (let i = 0; i < games.length; i++) {
        console.log();
        const game = await prisma.game.findFirst({
          where: {
            name: games[i],
          },
        });
        const update = await prisma.game.update({
          where: {
            id: game.id,
          },
          data: {
            collectionId: collection.id,
          },
        });
      }
      res.json({
        status: 200,
        message: "Подборка добавлена",
      });
    }
  }

  async getAll(req, res) {
    const collections = await prisma.collection.findMany();

    res.json(collections);
  }

  async getGames(req, res) {
    const { id } = req.body;
    const games = await prisma.game.findMany({
      where: {
        collectionId: id
      },
    });
    res.json(games)
  }
}

module.exports = new collectionController();
