import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { CustomFieldDto } from '../../common/custom-field.dto';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;

    @IsOptional()
    @IsString({ each: true })
    readonly categories: string[];

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CustomFieldDto)
    readonly customFields: CustomFieldDto[];

    constructor(name: string, price: number, categories: string[], customFields: CustomFieldDto[]) {
        this.name = name;
        this.price = price;
        this.categories = categories;
        this.customFields = customFields;
    }
}