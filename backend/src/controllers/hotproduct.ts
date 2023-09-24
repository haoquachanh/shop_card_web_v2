import { Request, Response } from 'express';
import { dataSource } from '../datasource';
import { Brackets } from 'typeorm';
import { HotProduct } from '../entities/HotProduct';
import { Product } from '../entities/Product';

class HotProductController {
    async getAll(req: Request, res: Response) {
    try {
        const theRepository = dataSource.getRepository(HotProduct);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const sortParam = req.query.sort as string; // Tham số để sắp xếp
        const searchKeyword = req.query.search as string;
        const skip = (page - 1) * pageSize;
    
        const queryBuilder = await theRepository
            .createQueryBuilder('hotProduct')
            .skip(skip)
            .take(pageSize)
        

        if (sortParam){
            const [field, order] = sortParam.split(':');
            queryBuilder.orderBy(`hotProduct.${field}`, order as 'ASC' | 'DESC');
        }        

        const users= await queryBuilder.getMany();
        const count= await queryBuilder.getCount();

        if (count === 0) return res.status(200).json({
            err:1,
            mes: "No have any hot products"
        })

        let pageNum=Math.ceil(count/pageSize)
        if (page>pageNum) return res.status(404).json({
            err: 1,
            mes: "Page not found"
        })

        res.status(200).json({
            err: 0,
            mes: `Got ${count} hotProduct.`,
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

            const theRepository = dataSource.getRepository(HotProduct);
            let pricelist= await theRepository.findOne({where: {id:id}})            
            if (!pricelist) return res.status(404).json({
                err: 1,
                mes: "Price not found"
            })

            res.status(200).json({
            err: 0,
            mes: "Got pricelist",
            data: pricelist
            })
        } 
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response) {
    try {
        let {size,rank,effect,material,productId} = req.body
        if (!(size&&rank&&effect&&material&&productId)) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 

        let theProduct = await dataSource.getRepository(Product).findOne({where: {id:productId}})
        console.log(theProduct)

        const theRepository = dataSource.getRepository(HotProduct);
        let newPrice:HotProduct={...req.body, product: theProduct}

        await theRepository.save(newPrice);
        res.status(200).json({
        err: 0,
        mes: "Hot product created successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error'+ error.message });
    }
    }

    async update(req: Request, res: Response) {
    try {
        let id = parseInt(req.params.id);
        let {size,rank,effect,material,productId} = req.body
        if (!(size||rank||effect||material||productId)||!id) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        })
        const theRepository = dataSource.getRepository(HotProduct);
        let hotproductifo:HotProduct
        hotproductifo = await theRepository.findOne({where: {id:id}})
        if (!hotproductifo) return res.status(404).json({
            err: 1,
            mes: "HotProduct not found",
        })

        let theProduct = await dataSource.getRepository(Product).findOne({where: {id:productId}})
        if (!theProduct) return res.status(404).json({
            err: 1,
            mes: "Product not found",
        })

        if (size) hotproductifo.size = size
        if (material) hotproductifo.material = material
        if (effect) hotproductifo.effect = effect
        if (rank) hotproductifo.rank = rank
        // hotproductifo.product = theProduct

        await theRepository.save(hotproductifo);
        res.status(200).json({
        err: 0,
        mes: "Hot product updated successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error',
    mes: error.message });
    }
    }

    async delete(req: Request, res: Response) {
    try {
        const  id  = parseInt(req.params.id);
        const userRepository = dataSource.getRepository(HotProduct);
        let deleter = await userRepository.findOne({where: {id: id}});
        if (!deleter) 
        return res.status(404).json({
            err: 1,
            mes: "Price not found"
        })
        await userRepository.remove(deleter);
        res.status(200).json({
        err: 0,
        mes: "Price deleted successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    }
}

export default HotProductController;
