import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose"
import { IsNotEmpty } from 'class-validator';

export enum RoomStatus {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
}

export enum RoomMode {
    STUDY = 'STUDY',
    COOPERATIVE  = 'COOPERATIVE'
}

@Schema({
    timestamps : true
})

export class Room extends Document {

    @Prop({
        required: true,
        unique: true,
    })
    title : string;

    @Prop()
    member_count : number;

    @Prop({required: true})
    max_members : number;

    @Prop({required: true})
    status : RoomStatus;
    
    @Prop({ default: null })
    password : string;
    
    @Prop({required: true, default : 1})
    level : number;

    @Prop({required: true, default : 'STUDY'})
    mode : RoomMode;

    @Prop({default : true})
    ready : boolean; 

    @Prop()
    create_time : Date;
}

export const RoomSchemas  = SchemaFactory.createForClass(Room);