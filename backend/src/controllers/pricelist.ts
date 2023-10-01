import { Request, Response } from 'express';
import { dataSource } from '../datasource';
import { Brackets } from 'typeorm';
import { PriceList } from '../entities/Pricelist';
import { Product } from '../entities/Product';

class PriceListController {
    async getAll(req: Request, res: Response) {
    try {
        const theRepository = dataSource.getRepository(PriceList);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const roleParam = req.query.roleParam as string; // Tham số để lọc theo loại
        const sortParam = req.query.sort as string; // Tham số để sắp xếp
        const searchKeyword = req.query.search as string;
        const skip = (page - 1) * pageSize;
    
        console.log(page, pageSize, skip, sortParam)
        const queryBuilder = await theRepository
            .createQueryBuilder('pricelists')
            .leftJoin('pricelists.product','product')
            .addSelect('product.id')
            .skip(skip)
            .take(pageSize)
        

        if (sortParam){
            const [field, order] = sortParam.split(':');
            queryBuilder.orderBy(`pricelists.${field}`, order as 'ASC' | 'DESC');
        }

        if (searchKeyword) {
            queryBuilder.andWhere(new Brackets(qb => {
            qb.where('LOWER(pricelists.question) LIKE LOWER(:searchKeyword)', {
                searchKeyword: `%${searchKeyword.toLowerCase()}%`,
            });
            qb.orWhere('LOWER(pricelists.answer) LIKE LOWER(:searchKeyword)', {
                searchKeyword: `%${searchKeyword.toLowerCase()}%`,
            });
            }));
        }
        

        const users= await queryBuilder.getMany();
        const count= await queryBuilder.getCount();

        if (count === 0) return res.status(200).json({
            err:1,
            mes: "No have any prices"
        })

        let pageNum=Math.ceil(count/pageSize)
        if (page>pageNum) return res.status(404).json({
            err: 1,
            mes: "Page not found"
        })

        res.status(200).json({
            err: 0,
            mes: `Got ${count} pricelists.`,
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

            const theRepository = dataSource.getRepository(PriceList);
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
        let {size,value,lim1,lim2,material,productId} = req.body
        if (!(size&&value&&lim1&&lim2&&material&&productId)) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 

        let theProduct = await dataSource.getRepository(Product).findOne({where: {id:productId}})
        console.log(theProduct)

        const theRepository = dataSource.getRepository(PriceList);
        let newPrice:PriceList={...req.body, product: theProduct}

        await theRepository.save(newPrice);
        res.status(200).json({
        err: 0,
        mes: "Slider created successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error'+ error.message });
    }
    }

    async update(req: Request, res: Response) {
    try {
        let id = parseInt(req.params.id);
        let {size,value,lim1,lim2,material,productId} = req.body
        if (!(size||value||lim1||lim2||material||productId)||!id) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        })
        const theRepository = dataSource.getRepository(PriceList);
        let priceifo:PriceList
        priceifo = await theRepository.findOne({where: {id:id}})
        if (!priceifo) return res.status(404).json({
            err: 1,
            mes: "PriceList not found",
        })

        let theProduct = await dataSource.getRepository(Product).findOne({where: {id:productId}})
        if (!theProduct) return res.status(404).json({
            err: 1,
            mes: "Product not found",
        })

        if (size) priceifo.size = size
        if (lim1) priceifo.lim1 = lim1
        if (lim2) priceifo.lim2 = lim2
        if (material) priceifo.material = material
        if (value) priceifo.value = value
        // priceifo.product = theProduct

        await theRepository.save(priceifo);
        res.status(200).json({
        err: 0,
        mes: "Slider updated successfully"
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
        const userRepository = dataSource.getRepository(PriceList);
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

export default PriceListController;
