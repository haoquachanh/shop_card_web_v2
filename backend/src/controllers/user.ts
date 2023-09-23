import { Request, Response } from 'express';
import { dataSource } from '../datasource';
import { Brackets } from 'typeorm';
import { User } from '../entities/User';

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
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.role', 'role')
        .skip(skip)
        .take(pageSize)
        
      
      if (roleParam) {
        queryBuilder.where('users.role = :roleParam', {roleParam})
      }

      if (sortParam){
        const [field, order] = sortParam.split(':');
        queryBuilder.orderBy(`users.${field}`, order as 'ASC' | 'DESC');
      }

      if (searchKeyword) {
        queryBuilder.andWhere(new Brackets(qb => {
          qb.where('LOWER(users.username) LIKE LOWER(:searchKeyword)', {
            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
          });
          qb.orWhere('LOWER(users.fullname) LIKE LOWER(:searchKeyword)', {
            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
          });
          qb.orWhere('LOWER(users.email) LIKE LOWER(:searchKeyword)', {
            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
          });
        }));
      }
      

      const users= await queryBuilder.getMany();
      const count= await queryBuilder.getCount();

      if (count === 0) return res.status(200).json({
        err:1,
        mes: "No have any users"
    })


      let pageNum=Math.ceil(count/pageSize)
      if (page>pageNum) return res.status(404).json({
        err: 1,
        mes: "Page not found"
      })

      res.status(200).json({
        err: 0,
        mes: `Got ${count} users.`,
        pageSize: pageSize,
        pageNum: pageNum,
        page: page,
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
      let id = parseInt(req.params?.id as string);

      const userRepository = dataSource.getRepository(User);
      
      // Tìm người dùng theo ID
      const user = await userRepository.findOne({ where: { id } });
      
      // if (user) {
      //   await userRepository
      //     .createQueryBuilder('user')
      //     .relation(User, 'users')
      //     .of(user)
      //     .loadMany();
      
      //   // console.log(user.users);
      // }
      
      res.status(200).json({
        err: 0,
        mes: "Got user.",
        data: user
      })
      // const users = await userRepository.find({
      //   where: { users: user },
      //   relations: ['card'], 
      // });
    } 
    catch (error) {
      console.log(error.message);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      let {password, email,fullname} = req.body
      if (!(email&&password)) return res.status(400).json({
        err:1,
        mes: "Missing email or password"
      })
      
      const userRepository = dataSource.getRepository(User);

      let existed = await userRepository.findOne({where: {email: email}});
      if (existed) 
        return res.status(409).json({
          err: 1,
          mes: "Email already exists"
        })

      let newUser = new User(password,fullname,email)

      await userRepository.save(newUser);
  
      res.status(201).json({
        err: 0,
        mes: 'User created successfully',
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error:'+error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      let {email,fullname,phone,birth} = req.body
      if (!(email||phone||fullname||birth)) return res.status(400).json({
        err: 1,
        mes: "Did not get any information."
      })
      
      const userRepository = dataSource.getRepository(User);

      let updateUser = await userRepository.findOne({where: {email: email}});
      if (!updateUser) 
        return res.status(404).json({
          err: 1,
          mes: "User not found"
        })

      updateUser.email= req.body.email
      updateUser.fullname= req.body.fullname
      updateUser.birth= req.body.birth
      updateUser.phone= req.body.phone

      await userRepository.save(updateUser);
  
      res.status(200).json({
        err: 0,
        mes: 'User updated successfully',
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error:'+error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const  id  = parseInt(req.params.id);
      const userRepository = dataSource.getRepository(User);
      let deleteUser = await userRepository.findOne({where: {id: id}});
      if (!deleteUser) 
        return res.status(404).json({
          err: 1,
          mes: "User not found"
        })
      await userRepository.remove(deleteUser);
      res.status(200).json({
        err: 0,
        mes: "User deleted successfully"
      })
    } 
    catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UserController;
