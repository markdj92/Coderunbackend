import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
    jwtService: any;
    userModel: any;

    async decodeToken(token: string): Promise<ObjectId>  {
        const user = await this.jwtService.decode(token) as { id: ObjectId };
        const id = user?.id;
        return id;
    }

    async verifyToken(token: string): Promise<void>  {
        const user = await this.jwtService.verify(token);
        console.log(user);
    }

    async saveSocketId(token: string, socketId : string): Promise<void>{
        const user = await this.decodeToken(token);
        const updatedData = { socket_id : socketId}; 
        await this.userModel.findByIdAndUpdate(user, updatedData);
    }
    
    async deleteSocketId(token: string): Promise<void>{
        const user = await this.decodeToken(token);
        const updatedData = { socket_id : null}; 
        await this.userModel.findByIdAndUpdate(user, updatedData);
    }

    async getSocketId(token: string): Promise<string>{
        const user = await this.decodeToken(token);
        const found = await this.userModel.findById(user);
        return (await found).socket_id;
    }
      
}