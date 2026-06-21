import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>
  ) {}
  async productExists(productId: number){
    let product;
    return product;
  }
  async orderExists(orderId: number){
    let order;
    return order;
  }
  async create(createReviewDto: CreateReviewDto, userId: number) {
    const product = await this.productExists(createReviewDto.productId);
    if (!product){
      throw new NotFoundException('Product not found');
    }
    const order = await this.orderExists(createReviewDto.productId);
    if (!order || order.userId !== userId){
      throw new ForbiddenException('You are not the owner of this order');
    }
    if (order.status !== 'delivered'){
      throw new ForbiddenException('You can only review delivered orders');
    }
    const reviewExists = await this.reviewRepository.findOne({where:{productId:createReviewDto.productId, userId:userId}});
    if (reviewExists){
      throw new ForbiddenException('You have already reviewed this product');
    }
    const review = this.reviewRepository.create({
      ...createReviewDto,
      userId:userId
    });
    return this.reviewRepository.save(review);
  }


  async findAll() {
    return this.reviewRepository.find({where:{isActive:true}});
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({where:{id:id, isActive:true}});
    if (!review){
      throw new NotFoundException('Review not found');
    }
    return review;
  }
  async findByProductId(productId: number) {
    const reviews = await this.reviewRepository.find({where:{productId:productId, isActive:true}});
    if (!reviews || reviews.length === 0){
      throw new NotFoundException('No reviews found for this product');
    }
    return reviews;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId: number) {
    const review = await this.reviewRepository.findOne({where:{id:id}});
    if (!review){
      throw new NotFoundException('Review not found');
    }
    if (review.userId !== userId){
      throw new ForbiddenException('You are not the owner of this review');
    }
    const updatedReview = Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(updatedReview);
  }


  async remove(id: number, userId: number) {
    const review = await this.reviewRepository.findOne({where:{id:id}});
    if (!review){
      throw new NotFoundException('Review not found');
    }
    if (review.userId !== userId){
      throw new ForbiddenException('You are not the owner of this review');
    }
    return this.reviewRepository.remove(review);
  }
}
