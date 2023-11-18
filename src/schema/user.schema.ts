import {Field,InputType,ObjectType} from 'type-graphql';
import bcrypt from 'bcrypt';
import {AsQueryMethod} from '@typegoose/typegoose/lib/types'
import {Prop, getModelForClass, pre, ReturnModelType, queryMethod, index} from '@typegoose/typegoose';
import {IsEmail, MinLength, MaxLength} from 'class-validator'

function findByEmail(this: ReturnModelType<typeof User, QueryHelpers>, email: User['email']){
    return this.findOne({email})
}

interface QueryHelpers {
    findByEmail: AsQueryMethod<typeof findByEmail>
}

// type-graphql not know this is a decorator so we have to mention that this is a decorator by @ObjectId
@pre<User>('save', async function(){
    // Check that the password is being modified
    // isModified --> isModified returns true if the password is being modified else false
    if(!this.isModified('password')){
        return 
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hashSync(this.password, salt);

    this.password = hash
})

@index({email: 1})
@queryMethod(findByEmail)
@ObjectType()
export class User {
    @Field(() => String) // ---> Graphql type
    _id: string;         // ---> typescript type ( which helps us at client level)

    @Field(() => String) // --->Graphql type ( which helps us at client level)
    @Prop({ requied: true})   // --->  Mongodb type
    name: string; 
    
    @Field(() => String)
    @Prop({required: true})
    email: string;

    @Prop({ required : true})
    password: string;
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User);

@InputType()
export class CreateUserInput {
    @Field(() => String)  // ---> graphql type
    name: string;         // ----> typescript type

    @IsEmail()
    @Field(() => String)  // ---> graphql type
    email: string;         

    @MinLength(6, {
        message: "Password must be at least 6 characters long"
    })
    @MaxLength(12, {
        message: "Password must no be longer than 12 characters long"
    })
    @Field(() => String)  // ---> graphql type
    password: string;         

}

@InputType()
export class LoginInput {
    @Field(() => String)    
    email : string;

    @Field(() => String)
    password: string
}