const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class articleController {
  async create(req, res) {
    const { title, text, tagName, userId } = req.body;
    const tag = await prisma.tag.findFirst({
      where: {
        name: tagName,
      },
    });
    const article = await prisma.article.create({
      data: {
        title: title,
        text: text,
        tagId: tag.id,
        userId: userId,
      },
    });
    res.json({
      status: 200,
      message: "Статья добавлена",
    });
  }

  async getAll(req, res) {
    const articles = await prisma.article.findMany();

    res.json(articles);
  }

  async get(req, res) {
    const { userId } = req.body;
    const articles = await prisma.article.findMany({
      where: {
        userId: userId,
      },
    });

    res.json(articles);
  }
}

module.exports = new articleController();
