import { Request, Response } from 'express';
import { dataSource } from '../datasource';
import { Comment } from '../entities/Comment';
import { Brackets } from 'typeorm';
import { User } from '../entities/User';
import { Product } from '../entities/Product';

class CommentController {
    async getAll(req: Request, res: Response) {
    try {
        const theRepository = dataSource.getRepository(Comment);
        const roleParam = req.query.roleParam as string; // Tham số để lọc theo loại
        const sortParam = req.query.sort as string; // Tham số để sắp xếp
        const searchKeyword = req.query.search as string;
    
        const queryBuilder = await theRepository
            .createQueryBuilder('comments')

        if (sortParam){
            const [field, order] = sortParam.split(':');
            queryBuilder.orderBy(`comments.${field}`, order as 'ASC' | 'DESC');
        }

        const users= await queryBuilder.getMany();
        const count= await queryBuilder.getCount();

        if (count === 0) return res.status(200).json({
            err:1,
            mes: "No have any comment information"
        })

        res.status(200).json({
            err: 0,
            mes: `Got ${count} comments.`,
            data: users
        })
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async get(req: Request, res: Response) {
        try {
            let id = parseInt(req.params.id)
            if (!id) return res.status(400).json({
                err: 1,
                mes: "Missing required parameter"
            }) 

            const theRepository = dataSource.getRepository(Comment);
            let comment= await theRepository.findOne({where: {id:id}})            
            if (!comment) return res.status(404).json({
                err: 1,
                mes: "Comment not found"
            })

            res.status(200).json({
            err: 0,
            mes: "Got comment",
            data: comment
            })
        } 
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response) {
    try {
        console.log('Chạy dô đây rồi nè')
        let userId= res.locals.jwtPayload.userId
        if (!(req.body.text&&req.body.rating)) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter",
        }) 
        let theUser= await dataSource.getRepository(User).findOne({where:{id:userId}})
        let theProduct= await dataSource.getRepository(Product).findOne({where:{id:req.body.productId}})
        let comment= new Comment()
        comment.text=req.body.text
        comment.rating=req.body.rating
        comment.user=theUser
        comment.product=theProduct
        comment.status="pending"
        console.log(">>>>>",comment)


        await dataSource.getRepository(Comment).save(comment);
        res.status(200).json({
        err: 0,
        mes: "Comment created successfully"
        })
    } 
    catch (error) {

        res.status(500).json({ err: -1, error: 'Internal server error '+ error.message });
    }
    }

    async update(req: Request, res: Response) {
    try {
        let id = parseInt(req.params.id);
        let {text,rating} = req.body
        if (!(text||rating)||!id) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 
        const theRepository = dataSource.getRepository(Comment);
        let comment = await theRepository.findOne({where: {id:id}})

        if (!comment) return res.status(404).json({
            err: 1,
            mes: "Comment not found",
        })
        
        comment.text=text
        comment.rating=rating
        await theRepository.save(comment);
        res.status(200).json({
        err: 0,
        mes: "Comment updated successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error'  });
    }
    }

    async delete(req: Request, res: Response) {
    try {
        const  id  = parseInt(req.params.id);
        const userRepository = dataSource.getRepository(Comment);
        let deleter = await userRepository.findOne({where: {id: id}});
        if (!deleter) 
        return res.status(404).json({
            err: 1,
            mes: "Comment not found"
        })
        await userRepository.remove(deleter);
        res.status(200).json({
        err: 0,
        mes: "Comment deleted successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    }
}

export default CommentController;
