import { Request, Response } from 'express';
import { dataSource } from '../datasource';
import { Contact } from '../entities/Contact';
import { Brackets } from 'typeorm';

class ContactController {
    async getAll(req: Request, res: Response) {
    try {
        const theRepository = dataSource.getRepository(Contact);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const roleParam = req.query.roleParam as string; // Tham số để lọc theo loại
        const sortParam = req.query.sort as string; // Tham số để sắp xếp
        const searchKeyword = req.query.search as string;
        const skip = (page - 1) * pageSize;
    
        console.log(page, pageSize, skip, sortParam)
        const queryBuilder = await theRepository
            .createQueryBuilder('contacts')
            .skip(skip)
            .take(pageSize)
        

        if (sortParam){
            const [field, order] = sortParam.split(':');
            queryBuilder.orderBy(`contacts.${field}`, order as 'ASC' | 'DESC');
        }

        const users= await queryBuilder.getMany();
        const count= await queryBuilder.getCount();

        if (count === 0) return res.status(200).json({
            err:1,
            mes: "No have any contact information"
        })


        let pageNum=Math.ceil(count/pageSize)
        if (page>pageNum) return res.status(404).json({
            err: 1,
            mes: "Page not found"
        })

        res.status(200).json({
            err: 0,
            mes: `Got ${count} contacts.`,
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

            const theRepository = dataSource.getRepository(Contact);
            let contact= await theRepository.findOne({where: {id:id}})            
            if (!contact) return res.status(404).json({
                err: 1,
                mes: "Contact not found"
            })

            res.status(200).json({
            err: 0,
            mes: "Got contact",
            data: contact
            })
        } 
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response) {
    try {
        let {title,link,index,name,theme} = req.body
        if (!(title&&link&&index&&name&&theme)) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 
        const theRepository = dataSource.getRepository(Contact);
        let contact:Contact=req.body

        await theRepository.save(contact);
        res.status(200).json({
        err: 0,
        mes: "Contact created successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
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
        const theRepository = dataSource.getRepository(Contact);
        let contact:Contact
        contact = await theRepository.findOne({where: {id:id}})

        if (!contact) return res.status(404).json({
            err: 1,
            mes: "Contact not found",
        })

        contact.index = index
        contact.theme = theme
        contact.title = title
        contact.link = link
        contact.name = name
        contact.status = status
        await theRepository.save(contact);
        res.status(200).json({
        err: 0,
        mes: "Contact updated successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error'  });
    }
    }

    async delete(req: Request, res: Response) {
    try {
        const  id  = parseInt(req.params.id);
        const userRepository = dataSource.getRepository(Contact);
        let deleter = await userRepository.findOne({where: {id: id}});
        if (!deleter) 
        return res.status(404).json({
            err: 1,
            mes: "Contact not found"
        })
        await userRepository.remove(deleter);
        res.status(200).json({
        err: 0,
        mes: "Contact deleted successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    }
}

export default ContactController;
