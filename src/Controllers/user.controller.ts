import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Query, UseGuards,
} from '@nestjs/common';
import { UserService } from '../Services/user.service';
import {BasicAuthGuard} from "../Middleware/AuthGuard";

export type queryPayload = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    searchLoginTerm: string,
    searchEmailTerm: string,
    searchNameTerm: string,
    sortDirection: string
}

@Controller('sa/users')
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Delete()
    async deleteAll() {
        return this.UserService.deleteAll()
    }

    @UseGuards(BasicAuthGuard)
    @Get()
    async getAllUsers(@Query() payload: queryPayload) {
        return this.UserService.getAllUsers(payload)
    }
    @UseGuards(BasicAuthGuard)
    @Get(':id')
    async getOneUser(@Param('id') id: string){
        return await this.UserService.getOneUser(id)
    }
    @UseGuards(BasicAuthGuard)
    @Post()
    async createUser(@Body() createUserPayload) {
        return await this.UserService.createUser(createUserPayload)
    }
    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async deleteUser(@Param('id') id: string){
        return await this.UserService.deleteUser(id)
    }
}