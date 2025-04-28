"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from '../../../admin/admin.module.css';

const NewProductPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        console.log('Полученные категории:', data);
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

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
    
    setUploading(true);
    
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
    } finally {
      setUploading(false);
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
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка при создании товара');
      }
    } catch (error) {
      console.error('Ошибка при создании товара:', error);
      alert('Ошибка при создании товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Добавление нового товара</h1>
      
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
            disabled={uploading}
          />
          {uploading && <p>Загрузка изображений...</p>}
          {formData.images.length > 0 && (
            <div className={styles.imagePreview}>
              {formData.images.map((image, index) => (
                <img key={index} src={image} alt={`Preview ${index + 1}`} />
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="inStock">В наличии</label>
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
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
            disabled={loading || uploading}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProductPage; 