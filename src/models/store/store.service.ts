import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store, StoreDocument } from './schema/store.schema';
import { GetStoreListDto } from './dto/get-store-list.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UpdateStorePasswordDto } from './dto/update-store-password.dto';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    ) {}

    createItem({ name, email, password }: CreateStoreDto) {
        const store = new this.storeModel({ name, email, password });
        return store.save();
    }

    getList({ offset, limit }: GetStoreListDto) {
        return this.storeModel.find(
            {},
            '-password',
            { skip: offset * limit, limit }
        );
    }

    getItemById(id: string) {
        return this.storeModel.findById(id, '-password');
    }

    getItem(email: string) {
        return this.storeModel.findOne({ email });
    }

    async comparePassword(id: string, { oldPassword: password }: UpdateStorePasswordDto) {
        const store = await this.storeModel.findById(id);

        if (store && (await bcrypt.compare(password, store.password))) return true;
        return false;
    }

    async doesExistById(id: string) {
        return !!(await this.storeModel.findById(id));
    }

    async doesExist(email: string, name: string) {
        return (await this.storeModel.countDocuments({ $or: [{ email }, { name }] })) > 0;
    }
    
    updateItem(id: string, { name, email }: UpdateStoreDto) {
        return this.storeModel.findByIdAndUpdate(id, { name, email });
    }

    updateItemPasssword(id: string, { newPassword: password }: UpdateStorePasswordDto) {
        return this.storeModel.findByIdAndUpdate(id, { password });
    }

    deleteItem(id: string) {
        return this.storeModel.findByIdAndDelete(id);
    }
}
