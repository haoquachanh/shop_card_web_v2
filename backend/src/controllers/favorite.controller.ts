import { Request, Response } from 'express';
import { Favorite } from '../entities/Favorite.entity';
import { User } from '../entities/User.entity';
// import { connectToDatabase } from '../connection';
import { dataSource } from '../datasource';

class FavoriteController {
    async getAllFavorites(req: Request, res: Response) {
      try {
        console.log(req.query)
        const favoriteRepository = dataSource.getRepository(Favorite);
        console.log(favoriteRepository)

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const type = req.query.type as string; // Tham số để lọc theo loại
        const sortParam = req.query.sort as string; // Tham số để sắp xếp
        const skip = (page - 1) * pageSize;
        
        console.log(page, pageSize, skip, sortParam)
        const queryBuilder = await favoriteRepository
          .createQueryBuilder('favorite')
          .leftJoinAndSelect('favorite.image', 'favoriteimage')
          .skip(skip)
          .take(pageSize)
        
        if (type) {
          queryBuilder.where('favorite.type = :type', {type})
        }

        if (sortParam){
          const [field, order] = sortParam.split(':');
          queryBuilder.orderBy(`favorite.${field}`, order as 'ASC' | 'DESC');
        }

        const favorites= await queryBuilder.getMany();

        res.status(200).json({
          err: 0,
          mes: favorites.length>0 ? "Got all favorites." : "No have any favorites.",
          pageSize: pageSize,
          data: favorites
        })
      } 
      catch (error) {
        res.status(500).json({
          err: -1,
          mes: "Iternal Error: " + error.message,
        });
      }
    }

  async getFavoriteById(req: Request, res: Response) {
    try {
      let id = parseInt(req.params?.id as string);

      const userRepository = dataSource.getRepository(User);
      
      // Tìm người dùng theo ID
      const user = await userRepository.findOne({ where: { id } });
      
      if (user) {
        await userRepository
          .createQueryBuilder('user')
          .relation(User, 'favorites')
          .of(user)
          .loadMany();
      
        console.log(user.favorites);
      }
      
      res.status(200).json({
        err: 0,
        mes: "Got ",
        data: user.favorites
      })
      // const favorites = await favoriteRepository.find({
      //   where: { users: user },
      //   relations: ['card'], 
      // });
    } 
    catch (error) {
      console.log(error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createFavorite(req: Request, res: Response) {
    try {
      const favoriteRepository = dataSource.getRepository(Favorite);
      await favoriteRepository.save({});
  
      res.status(201).json({
        err: 0,
        mes: 'Created successfully',
      });
    } catch (error) {
      console.error('Lỗi khi tạo lá bài:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateFavorite(req: Request, res: Response) {
    try {
      const { id } = req.params;
    } 
    catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteFavorite(req: Request, res: Response) {
    try {
      const { id } = req.params;
    } 
    catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default FavoriteController;
