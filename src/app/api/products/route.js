import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;

    await client.connect();
    const database = client.db('top-snab');
    const products = database.collection('products');

    let query = {};
    if (category) {
      query.categoryId = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await products.countDocuments(query);
    const result = await products
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      products: result,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении товаров' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.categoryId) {
      return NextResponse.json(
        { error: 'Название и категория товара обязательны' },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db('top-snab');
    const products = database.collection('products');

    const result = await products.insertOne({
      ...body,
      slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании товара' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 