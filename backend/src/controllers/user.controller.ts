import { Request, Response } from 'express';
import { User } from '../entities/User.entity';
import { Role } from '../entities/Role.entity';
import { dataSource } from '../datasource';
import { Favorite } from '../entities/Favorite.entity';
import { isNotEmptyObject, isObject } from 'class-validator';
import { Brackets } from 'typeorm/query-builder/Brackets';

class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {

      const userRepository = dataSource.getRepository(User);

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const roleParam = req.query.roleParam as string; // Tham số để lọc theo loại
      const sortParam = req.query.sort as string; // Tham số để sắp xếp
      const searchKeyword = req.query.search as string;
      const skip = (page - 1) * pageSize;
      
      console.log(page, pageSize, skip, sortParam)
      const queryBuilder = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .skip(skip)
        .take(pageSize)
      
      if (roleParam) {
        queryBuilder.where('user.role = :roleParam', {roleParam})
      }

      if (sortParam){
        const [field, order] = sortParam.split(':');
        queryBuilder.orderBy(`user.${field}`, order as 'ASC' | 'DESC');
      }

      if (searchKeyword) {
        queryBuilder.andWhere(new Brackets(qb => {
          qb.where('LOWER(user.username) LIKE LOWER(:searchKeyword)', {
            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
          });
          qb.orWhere('LOWER(user.fullname) LIKE LOWER(:searchKeyword)', {
            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
          });
          qb.orWhere('LOWER(user.email) LIKE LOWER(:searchKeyword)', {
            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
          });
        }));
      }
      

      const users= await queryBuilder.getMany();

      res.status(200).json({
        err: 0,
        mes: users.length>0 ? `Got ${users.length} users.` : "No have any users.",
        data: users
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        err: -1,
        mes: "Iternal Error",
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const id  = parseInt(req.params?.id);
      
      let user: User
      user=await dataSource.getRepository(User).findOne({where: {id: id}})
      console.log(user)
      res.status(200).json({
        err: 0,
        mes: "Got user",
        data: user
      })

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      console.log(req.body);
      let { username, password, email, fullname, avt } = req.body;
      if (!(username && password && email && fullname && avt)) res.status(400).send()
      let user= new User(username,password,fullname,email,avt)
      user.hashPassword()
      user.role = await dataSource.getRepository(Role).findOne({where: {id:1}});
      console.log(user)

      const userRepository = dataSource.getRepository(User);
      let existingUser : User;
      existingUser  = await userRepository.findOne({where: {email: user.email}});
      if (existingUser ) return res.status(201).json({
        err: 1,
        mes: "email is already exists"
      })

      await dataSource.createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .execute()
      return res.status(200).json({
        err: 0,
        mes: "Created",
        token: ""
      });
          
    } catch (error) {
      
      return res.status(500).send(error.message);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      let { username, password, email, fullname, avt} = req.body
      const id = parseInt(req.params.id);
      try{
        await dataSource.getRepository(User).findOneOrFail({where: {id: id}})
      }
      catch(error) { return res.status(404).json({
        err: 1,
        mes: "User not found"
      }); }
      
      let existingUser  = await dataSource.getRepository(User).findOne({where: {email: email}});
      if (existingUser ) return res.status(201).json({
        err: 1,
        mes: "email is already exists"
      })

      await dataSource
        .createQueryBuilder()
        .update(User)
        .set({username,email,fullname,avt})
        .where("id = :id", { id: id })
        .execute()
      res.status(201).json({
        err: 0,
        mes: "Updated"
      })

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)

      try{
        await dataSource.getRepository(User).findOneOrFail({where: {id: id}})
      }
      catch(error) { return res.status(404).json({
        err: 1,
        mes: "User not found"
      }); }

      let userRepository = await dataSource.getRepository(User)
      await userRepository
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("id = :id", { id: id })
        .execute()
      
      return res.status(200).json({
        err: 0,
        mes: "Deleted"
      })

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getFavorite(req: Request, res: Response) {
    try {
      const id =parseInt(req.params?.id);
      let userRepository = dataSource.getRepository(User)
      let favoriteRepository = dataSource.getRepository(Favorite)

      try{

        let user = await userRepository.findOneOrFail({where: { id: id},
          relations: ['favorites']})
        res.status(200).json({
          err: 0,
          mes: "ok",
          data: user
        })
      }
      catch(error){ res.status(201).json({
        err: 1,
        mes: "User not found!",
      })}

    } catch (error) {
      console.log(error.message)
      res.status(500).json({ error: 'Internal server error' });
    }
  }

}

export default UserController;
