const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class GameController {
  async create(req, res) {
    const { name, developer, releaseDate, price, pic, description, cover } = req.body;
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
          cover: cover,
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

  async get(req, res){
    const { id } = req.body;

    const game = prisma.game.findUnique({
      where: {
        id: id
      }
    })
    
    res.JSON(game)

  }
}

module.exports = new GameController();
