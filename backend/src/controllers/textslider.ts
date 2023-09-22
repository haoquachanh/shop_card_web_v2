import { Request, Response } from 'express';
import { dataSource } from '../datasource';
import { TextSlider } from '../entities/TextSlider';
import { Brackets } from 'typeorm';

class TextSliderController {
    async getAll(req: Request, res: Response) {
    try {
        const theRepository = dataSource.getRepository(TextSlider);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const roleParam = req.query.roleParam as string; // Tham số để lọc theo loại
        const sortParam = req.query.sort as string; // Tham số để sắp xếp
        const searchKeyword = req.query.search as string;
        const skip = (page - 1) * pageSize;
    
        console.log(page, pageSize, skip, sortParam)
        const queryBuilder = await theRepository
            .createQueryBuilder('textSlider')
            .skip(skip)
            .take(pageSize)
        

        if (sortParam){
            const [field, order] = sortParam.split(':');
            queryBuilder.orderBy(`textSlider.${field}`, order as 'ASC' | 'DESC');
        }

        if (searchKeyword) {
            queryBuilder.andWhere(new Brackets(qb => {
            qb.where('LOWER(textSlider.text) LIKE LOWER(:searchKeyword)', {
                searchKeyword: `%${searchKeyword.toLowerCase()}%`,
            });
            }));
        }
        

        const users= await queryBuilder.getMany();
        const count= await queryBuilder.getCount();

        let pageNum=Math.ceil(count/pageSize)
        if (page>pageNum) return res.status(404).json({
            err: 1,
            mes: "Page not found"
        })

        res.status(200).json({
            err: 0,
            mes: `Got ${count} sliders.`,
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

            const theRepository = dataSource.getRepository(TextSlider);
            let slider= await theRepository.findOne({where: {id:id}})            
            if (!slider) return res.status(404).json({
                err: 1,
                mes: "Slider not found"
            })

            res.status(200).json({
            err: 0,
            mes: "Got slider",
            data: slider
            })
        } 
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response) {
    try {
        let {text,status,index} = req.body
        if (!(text&&status&&index)) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 
        const theRepository = dataSource.getRepository(TextSlider);
        let slider:TextSlider=req.body

        await theRepository.save(slider);
        res.status(200).json({
        err: 0,
        mes: "Slider created successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    }

    async update(req: Request, res: Response) {
    try {
        let id = parseInt(req.params.id);
        let {text,status,index} = req.body
        if (!(text||status||index)||!id) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 
        const theRepository = dataSource.getRepository(TextSlider);
        let slider:TextSlider
        slider = await theRepository.findOne({where: {id:id}})
        slider.index = index
        slider.status = status
        slider.text = text

        await theRepository.save(slider);
        res.status(200).json({
        err: 0,
        mes: "Slider updated successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    }

    async delete(req: Request, res: Response) {
    try {
        const  id  = parseInt(req.params.id);
        const userRepository = dataSource.getRepository(TextSlider);
        let deleter = await userRepository.findOne({where: {id: id}});
        if (!deleter) 
        return res.status(404).json({
            err: 1,
            mes: "Slider not found"
        })
        await userRepository.remove(deleter);
        res.status(200).json({
        err: 0,
        mes: "Slider deleted successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    }
}

export default TextSliderController;
