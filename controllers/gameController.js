const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class GameController {
  async create(req, res) {
    const { name, developer, releaseDate, price, pic, description } = req.body;
    const isExist = await prisma.game.findUnique({
      where: {
        name: name,
      },
    });
    if (isExist) {
      res.json({ message: "Игра с таким именем уже существует" });
    } else {
      const game = await prisma.game.create({
        data: {
          name: name,
          developer: developer,
          releaseDate: releaseDate,
          price: price,
          description: description,
        },
      });
      for (let i = 0; i < pic.length; i++) {
        await prisma.picture.create({
          data: {
            gameId: game.id,
            src: pic[i]["src"],
          },
        });
      }
      res.json(game);
    }
  }
}

module.exports = new GameController();
