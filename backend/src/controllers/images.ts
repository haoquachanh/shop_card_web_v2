import { Request, Response } from "express"
import { dataSource } from "../datasource"
import { Image } from "../entities/Image"
import RemoveImage from "../helper/remover"
import { Brackets } from 'typeorm';
import { Product } from "../entities/Product";
import { ImageSlider } from "../entities/ImageSlider";


class ImagesController{
    async uploadImage(req: Request, res: Response){
        try {
            // let id = parseInt(req.params.id)
            // if (!id) return res.status(400).json({err:1, mes: "Missing id"})
            if (!req.files) return res.status(400).json({err:1, mes: "No files images found"})
    
            // const theImage = await dataSource.getRepository(Image).findOne({where: {id:id}})
            // if (!theImage) return res.status(404).json({err:1, mes: "User not found"})
            for (let i=0; i<req.files.length; i++)
            {
                let newImage = new Image()
                newImage.imgSrc= req.files[i].path
                // newImage.product =  theImage
                await dataSource.getRepository(Image).save(newImage)
            }    
            res.status(200).json({
                err: 0,
                mes: "Upload successful"
            })
    
        } catch (error) {
            if (!req.files) 
            for (let i=0; i<req.files.length; i++)
                RemoveImage(req.files[i].path)
            console.log("Deleted image published")
            res.status(500).json({message: "Iternal Error", error: error.message})
        }
    }    
    async getAll(req: Request, res: Response) {
        try {
            const theRepository = dataSource.getRepository(Image);
            const only = req.query.only
            const page = parseInt(req.query.page as string);
            const pageSize = parseInt(req.query.pageSize as string);
            const filter = req.query.filter as string; // Tham số để lọc theo loại
            const sortParam = req.query.sort as string; // Tham số để sắp xếp
            const searchKeyword = req.query.search as string;
            const skip = (page - 1) * pageSize;
        
            const queryBuilder = await theRepository
                .createQueryBuilder('images')
            queryBuilder
                .leftJoin("images.product","product")
                .addSelect("product.id")

            if (page && pageSize)
                queryBuilder
                .skip(skip)
                .take(pageSize)
            
            if (filter) {
                let filters = filter.split(',') 
                filters.forEach((i)=>{
                    const [field,value] = i.split(':')
                    queryBuilder.where(`images.${field} = :value`, {value})
                })
                }
    
            if (sortParam){
                const [field, order] = sortParam.split(':');
                queryBuilder.orderBy(`images.${field}`, order as 'ASC' | 'DESC');
            }
    
            if (searchKeyword) {
                queryBuilder.andWhere(new Brackets(qb => {
                qb.where('LOWER(images.category) LIKE LOWER(:searchKeyword)', {
                    searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                });
                qb.where('LOWER(images.name) LIKE LOWER(:searchKeyword)', {
                    searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                });
                qb.where('LOWER(images.effect) LIKE LOWER(:searchKeyword)', {
                    searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                });
                qb.where('LOWER(images.material) LIKE LOWER(:searchKeyword)', {
                    searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                });
                qb.where('LOWER(images.cut) LIKE LOWER(:searchKeyword)', {
                    searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                });
                }));
            }
    
            const images= await queryBuilder.getMany();
            const count= await queryBuilder.getCount();
    
            if (count === 0) return res.status(200).json({
                err:1,
                mes: "No have any images"
            })
    
            if (page && pageSize)
            {
                let pageNum=Math.ceil(count/pageSize)
                if (page>pageNum) return res.status(404).json({
                    err: 1,
                    mes: "Page not found"
                })
                res.status(200).json({
                    err: 0,
                    mes: `Got ${count} images.`,
                    pageSize: pageSize,
                    pageNum: pageNum,
                    page: page,
                    data: images
                })
            }
            res.status(200).json({
                err: 0,
                mes: `Got ${count} images.`,
                data: images
            })
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    async setProductId(req: Request, res: Response) {
        try {
            let productId = parseInt(req.params.id)
            let imgIds:number[];
            imgIds = req.body.imgIds
            console.log(imgIds[0])
            const theRepository = dataSource.getRepository(Image);
            const data = await theRepository.createQueryBuilder("images")
                .leftJoin("images.product","product")
                .addSelect("product.id")
                .where("images.id IN (:...ids)", { ids: imgIds })
                .getMany();
            
            let theProduct = await dataSource.getRepository(Product).findOne({where: {id: productId}})
            data.forEach(async (entity) => {
                entity.product = theProduct;
                await theRepository.save(entity);
            });

            res.status(200).json({
                err: 0,
                mes: `Success`,
                data: data
            })
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error'+error.message });
            }
        }
    async addToSlider(req: Request, res: Response) {
        try {
            let imgIds:number[];
            imgIds = req.body.imgIds
            console.log(imgIds[0])
            const theRepository = dataSource.getRepository(Image);
            const data = await theRepository.createQueryBuilder("images")
                .leftJoin("images.product","product")
                .addSelect("product.id")
                .where("images.id IN (:...ids)", { ids: imgIds })
                .getMany();
            
            data.forEach(async (entity) => {
                let theSlider:ImageSlider
                theSlider.product = entity.product
                theSlider.img = entity
                theSlider.status = "active"
                theSlider.index = 6
                await dataSource.getRepository(ImageSlider).save(entity);
            });

            res.status(200).json({
                err: 0,
                mes: `Success`,
                data: data
            })
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error'+error.message });
            }
        }
    async setProductAvt(req: Request, res: Response) {
        try {
            let productId = parseInt(req.params.id)
            let imgId:number;
            imgId = req.body.imgId
            const theImage = await dataSource.getRepository(Image).findOne({where:{id:imgId}})
            
            let theProduct = await dataSource.getRepository(Product).findOne({where: {id: productId}})
            theProduct.avt= theImage
            await dataSource.getRepository(Product).save(theProduct);

            res.status(200).json({
                err: 0,
                mes: `Success`,
            })
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error'+error.message });
            }
        }
    async setProductAvtHover(req: Request, res: Response) {
        try {
            let productId = parseInt(req.params.id)
            let imgId:number;
            imgId = req.body.imgId
            const theImage = await dataSource.getRepository(Image).findOne({where:{id:imgId}})

            let theProduct = await dataSource.getRepository(Product).findOne({where: {id: productId}})
            theProduct.avt_hover= theImage
            await dataSource.getRepository(Product).save(theProduct);

            res.status(200).json({
                err: 0,
                mes: `Success`,
            })
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error'+error.message });
            }
        }
}
    
export default ImagesController

