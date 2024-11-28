import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient, Product } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to database');
  }
  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPage = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPage / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      meta: {
        total: totalPage,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException(`No product found for id #${id}`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateProductDtoWithoutId } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: {
        id,
        available: true,
      },
      data: updateProductDtoWithoutId,
    });
  }

  async remove(id: number): Promise<Product> {
    await this.findOne(id);

    return await this.product.update({
      where: {
        id,
      },
      data: { available: false },
    });
  }
}
