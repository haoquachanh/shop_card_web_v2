import { Request, Response } from "express"
import { dataSource } from "../datasource"
import { Product } from "../entities/Product"
import { Image } from "../entities/Image"
import RemoveImage from "../helper/remover"

async function uploadImage(req: Request, res: Response){
    try {
        // let id = parseInt(req.params.id)
        // if (!id) return res.status(400).json({err:1, mes: "Missing id"})
        if (!req.files) return res.status(400).json({err:1, mes: "No files images found"})

        // const theProduct = await dataSource.getRepository(Product).findOne({where: {id:id}})
        // if (!theProduct) return res.status(404).json({err:1, mes: "User not found"})
        for (let i=0; i<req.files.length; i++)
        {
            let newImage = new Image()
            newImage.imgSrc= req.files[i].path
            // newImage.product =  theProduct
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
    
export default uploadImage


