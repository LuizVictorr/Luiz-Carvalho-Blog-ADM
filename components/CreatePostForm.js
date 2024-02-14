// components/CreatePostForm.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebase from '../firebase';
import styles from '../components/css/CreatePostForm.module.css'
import { FaDivide } from 'react-icons/fa';
import Link from 'next/link';

const CreatePostForm = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Obter a data atual
  const currentDate = new Date();
  const date = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await firebase.ref('categories').once('value');
        const categoriesData = response.val();

        console.log('Categorias do Firebase:', categoriesData);

        if (categoriesData) {
          const categoriesArray = Object.keys(categoriesData).map((categoryId) => ({
            id: categoryId,
            name: categoriesData[categoryId].name,
          }));
          setAvailableCategories(categoriesArray);
        } else {
          console.error('Nenhuma categoria encontrada no Firebase.');
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCreatePost = async () => {
    try {
      const newPostRef = firebase.ref('posts').push();

      const categoriesData = tempSelectedCategories.reduce((acc, category, index) => {
        acc[index] = category;
        return acc;
      }, {});

      await newPostRef.set({
        postId: newPostRef.key,
        title,
        content,
        date,
        categories: categoriesData,
        images: imageUrl, // Adicionando a URL da imagem
      });

      setTitle('');
      setContent('');
      setSelectedCategories([]);
      setTempSelectedCategories([]);
      setNewCategory('');
      setImageUrl('');

      alert('Post criado com sucesso!');
      // Redirecionar de volta para a página de administração após criar
      router.push('/');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert('Erro ao criar post. Por favor, tente novamente.');
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '' && !tempSelectedCategories.includes(newCategory.trim())) {
      setTempSelectedCategories([...tempSelectedCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleInputCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  return (
    <div className={styles.container}>
    <div className={styles.block}>
      <h1>Criar Novo Post</h1>
      <div className={styles.formGroup}>
        <label className={styles.label}>Título:</label>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>URL da Imagem:</label>
        <input
          className={styles.input}
          type="text"
          value={imageUrl}
          onChange={handleImageUrlChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Adicionar Categoria:</label>
        <input
          className={styles.input}
          type="text"
          value={newCategory}
          onChange={handleInputCategoryChange}
        />
        <button className={styles.button} type="button" onClick={handleAddCategory}>
          Adicionar Categoria
        </button>
      </div>
      <div className={styles.formGroup}>
        <p className={styles.label}>Categorias Selecionadas:</p>
        <ul className={styles.categoryList}>
          {tempSelectedCategories.map((category, index) => (
            <li key={index} className={styles.categoryItem}>
              {category}
            </li>
          ))}
        </ul>
      </div>
      <hr className={styles.divider} />
      <div className={styles.formGroup}>
        <label className={styles.label}>Conteúdo:</label>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className={styles.btnContainer}>
        <button className={styles.button} type="button" onClick={handleCreatePost}>
          Criar Post
        </button>
        <Link href="/" className={styles.button}>
          Voltar
        </Link>
      </div>
    </div>
    </div>
  );
};

export default CreatePostForm;
