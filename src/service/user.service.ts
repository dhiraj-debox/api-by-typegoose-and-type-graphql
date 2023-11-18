import { signJwt } from "../lib/jwt";
import { CreateUserInput, LoginInput, UserModel } from "../schema/user.schema";
import Context from "../types/context";
import {ApolloError} from 'apollo-server-errors'
import bcrypt from 'bcrypt'

class UserService {
    async createUser(input: CreateUserInput){
        // Call user model to creare a user

        return UserModel.create(input)
    }

    async login(input: LoginInput, context: Context){
        const e = 'Invalid email or password'
        // Get our user by email
        const user =   await UserModel.find().findByEmail(input.email).lean();

        if(!user) {
            console.log("user not found")
            return new ApolloError(e)
        }
        // validate the password
        const passwordIsValid = await bcrypt.compare(input.password, user.password);
        if(!passwordIsValid){
            console.log("password id incorrecft")
            return new ApolloError(e)
        }
        // sign a jwt
        const token = signJwt(user)

        // set a cookie for the user
        context.res.cookie("accessToken", token, {
            maxAge: 3.154e10, // 1 year
            httpOnly: true,
            domain: "localhost",
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production',
        })
        // return the jwt

        return token
    }
}

export default UserService