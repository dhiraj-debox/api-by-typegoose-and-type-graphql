import {Query, Resolver, Mutation, Arg, Ctx} from 'type-graphql'
import { CreateUserInput, LoginInput, User } from '../schema/user.schema'
import UserService from '../service/user.service';
import Context from '../types/context'


// type-graphql not know this is a resolve so we have to mention that this is a resolve by @resolver
@Resolver()
export default class UserResolver {

    constructor(private userService: UserService){
        this.userService = new UserService()
    }

    @Mutation(() => User)
    createUser(@Arg('input') input: CreateUserInput){   
        return this.userService.createUser(input)
    }

    @Mutation(() => String)  // return  JWT
    login(@Arg("input") input: LoginInput, @Ctx() context: Context){
        console.log("login")
        return this.userService.login(input, context);
    }

    @Query(() => User, {nullable: true})  // Query me is going to return User
    me(@Ctx() context: Context){
        return context.user
    }
}