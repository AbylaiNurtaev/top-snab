"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загрузка товаров
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        setProducts(productsData.products || []);

        // Загрузка категорий
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData || []);

        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteProduct = async (slug) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        const response = await fetch(`/api/products/${slug}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Обновляем список товаров после удаления
          setProducts(products.filter(product => product.slug !== slug));
        } else {
          alert('Ошибка при удалении товара');
        }
      } catch (error) {
        console.error('Ошибка при удалении товара:', error);
        alert('Ошибка при удалении товара');
      }
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Панель администратора</h1>
      
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'products' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Товары
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'categories' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Категории
        </button>
      </div>
      
      {loading ? (
        <div className={styles.loading}>Загрузка данных...</div>
      ) : (
        <>
          {activeTab === 'products' && (
            <div className={styles.productsSection}>
              <div className={styles.sectionHeader}>
                <h2>Управление товарами</h2>
                <Link href="/admin/products/new" className={styles.addButton}>
                  Добавить товар
                </Link>
              </div>
              
              <div className={styles.productsTable}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Категория</th>
                      <th>Цена</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>
                          {categories.find(cat => cat._id === product.categoryId)?.name || 'Без категории'}
                        </td>
                        <td>{product.price ? `${product.price} ₽` : 'Не указана'}</td>
                        <td className={styles.actions}>
                          <Link href={`/admin/products/${product.slug}`} className={styles.editButton}>
                            Редактировать
                          </Link>
                          <button 
                            onClick={() => handleDeleteProduct(product.slug)}
                            className={styles.deleteButton}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'categories' && (
            <div className={styles.categoriesSection}>
              <div className={styles.sectionHeader}>
                <h2>Управление категориями</h2>
                <Link href="/admin/categories/new" className={styles.addButton}>
                  Добавить категорию
                </Link>
              </div>
              
              <div className={styles.categoriesTable}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Количество товаров</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => (
                      <tr key={category._id}>
                        <td>{category.name}</td>
                        <td>
                          {products.filter(product => product.categoryId === category._id).length}
                        </td>
                        <td className={styles.actions}>
                          <Link href={`/admin/categories/${category._id}`} className={styles.editButton}>
                            Редактировать
                          </Link>
                          <button className={styles.deleteButton}>
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage; 