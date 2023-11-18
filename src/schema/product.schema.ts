import {Field,InputType,ObjectType} from 'type-graphql';
import {prop, Ref, index, getModelForClass} from '@typegoose/typegoose'
import { User } from './user.schema';
import {customAlphabet} from 'nanoid';
import { MinLength, MaxLength, IsNumber, Min} from 'class-validator'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz123456789',10);
console.log(nanoid())

@ObjectType()
@index({productId: 1})
export class Product{
    @Field(() => String)
    _id: string  // reason to define _id over here insted of mongodb is we want to access _id in the client side also

    @Field(() => String)
    @prop({required: true, ref: () => User})
    user: Ref<User>

    @Field(() => String)
    @prop({required: true})
    name: string

    @Field(() => String)
    @prop({required: true})
    description: string

    @Field(() => String)
    @prop({required: true})
    price: string

    @Field(() => String)
    @prop({required: true, default: () => `product_${nanoid()}, unique: true}`})
    productId: string
}

export const ProductModel = getModelForClass<typeof Product>(Product);

@InputType()
export class CreateProductInput{
    @Field()
    name: string

    @MinLength(20, {
        message: "Description must be at least 20 characteres"
    })
    @MaxLength(20, {
        message: "Description must not be more than 20 characteres"
    })
    @Field()
    description: string

    @IsNumber()
    @Min(1)
    @Field()
    price: number
}

@InputType()
export class GetProductInput{
    @Field()
    productId: string
}