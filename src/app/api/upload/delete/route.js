import { NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL изображения не указан' },
        { status: 400 }
      );
    }

    // Извлекаем ключ объекта из URL
    const urlObj = new URL(url);
    const key = urlObj.pathname.substring(1); // Удаляем начальный слэш

    // Создаем команду для удаления объекта из S3
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    // Удаляем объект из S3
    await s3Client.send(command);

    return NextResponse.json({
      success: true,
      message: 'Изображение успешно удалено',
    });
  } catch (error) {
    console.error('Ошибка при удалении файла:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить файл' },
      { status: 500 }
    );
  }
} 