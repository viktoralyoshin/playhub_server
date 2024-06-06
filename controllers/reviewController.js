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
    },
  });
};

class ReviewController {
  async create(req, res) {
    const { mark, title, text, gameId, userId } = req.body;
    const isExist = await prisma.review.findFirst({
      where: {
        userId: userId,
        gameId: gameId,
      },
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

      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      const count = user.reviewCount + 1;
      let level;
      if (count >= 5) {
        level = Math.floor(count / 5)+1;
      } else{
        level = 1;
      }
      const update = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          reviewCount: count,
          level: level,
        },
      });

      calculateRating(gameId);

      res.json({
        status: 200,
        message: update,
      });
    }
  }

  async check(req, res) {
    const { id, gameId } = req.body;

    const review = await prisma.review.findFirst({
      where: {
        userId: id,
        gameId: gameId,
      },
    });

    if (review) {
      res.send({ message: "true" });
    } else {
      res.send({ message: "false" });
    }
  }
}

module.exports = new ReviewController();
