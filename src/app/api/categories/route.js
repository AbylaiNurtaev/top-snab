import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Получение списка категорий
export async function GET(request) {
  try {
    await client.connect();
    const database = client.db('top-snab');
    const categories = database.collection('categories');

    const result = await categories.find({}).toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении категорий' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// Создание новой категории
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, slug } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Название категории обязательно' },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db('top-snab');
    const categories = database.collection('categories');

    // Проверяем, существует ли категория с таким slug
    const existingCategory = await categories.findOne({ 
      slug: slug || name.toLowerCase().replace(/\s+/g, '-') 
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Категория с таким URL-идентификатором уже существует' },
        { status: 400 }
      );
    }

    const newCategory = {
      name,
      description: description || '',
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await categories.insertOne(newCategory);
    
    return NextResponse.json({
      _id: result.insertedId,
      ...newCategory
    }, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании категории:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании категории' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 