// pages/admin/edit/[postId].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import firebase from '../../../firebase';
import styles from '../../../styles/Edit.module.css'

const EditPost = () => {
  const router = useRouter();
  const { postId } = router.query;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        if (postId) {
          const snapshot = await firebase.ref(`posts/${postId}`).once('value');
          const postData = snapshot.val();

          if (postData) {
            setTitle(postData.title);
            setContent(postData.content);
            setDate(postData.date);
            setCategories(postData.categories || []); // Se o post não tiver categorias, define como um array vazio
            setImageUrl(postData.images || ''); // Adicionando a URL da imagem
          } else {
            console.error('Post não encontrado');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do post:', error);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleSaveChanges = async () => {
    try {
      await firebase.ref(`posts/${postId}`).update({
        title,
        content,
        date,
        categories,
        images: imageUrl, // Adicionando a URL da imagem
      });

      alert('Post atualizado com sucesso!');
      // Redirecionar de volta para a página de administração após salvar
      router.push('/');
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      alert('Erro ao atualizar post. Por favor, tente novamente.');
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (category) => {
    const updatedCategories = categories.filter((c) => c !== category);
    setCategories(updatedCategories);
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  return (
    <div className={styles.container}>
    <div className={styles.block}>
      <h2>Editar Post</h2>
      <div>
        <label className={styles.label}>Título:</label>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className={styles.label}>Data:</label>
        <input
          className={styles.input}
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <label className={styles.label}>URL da Imagem:</label>
        <input
          className={styles.input}
          type="text"
          value={imageUrl}
          onChange={handleImageUrlChange}
        />
      </div>
      <div>
      <div>
          <label className={styles.label}>Adicionar Categoria:</label>
          <input
            className={styles.input}
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className={styles.button} type="button" onClick={handleAddCategory}>
            Adicionar
          </button>
        </div>
        <ul className={styles.categoryList}>
          {categories.map((category) => (
            <div className={styles.category}>
            <li key={category} className={styles.categoryItem}>
              {category}
            </li>
            <button
            className={styles.delButton}
            type="button"
            onClick={() => handleDeleteCategory(category)}
          >
            Deletar
          </button>
          </div>
          ))}
        </ul>
        <hr className={styles.divider} />
      </div>
      <div>
        <label className={styles.label}>Conteúdo:</label>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className={styles.btnContainer}>
      <button className={styles.button} type="button" onClick={handleSaveChanges}>
        Salvar Mudanças
      </button>

      <Link href="/" className={styles.button}>
        Voltar
      </Link>
      </div>
    </div>
    </div>
  );
};

export default EditPost;
