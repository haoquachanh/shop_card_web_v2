import { Request, Response } from 'express';
import { dataSource } from '../datasource';
import { Comment } from '../entities/Comment';
import { Brackets } from 'typeorm';

class CommentController {
    async getAll(req: Request, res: Response) {
    try {
        const theRepository = dataSource.getRepository(Comment);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const roleParam = req.query.roleParam as string; // Tham số để lọc theo loại
        const sortParam = req.query.sort as string; // Tham số để sắp xếp
        const searchKeyword = req.query.search as string;
        const skip = (page - 1) * pageSize;
    
        console.log(page, pageSize, skip, sortParam)
        const queryBuilder = await theRepository
            .createQueryBuilder('comments')
            .skip(skip)
            .take(pageSize)
        

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


        let pageNum=Math.ceil(count/pageSize)
        if (page>pageNum) return res.status(404).json({
            err: 1,
            mes: "Page not found"
        })

        res.status(200).json({
            err: 0,
            mes: `Got ${count} comments.`,
            pageSize: pageSize,
            pageNum: pageNum,
            page: page,
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
        let {text,rating} = req.body
        console.log(text,    rating)
        if (!(text&&rating)) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter",
            data: `${text} ${rating}`
        }) 
        let comment: Comment
        comment.text=text
        const theRepository = dataSource.getRepository(Comment);
        comment.rating=rating
        comment.status="pending"
        console.log(comment)


        await theRepository.save(comment);
        res.status(200).json({
        err: 0,
        mes: "Comment created successfully"
        })
    } 
    catch (error) {

        res.status(500).json({ err: -1, error: 'Internal server error'+ error.message });
    }
    }

    async update(req: Request, res: Response) {
    try {
        let id = parseInt(req.params.id);
        let {title,status,index,link,theme,name} = req.body
        if (!(title||status||index||link||theme||name)||!id) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 
        const theRepository = dataSource.getRepository(Comment);
        let comment:Comment
        comment = await theRepository.findOne({where: {id:id}})

        if (!comment) return res.status(404).json({
            err: 1,
            mes: "Comment not found",
        })

        // if (index) comment.index = index
        // if (theme) comment.theme = theme
        // if (title) comment.title = title
        // if (link) comment.link = link
        // if (name) comment.name = name
        if (status) comment.status = status
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
