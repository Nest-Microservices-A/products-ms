import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient, Product } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to database');
  }
  create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      return this.product.create({
        data: createProductDto,
      });
    } catch (error) {
      throw new RpcException({
        message: 'Error creating product: ' + error.message,
        status: error?.error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;

      const totalPage = await this.product.count({
        where: { available: true },
      });
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
    } catch (error) {
      throw new RpcException({
        message: 'Error finding all products: ' + error.message,
        status: error?.error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.product.findFirst({
        where: {
          id,
          available: true,
        },
      });

      if (!product) {
        throw new RpcException({
          message: `Product with id #${id} not found`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return product;
    } catch (error) {
      console.log({ a: error });
      throw new RpcException({
        message: 'Error finding one product: ' + error.message,
        status: error?.error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
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
    } catch (error) {
      throw new RpcException({
        message: 'Error updating product: ' + error.message,
        status: error?.error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async remove(id: number): Promise<Product> {
    try {
      await this.findOne(id);

      const products = await this.product.update({
        where: {
          id,
        },
        data: { available: false },
      });
      return products;
    } catch (error) {
      throw new RpcException({
        message: 'Error removing product: ' + error.message,
        status: error?.error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async validateProducts(ids: number[]) {
    //saco los duplicados
    ids = Array.from(new Set(ids));
    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        message: 'Some products were not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
