const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const calculateRating = async (gameId) => {
  let rating = 0;

  const reviews = await prisma.review.findMany({
    where: {
      gameId: gameId,
    },
  });

  for (let i = 0; i < reviews.length; i++) {
    rating += reviews[i]["mark"];
  }

  rating = Math.round(rating / reviews.length);

  await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
        mark: rating,
    }
  });
};

class ReviewController {
  async create(req, res) {
    const { mark, title, text, gameId, userId } = req.body;
    const isExist = await prisma.review.findFirst({
      where: {
        userId: userId,
        gameId: gameId
      }
    });
    if (isExist) {
      res.json({ message: "Вы уже поставили оценку этой игре" });
    } else {
      const review = await prisma.review.create({
        data: {
          mark: mark,
          title: title,
          text: text,
          gameId: gameId,
          userId: userId,
        },
      });

      calculateRating(gameId);

      res.json({
        "status": 200,
        "message":"Отзыв добавлен"
      });
    }
  }

  async check (req, res) {
    const {id} = req.body;

    const review = await prisma.review.findFirst({
      where: {
        userId: id
      }
    })

    if(review){
      res.send({message: "true"})
    } else{
      res.send({message: "false"})
    }

  }

}

module.exports = new ReviewController();
