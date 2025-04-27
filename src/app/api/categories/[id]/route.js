import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Получение категории по ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    await client.connect();
    const database = client.db('top-snab');
    const categories = database.collection('categories');

    let query;
    try {
      // Пробуем найти по ObjectId
      query = { _id: new ObjectId(id) };
    } catch (error) {
      // Если не получилось, ищем по slug
      query = { slug: id };
    }

    const category = await categories.findOne(query);

    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Ошибка при получении категории:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении категории' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// Обновление категории
export async function PUT(request, { params }) {
  try {
    const { id } = params;
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

    let query;
    try {
      // Пробуем найти по ObjectId
      query = { _id: new ObjectId(id) };
    } catch (error) {
      // Если не получилось, ищем по slug
      query = { slug: id };
    }

    // Проверяем, существует ли другая категория с таким slug
    const newSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
    const existingCategory = await categories.findOne({ 
      slug: newSlug,
      _id: { $ne: query._id }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Категория с таким URL-идентификатором уже существует' },
        { status: 400 }
      );
    }

    const result = await categories.updateOne(
      query,
      { 
        $set: {
          name,
          description: description || '',
          slug: newSlug,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при обновлении категории:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении категории' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// Удаление категории
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await client.connect();
    const database = client.db('top-snab');
    const categories = database.collection('categories');
    const products = database.collection('products');

    let query;
    try {
      // Пробуем найти по ObjectId
      query = { _id: new ObjectId(id) };
    } catch (error) {
      // Если не получилось, ищем по slug
      query = { slug: id };
    }

    // Проверяем, есть ли товары в этой категории
    const category = await categories.findOne(query);
    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    const productsCount = await products.countDocuments({ categoryId: category._id.toString() });
    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'Невозможно удалить категорию, содержащую товары' },
        { status: 400 }
      );
    }

    const result = await categories.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении категории' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 