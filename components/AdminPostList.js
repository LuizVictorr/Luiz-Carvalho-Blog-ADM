// components/AdminPostList.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import firebase from '../firebase';
import styles from '../components/css/AdminPostList.module.css'
import { FaSearch } from 'react-icons/fa';


const AdminPostList = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 16;
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await firebase.ref('posts').once('value');
        const postList = [];

        snapshot.forEach((childSnapshot) => {
          const postData = childSnapshot.val();
          postList.push({ id: childSnapshot.key, ...postData });
        });

        setPosts(postList);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const results = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(results);
  }, [searchTerm, posts]);

  const deletePost = async (postId) => {
    try {
      await firebase.ref(`posts/${postId}`).remove();
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Erro ao deletar o post:', error);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchResults.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(searchResults.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <h2>Lista de Posts</h2>

      <div className={styles.searchContainer}>
      <FaSearch className={styles.searchIcon} />
      <input
        className={styles.searchInput}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

      <ul className={styles.postGrid}>
        {currentPosts.map((post) => (
          <li key={post.id} className={styles.postGridItem}>
            <Link href={`/admin/edit/${post.id}`}>
              {post.title}
            </Link>
            <button onClick={() => deletePost(post.id)}>Deletar</button>
          </li>
        ))}
      </ul>


      <div className={styles.paginationContainer}>
  <button
    className={styles.paginationButton}
    onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
    disabled={currentPage === 1}
  >
    &#60;
  </button>
  <span className={styles.paginationInfo}>
    Página {currentPage} de {totalPages}
  </span>
  <button
    className={styles.paginationButton}
    onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    &#62;
  </button>
</div>
    </div>
  );
};

export default AdminPostList;
