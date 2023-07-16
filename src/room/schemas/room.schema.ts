import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose"


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

export class Room {

    @Prop()
    id : string;

    @Prop()
    title : string;

    @Prop()
    member_count : number;

    @Prop()
    max_members : number;

    @Prop()
    status : RoomStatus;
    
    @Prop()
    password : string;
    
    @Prop()
    level : number;

    @Prop()
    mode : RoomMode;

    @Prop()
    create_time : Date;
}

export const RoomSchemas  = SchemaFactory.createForClass(Room);