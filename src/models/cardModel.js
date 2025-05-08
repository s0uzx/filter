import prisma from "../../prisma/prisma.js";

class CardModel {
  // Obter todas as cartas
  async findAll(raridade, ataque, pagina, limite) {
    if(Number(pagina) < 1) {
      pagina = 1;
    }

    if(Number(limite) < 1 || Number(limite) > 100) {
      limite = 10;
    }

    const skip = (Number(pagina) - 1) * Number(limite);


    const where = {};

     if (raridade) {
        where.rarity = raridade;
      } 

      if (ataque) {
        where.attackPoints = {
          gte: Number(ataque),
        };
      } 
      
    const cards = await prisma.card.findMany({
     /* where: {
        rarity: Ultra Rare,
    }*/
     /* where: {
        attackPoints: {
          lte: 8000,
        },
      }, */

     /* where: {
        attackPoints: {
          gte: Number(ataque),
        },
        rarity: raridade,
      }, */
      skip,
      take: Number(limite),
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        collection: {
          select: {
            name: true,
            description: true,
            releaseYear: true,
          },
        },
      }
    });

    const total = await prisma.card.count({ where });

    // console.log(cards);

    return {cards, total};
  }

  // Obter uma carta pelo ID
  async findById(id) {
    const card = await prisma.card.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        collection: true,
      }
    });

    return card;
  }

  // Criar uma nova carta
  async create(name, rarity, attackPoints, defensePoints, imageUrl, collectionId) {
    const newCard = await prisma.card.create({
      data: {
        name,
        rarity,
        attackPoints, 
        defensePoints,
        imageUrl,
        collectionId: Number(collectionId), 
      },
    });

    return newCard;
  }

  // Atualizar uma carta
  async update(
    id,
        name,
        rarity,
        attackPoints, 
        defensePoints,
        imageUrl,
  ) {
    const card = await this.findById(id);

    if (!card) {
      return null;
    }

    // Atualize a carta existente com os novos dados
    const cardUpdated = await prisma.card.update({
      where: {
        id: Number(id),
      },
      data: {
      name,
        rarity,
        attackPoints,
        defensePoints,
        imageUrl,
        collectionId: Number(collectionId),
      }
    });

    return cardUpdated;
  }

  // Remover uma coleção
  async delete(id) {
    const card = await this.findById(id);

    if (!card) {
      return null;
    }

    await prisma.card.delete({
      where: {
        id: Number(id),
      },
    });

    return true;
  }
}

export default new CardModel();