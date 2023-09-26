import { Request, Response } from 'express';
import { dataSource } from '../datasource';
import { Brackets } from 'typeorm';
import { Order } from '../entities/Order';
import { Product } from '../entities/Product';
import { User } from '../entities/User';
import generateOrderCode from '../helper/generaterCode';
import { OrderItem } from '../entities/OrderItem';

class OrderController {
    async getAll(req: Request, res: Response) {
    try {
        const theRepository = dataSource.getRepository(Order);
        const sortParam = req.query.sort as string; // Tham số để sắp xếp
    
        const queryBuilder = await theRepository
            .createQueryBuilder('orders')
        if (sortParam){
            const [field, order] = sortParam.split(':');
            queryBuilder.orderBy(`orders.${field}`, order as 'ASC' | 'DESC');
        }

        const orders= await queryBuilder.getMany();
        const count= await queryBuilder.getCount();

        if (count === 0) return res.status(200).json({
            err:1,
            mes: "No have any prices"
        })

        res.status(200).json({
            err: 0,
            mes: `Got ${count} orders.`,
            data: orders
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

            const theRepository = dataSource.getRepository(Order);
            let theOrder= await theRepository.findOne({where: {id:id}, relations: {items: true}});            
            if (!theOrder) return res.status(404).json({
                err: 1,
                mes: "Order not found"
            })

            res.status(200).json({
            err: 0,
            mes: "Got order",
            data: theOrder
            })
        } 
        catch (error) {
            res.status(500).json({ error: 'Internal server error', mes: error.message });
        }
    }

    async create(req: Request, res: Response) {
    try {

        let userId=res.locals.jwtPayload?.userId||16
        //number 1 for test! DELETE when run!!!!!!!! and catch error
        if (!userId) return res.status(500).json({
            err: 1,
            mes: "Missing user." 
        })

        const items:OrderItem[]=req.body.items
        let {status,address,phone,nameReceive} = req.body
        if (!(status&&address&&phone&&nameReceive&&items)) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 

        let user = await dataSource.getRepository(User).findOne({where:{id: userId}})
        if (!user) return res.status(404).json({
            err: 1,
            mes: "User not found"
        })

        let newOrder= new Order()
        newOrder.orderCode = generateOrderCode()
        newOrder.user = user
        newOrder.nameReceive = nameReceive
        newOrder.address = address
        newOrder.phone = phone
        newOrder.status = status
        newOrder.items=[]
        const theRepository = dataSource.getRepository(Order);
        newOrder = await theRepository.save(newOrder);


        // for (const obj of items) {
        for (let i=0; i< items.length; i++) {
            let newItem = new OrderItem()
            newItem=items[i]
            newItem.order=newOrder
            // console.log(">>>>>product index: ",req.body.items[i].product)
            let product = await dataSource.getRepository(Product).findOne({where: {id: parseInt(req.body.items[i].product)}})
            
            newItem.product=product
            newItem = await dataSource.getRepository(OrderItem).save(newItem);
            

            newOrder.items.push(newItem);
          }

        // let product = await dataSource.getRepository(Product).findOne({where:{id: 1}})
        // if (!product) return res.status(404).json({
        //     err: 1,
        //     mes: "Product not found"
        // })


        // newOrder.sides = sides
        // newOrder.size = size
        // newOrder.img_src = img_src
        // newOrder.effect = effect
        // newOrder.isDesigned = isDesigned
        // newOrder.material = material
        // newOrder.name = name
        // newOrder.price = price
        // newOrder.quantity = quantity 
        // newOrder.user=user
        // newOrder.product=product
        

        res.status(200).json({
        err: 0,
        mes: "Order created successfully"
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error'+ error.message });
    }
    }

    async updateItem(req: Request, res: Response) {
    try {
        let id = parseInt(req.params.id);
        let {name,sides,img_src,isDesigned,quantity,material,effect,size} = req.body
        if (!(name||sides||img_src||isDesigned||quantity||material||effect||size)) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 
        const theRepository = dataSource.getRepository(OrderItem);
        let updater:OrderItem
        updater = await theRepository.findOne({where: {id:id}})
        if (!updater) return res.status(404).json({
            err: 1,
            mes: "Order item not found",
        })

        // let theProduct = await dataSource.getRepository(Product).findOne({where: {id:productId}})
        // if (!theProduct) return res.status(404).json({
        //     err: 1,
        //     mes: "Product not found",
        // })

        if (name) updater.name = name
        if (sides) updater.sides = sides
        if (img_src) updater.img_src =img_src
        if (quantity) updater.quantity = parseInt(quantity)
        if (isDesigned) updater.isDesigned = isDesigned
        if (material) updater.material = material
        if (effect) updater.effect = effect
        if (size) updater.size = size

        console.log(updater)
        await theRepository.save(updater);
        res.status(200).json({
        err: 0,
        mes: "Order item updated successfully"
        })
    } 
    catch (error) {
        res.status(500).json({ error: 'Internal server error',
    mes: error.message });
    }
    }
    async update(req: Request, res: Response) {
    try {
        let id = parseInt(req.params.id);
        let {status,address,phone,nameReceive} = req.body
        if (!(status||address||phone||nameReceive)) return res.status(400).json({
            err: 1,
            mes: "Missing required parameter"
        }) 
        const theRepository = dataSource.getRepository(Order);
        let updater:Order
        updater = await theRepository.findOne({where: {id:id}})
        if (!updater) return res.status(404).json({
            err: 1,
            mes: "Order not found",
        })

        // let theProduct = await dataSource.getRepository(Product).findOne({where: {id:productId}})
        // if (!theProduct) return res.status(404).json({
        //     err: 1,
        //     mes: "Product not found",
        // })

        if (status) updater.status = status
        if (address) updater.address = address
        if (phone) updater.phone =phone
        if (nameReceive) updater.nameReceive = nameReceive

        await theRepository.save(updater);
        res.status(200).json({
        err: 0,
        mes: "Order updated successfully"
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
        const theRepository = dataSource.getRepository(Order);
        let deleter = await theRepository
            .createQueryBuilder('orders')
            .leftJoinAndSelect('orders.items','items')
            .where('orders.id = :id',{id: id})
            .getOne()
        if (!deleter) 
        return res.status(404).json({
            err: 1,
            mes: "Order not found"
        })
        for (let i=0; i<deleter.items.length; i++) 
            await dataSource.getRepository(OrderItem).remove(deleter.items[i]);
        await theRepository.remove(deleter);
        
        res.status(200).json({
        err: 0,
        mes: "Order deleted successfully"
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
    }

    async deleteItem(req: Request, res: Response) {
    try {
        const  id  = parseInt(req.params.id);
        const theRepository = dataSource.getRepository(OrderItem);
        let deleter = await theRepository.findOne({where: {id: id}})
        if (!deleter) 
        return res.status(404).json({
            err: 1,
            mes: "Order item not found"
        })
        await theRepository.remove(deleter);
        
        res.status(200).json({
        err: 0,
        mes: "Order item deleted successfully"
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
    }
}

export default OrderController;
