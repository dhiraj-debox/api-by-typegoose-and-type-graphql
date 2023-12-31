import { CreateProductInput, GetProductInput, ProductModel } from "../schema/product.schema";
import { User } from "../schema/user.schema";


class ProductService {
    async createProduct(input: CreateProductInput & {user: User["_id"]}){
        return ProductModel.create(input)
    }

    async findProducts(){
        // Pagination login
        return ProductModel.find()
    }

    async findSingleProduct(input: GetProductInput){
        return ProductModel.findOne(input).lean()
    }
}

export default ProductService