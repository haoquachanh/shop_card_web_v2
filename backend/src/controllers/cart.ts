import { Request, Response } from 'express';
import { dataSource } from '../datasource';
import { Brackets } from 'typeorm';
import { Cart } from '../entities/Cart';
import { Product } from '../entities/Product';
import { User } from '../entities/User';

class CartController {
    async getAll(req: Request, res: Response) {
    try {
        let userId= res.locals.jwtPayload.userId
        const theRepository = dataSource.getRepository(Cart);
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 20;
        const sortParam = req.query.sort as string; // Tham số để sắp xếp
        const searchKeyword = req.query.search as string;
        const skip = (page - 1) * pageSize;
    
        const queryBuilder = await theRepository
            .createQueryBuilder('carts')
            .where("carts.userId = :userId", {userId: userId})
            .skip(skip)
            .take(pageSize)
        

        if (sortParam){
            const [field, order] = sortParam.split(':');
            queryBuilder.orderBy(`carts.${field}`, order as 'ASC' | 'DESC');
        }

        if (searchKeyword) {
            queryBuilder.andWhere(new Brackets(qb => {
            qb.where('LOWER(carts.question) LIKE LOWER(:searchKeyword)', {
                searchKeyword: `%${searchKeyword.toLowerCase()}%`,
            });
            qb.orWhere('LOWER(carts.answer) LIKE LOWER(:searchKeyword)', {
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
            mes: `Got ${count} carts.`,
            pageSize: pageSize,
            pageNum: pageNum,
            page: page,
            data: users
        })
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async get(req: Request, res: Response) {
        try {
            let userId= res.locals.jwtPayload.userId
            let id = parseInt(req.params.id)
            if (!id) return res.status(400).json({
                err: 1,
                mes: "Missing required parameter"
            }) 

            const theRepository = dataSource.getRepository(Cart);
            let item= await theRepository.findOne({where: {id:id }})  
            if (!item) return res.status(404).json({
                err: 1,
                mes: "Cart item not found"
            })

            res.status(200).json({
            err: 0,
            mes: "Got cart item",
            data: item
            })
        } 
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req: Request, res: Response) {
    try {
        let userId=res.locals.jwtPayload?.userId||1 
        //number 1 for test! DELETE when run!!!!!!!! and catch error
        if (!userId) return res.status(500).json({
            err: 1,
            mes: "Missing user." 
        })


        let {size,effect,quantity,isDesigned,material,img_src,price,sides,name,productId} = req.body
        if (!(size&&effect&&quantity&&isDesigned&&material&&img_src&&price&&sides&&name&&productId)) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 

        let newCart= new Cart()
        let user = await dataSource.getRepository(User).findOne({where:{id: userId}})
        if (!user) return res.status(404).json({
            err: 1,
            mes: "User not found"
        })

        let product = await dataSource.getRepository(Product).findOne({where:{id: productId}})
        if (!product) return res.status(404).json({
            err: 1,
            mes: "Product not found"
        })


        newCart.sides = sides
        newCart.size = size
        newCart.img_src = img_src
        newCart.effect = effect
        newCart.isDesigned = isDesigned
        newCart.material = material
        newCart.name = name
        newCart.price = price
        newCart.quantity = quantity 
        newCart.user=user
        newCart.product=product
        

        console.log(newCart)
        const theRepository = dataSource.getRepository(Cart);

        await theRepository.save(newCart);
        res.status(200).json({
        err: 0,
        mes: "Cart created successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error'+ error.message });
    }
    }

    async update(req: Request, res: Response) {
    try {
        let id = parseInt(req.params.id);
        let {size,effect,quantity,isDesigned,material,img_src,price,sides,name,productId} = req.body
        if (!(size||effect||quantity||isDesigned||material||productId||img_src||price||sides||name)||!id) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        })
        const theRepository = dataSource.getRepository(Cart);
        let updater:Cart
        updater = await theRepository.findOne({where: {id:id}})
        if (!updater) return res.status(404).json({
            err: 1,
            mes: "Cart not found",
        })

        // let theProduct = await dataSource.getRepository(Product).findOne({where: {id:productId}})
        // if (!theProduct) return res.status(404).json({
        //     err: 1,
        //     mes: "Product not found",
        // })

        if (size) updater.size = size
        if (effect) updater.effect = effect
        if (img_src) updater.img_src =img_src
        if (material) updater.material = material
        if (price) updater.price = price
        if (name) updater.name = name
        if (sides) updater.sides = sides
        if (quantity) updater.quantity = quantity
        if (isDesigned) updater.isDesigned = isDesigned
        // updater.product = theProduct

        await theRepository.save(updater);
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
        const theRepository = dataSource.getRepository(Cart);
        let deleter = await theRepository.findOne({where: {id: id}});
        if (!deleter) 
        return res.status(404).json({
            err: 1,
            mes: "Cart not found"
        })
        await theRepository.remove(deleter);
        res.status(200).json({
        err: 0,
        mes: "Cart deleted successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
    }
}

export default CartController;
