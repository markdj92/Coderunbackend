import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRequestDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(user : UserRequestDto) : Promise<UserRequestDto> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = new this.userModel({...user, password : hashedPassword});
        return newUser.save();
    }

    async validateUser(user : UserRequestDto) : Promise<any> {
        const user_info = await this.userModel.findOne({email : user.email});
        if (!user_info || !await bcrypt.compare(user.password, user_info.password)){
            throw new UnauthorizedException('Invalid email or password');
        }
        return "Success";
    }
}
