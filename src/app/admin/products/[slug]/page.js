"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from '../../../admin/admin.module.css';

const EditProductPage = ({ params }) => {
  const router = useRouter();
  const { slug } = params;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingImage, setDeletingImage] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    images: [],
    specifications: {},
    inStock: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загрузка категорий
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Загрузка данных товара
        const productResponse = await fetch(`/api/products/${slug}`);
        const productData = await productResponse.json();
        
        if (productData) {
          setFormData({
            name: productData.name || '',
            description: productData.description || '',
            price: productData.price || '',
            categoryId: productData.categoryId || '',
            images: productData.images || [],
            specifications: productData.specifications || {},
            inStock: productData.inStock !== undefined ? productData.inStock : true
          });

          // Инициализация редактора с существующим описанием
          if (productData.description) {
            try {
              // Пробуем распарсить как JSON
              const contentState = ContentState.createFromText(
                typeof productData.description === 'string' && productData.description.startsWith('{')
                  ? JSON.parse(productData.description).blocks.map(block => block.text).join('\n')
                  : productData.description
              );
              setEditorState(EditorState.createWithContent(contentState));
            } catch (error) {
              // Если не удалось распарсить, используем как обычный текст
              const contentState = ContentState.createFromText(productData.description);
              setEditorState(EditorState.createWithContent(contentState));
            }
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    
    // Сохраняем только текст из блоков
    const plainText = contentState.getPlainText();
    
    setFormData(prev => ({
      ...prev,
      description: plainText
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    try {
      const uploadedUrls = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Ошибка при загрузке изображения');
        }
        
        const data = await response.json();
        uploadedUrls.push(data.url);
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      alert('Ошибка при загрузке изображений');
    }
  };

  const handleDeleteImage = async (imageUrl, index) => {
    if (!confirm('Вы уверены, что хотите удалить это изображение?')) {
      return;
    }
    
    setDeletingImage(index);
    
    try {
      const response = await fetch('/api/upload/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: imageUrl }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при удалении изображения');
      }
      
      // Удаляем изображение из массива
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      alert('Ошибка при удалении изображения');
    } finally {
      setDeletingImage(null);
    }
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/products/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка при обновлении товара');
      }
    } catch (error) {
      console.error('Ошибка при обновлении товара:', error);
      alert('Ошибка при обновлении товара');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Редактирование товара</h1>
      
      <form onSubmit={handleSubmit} className={styles.productForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Название товара *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            wrapperClassName={styles.editorWrapper}
            editorClassName={styles.editorContent}
            toolbarClassName={styles.editorToolbar}
            toolbar={{
              options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'history'],
              inline: {
                options: ['bold', 'italic', 'underline', 'strikethrough'],
              },
            }}
            placeholder="Введите описание товара..."
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="price">Цена</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="categoryId">Категория</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">Выберите категорию</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="images">Изображения</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
          />
          {formData.images.length > 0 && (
            <div className={styles.imagePreview}>
              {formData.images.map((image, index) => (
                <div key={index} className={styles.imageWrapper}>
                  <div className={styles.imageContainer}>
                    <img src={image} alt={`Preview ${index + 1}`} />
                  </div>
                  <button 
                    type="button" 
                    className={styles.deleteImageButton}
                    onClick={() => handleDeleteImage(image, index)}
                    disabled={deletingImage === index}
                    title="Удалить изображение"
                  >
                    <Image 
                      src="/trash.svg" 
                      alt="Удалить" 
                      width={16} 
                      height={16} 
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            <label htmlFor="inStock">В наличии</label>
          </div>
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="button" 
            onClick={() => router.push('/admin')}
            className={styles.cancelButton}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage; 