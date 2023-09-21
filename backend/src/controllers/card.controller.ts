import { Request, Response } from 'express';
import { Card } from '../entities/Card.entity';
import { CardImage } from '../entities/CardImage.entity';
// import { connectToDatabase } from '../connection';
import { dataSource } from '../datasource';
import { Brackets } from 'typeorm';

class CardController {
    async getAllCards(req: Request, res: Response) {
      try {
        const cardRepository = dataSource.getRepository(Card);

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const type = req.query.type as string; // Tham số để lọc theo loại
        const sortParam = req.query.sort as string; // Tham số để sắp xếp
        const searchKeyword = req.query.search as string;
        const maxDef =req.query.maxDef as string;
        const minDef =req.query.minDef as string;
        const maxAtk =req.query.maxAtk as string;
        const minAtk =req.query.minAtk as string;
        const skip = (page - 1) * pageSize;
        
        console.log(page, pageSize, skip, sortParam)
        const queryBuilder = await cardRepository
          .createQueryBuilder('card')
          .leftJoinAndSelect('card.image', 'cardimage')
          .skip(skip)
          .take(pageSize)
        
        if (type) {
          queryBuilder.where('card.type = :type', {type})
        }

        if (sortParam){
          const [field, order] = sortParam.split(':');
          queryBuilder.orderBy(`card.${field}`, order as 'ASC' | 'DESC');
        }

        if (searchKeyword) {
          queryBuilder.andWhere(new Brackets(qb => {
            qb.where('LOWER(card.name) LIKE LOWER(:searchKeyword)', {
              searchKeyword: `%${searchKeyword.toLowerCase()}%`,
            });
            qb.orWhere('LOWER(card.info) LIKE LOWER(:searchKeyword)', {
              searchKeyword: `%${searchKeyword.toLowerCase()}%`,
            });
            qb.orWhere('LOWER(card.effect) LIKE LOWER(:searchKeyword)', {
              searchKeyword: `%${searchKeyword.toLowerCase()}%`,
            });
          }));
        }
        
        
        if (minAtk) {
          queryBuilder.andWhere('card.atk >= :minAtk', { minAtk: parseInt(minAtk) });
        }

        if (maxAtk) {
          queryBuilder.andWhere('card.atk <= :maxAtk', { maxAtk: parseInt(maxAtk) });
        }

        if (minDef) {
          queryBuilder.andWhere('card.def >= :minDef', { minDef: parseInt(minDef) });
        }

        if (maxDef) {
          queryBuilder.andWhere('card.def <= :maxDef', { maxDef: parseInt(maxDef) });
        }

        const cards= await queryBuilder.getMany();

        res.status(200).json({
          err: 0,
          mes: cards.length>0 ? `Got ${cards.length} cards.` : "No have any cards.",
          pageSize: pageSize,
          data: cards
        })
      } 
      catch (error) {
        res.status(500).json({
          err: -1,
          mes: "Iternal Error: " + error.message,
        });
      }
    }

  async getCardById(req: Request, res: Response) {
    try {
      const { id } = req.params;
    } 
    catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createCard(req: Request, res: Response) {
    try {
      const cardRepository = dataSource.getRepository(Card);
      const cardImageRepository = dataSource.getRepository(CardImage);
      console.log(">>>>>>", req.body)
      if (!(req.body.name)) return res.status(400).json({
        err:1,
        mes: "You must put card name in body."
      })
  
      //Create card image first`
      const cardImage = new CardImage();
      //need a middleware upload card image and return its link
      cardImage.linkimg = "link_return_by_middleware_upload_card_image";
      await cardImageRepository.save(cardImage);
  
      //Create card
      const newCard = cardRepository.create({
        ...req.body,
        image: cardImage,
      });
      await cardRepository.save(newCard);
  
      res.status(201).json({
        err: 0,
        mes: 'Created successfully',
      });
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateCard(req: Request, res: Response) {
    try {
      const { id } = req.params;
    } 
    catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteCard(req: Request, res: Response) {
    try {
      const { id } = req.params;
    } 
    catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default CardController;
