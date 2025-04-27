import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    await client.connect();
    const database = client.db('top-snab');
    const products = database.collection('products');

    const product = await products.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Ошибка при получении товара:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении товара' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();

    await client.connect();
    const database = client.db('top-snab');
    const products = database.collection('products');

    const result = await products.updateOne(
      { slug },
      { 
        $set: {
          ...body,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении товара' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = params;

    await client.connect();
    const database = client.db('top-snab');
    const products = database.collection('products');

    const result = await products.deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при удалении товара:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении товара' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 