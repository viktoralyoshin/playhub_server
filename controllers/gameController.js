const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

class GameController {
  async create(req, res) {
    const { name, developer, releaseDate, price, description, genreName } =
      req.body;
    const { cover } = req.files;
    const pic = req.files;
    const isExist = await prisma.game.findUnique({
      where: {
        name: name,
      },
    });
    if (isExist) {
      res.json({ message: "Игра с таким именем уже существует" });
    } else {
      let fileName = uuid.v4() + "." + cover.name.split(".").reverse()[0];
      fs.mkdir(path.join(__dirname, "..", `games/${name.replaceAll(' ', '')}`), (err) => {
        if (err) {
          return console.error(err);
        }
        console.log("Папка создана");
      });

      const genre = await prisma.genre.findFirst({
        where: {
          name: genreName
        }
      })

      const game = await prisma.game.create({
        data: {
          name: name,
          developer: developer,
          releaseDate: releaseDate,
          price: price,
          genreId: genre.id,
          description: description,
          cover: `http://92.53.105.185:5000/${name.replaceAll(' ', '')}/${fileName}`,
        },
      });

      cover.mv(path.resolve(__dirname, "..", `games/${game.name.replaceAll(' ', '')}`, fileName));
      for (let item in pic) {
        if (item == "cover") {
          break;
        } else {
          fileName =
            uuid.v4() + "." + pic[`${item}`].name.split(".").reverse()[0];
          pic[`${item}`].mv(
            path.resolve(__dirname, "..", `games/${game.name.replaceAll(' ', '')}`, fileName)
          );
          await prisma.picture.create({
            data: {
              gameId: game.id,
              src: `http://92.53.105.185:5000/${game.name.replaceAll(' ', '')}/${fileName}`,
            },
          });
        }
      }
      res.send({ message: "success" });
    }
  }

  async get(req, res) {
    const { id } = req.body;

    const game = await prisma.game.findUnique({
      where: {
        id: id,
      },
    });

    const reviews = await prisma.review.findMany({
      where: {
        gameId: id
      }
    })

    const images = await prisma.picture.findMany({
      where: {
        gameId: id
      }
    })

    res.json({game: game, reviews: reviews, images: images});
  }

  async getAll(req, res){
    const games = await prisma.game.findMany();

    res.json(games)
  }
}

module.exports = new GameController();