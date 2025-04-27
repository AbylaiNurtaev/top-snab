import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      );
    }

    // Конвертируем файл в буфер
    const buffer = Buffer.from(await file.arrayBuffer());

    // Генерируем уникальное имя файла
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;

    // Создаем команду для загрузки в S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uniqueFilename}`,
      Body: buffer,
      ContentType: file.type,
    });

    // Загружаем файл в S3
    await s3Client.send(command);

    // Формируем URL для доступа к файлу
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${uniqueFilename}`;

    return NextResponse.json({
      url: fileUrl,
    });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить файл' },
      { status: 500 }
    );
  }
} 