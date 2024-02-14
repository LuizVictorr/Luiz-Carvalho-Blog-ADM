// components/AdminForm.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebase from '../firebase';

const AdminForm = () => {
  const router = useRouter();
  const { postId } = router.query;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    // Carregar dados do post se postId estiver presente
    const fetchPostData = async () => {
      try {
        if (postId) {
          const snapshot = await firebase.ref(`posts/${postId}`).once('value');
          const postData = snapshot.val();

          if (postData) {
            setTitle(postData.title);
            setContent(postData.content);
            setDate(postData.date);
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

  const generatePostId = (title) => {
    // Gera um postId substituindo espaços por "-"
    return title.trim().replace(/\s+/g, '-');
  };

  const handleCreateBlog = async () => {
    try {
      const newPostRef = firebase.ref('posts').child(postId || generatePostId(title));

      // Atualizar o post existente se postId estiver presente
      await newPostRef.set({
        title,
        content,
        date,
        postId: postId || generatePostId(title),
      });

      setTitle('');
      setContent('');
      setDate('');

      alert(postId ? 'Blog atualizado com sucesso!' : 'Blog criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar/atualizar o blog:', error);
      alert('Erro ao criar/atualizar o blog. Por favor, tente novamente.');
    }
  };

  const handleDeleteBlog = async () => {
    try {
      if (postId) {
        // Excluir o post se postId estiver presente
        await firebase.ref(`posts/${postId}`).remove();

        // Redirecionar de volta para a lista de posts após excluir
        router.push('/admin');
      }
    } catch (error) {
      console.error('Erro ao excluir o blog:', error);
      alert('Erro ao excluir o blog. Por favor, tente novamente.');
    }
  };

  return (
    <form>
      <label>
        Título:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label>
        Conteúdo:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </label>

      <label>
        Data:
        <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      <button type="button" onClick={handleCreateBlog}>
        {postId ? 'Atualizar Blog' : 'Criar Blog'}
      </button>

      {postId && (
        <button type="button" onClick={handleDeleteBlog} style={{ marginLeft: '10px', color: 'red' }}>
          Excluir Blog
        </button>
      )}
    </form>
  );
};

export default AdminForm;
