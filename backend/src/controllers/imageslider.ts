import { Request, Response } from 'express';
import { dataSource } from '../datasource';
import { ImageSlider } from '../entities/ImageSlider';
import { Brackets } from 'typeorm';
import { Image } from '../entities/Image';
import RemoveImage from '../helper/remover';

class ImageSliderController {
    async getAll(req: Request, res: Response) {
    try {
        const theRepository = dataSource.getRepository(ImageSlider);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const sortParam = req.query.sort as string; // Tham số để sắp xếp
        const searchKeyword = req.query.search as string;
        const skip = (page - 1) * pageSize;
    
        console.log(page, pageSize, skip, sortParam)
        const queryBuilder = await theRepository
            .createQueryBuilder('imageSlider')
            .leftJoin('imageSlider.img', 'img')
            .addSelect(['img.imgSrc'])
            .skip(skip)
            .take(pageSize)
        

        if (sortParam){
            const [field, order] = sortParam.split(':');
            queryBuilder.orderBy(`imageSlider.${field}`, order as 'ASC' | 'DESC');
        }

        if (searchKeyword) {
            queryBuilder.andWhere(new Brackets(qb => {
            qb.where('LOWER(imageSlider.text) LIKE LOWER(:searchKeyword)', {
                searchKeyword: `%${searchKeyword.toLowerCase()}%`,
            });
            }));
        }
        

        const sliders= await queryBuilder.getMany();
        const count= await queryBuilder.getCount();

        if (count === 0) return res.status(200).json({
            err:1,
            mes: "No have any textslider"
        })

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
            data: sliders
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

            const theRepository = dataSource.getRepository(ImageSlider);
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
        let {status,index} = req.body
        // if (!(status&&index)) return res.status(400).json({
        if (!(status&&index&&req.file)) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 

        const theRepository = dataSource.getRepository(ImageSlider);
        let slider:ImageSlider=req.body
        let newImg = new Image()
        newImg.imgSrc = req.file.path

        
        newImg = await dataSource.getRepository(Image).save(newImg)
        slider.img = newImg

        
        await theRepository.save(slider);
        res.status(200).json({
        err: 0,
        mes: "Slider created successfully"
        })
        
    } 
    catch (error) {
        if (req.file) {
            RemoveImage(req.file.path)
            console.log("Deleted public")
        }
        res.status(500).json({ error: 'Internal server error '+ error.message });
    }
    }

    async update(req: Request, res: Response) {
    try {
        let id = parseInt(req.params.id);
        let {status,index} = req.body
        if (!(status||index)||!id) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 
        const theRepository = dataSource.getRepository(ImageSlider);
        let slider:ImageSlider
        slider = await theRepository.findOne({where: {id:id}})
        if (!slider) return res.status(404).json({
            err: 1,
            mes: "Slider not found"
        })

        if (index) slider.index = index
        if (status) slider.status = status
        // if (imgSrc) slider.img = img

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
        const deleter = await dataSource.getRepository(ImageSlider)
            .createQueryBuilder('imageSlider')
            .leftJoinAndSelect('imageSlider.img', 'img')
            .where('imageSlider.id = :id', { id: id })
            .getOne();
        if (!deleter) 
        return res.status(404).json({
            err: 1,
            mes: "Slider not found"
        })
        RemoveImage(deleter.img.imgSrc)
        
        await dataSource.getRepository(Image).remove(deleter.img);
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

export default ImageSliderController;
