// pages/admin.js
import React from 'react';
import Link from 'next/link';
import AdminPostList from '../components/AdminPostList';
import styles from '../styles/Index.module.css'

const Admin = () => {
  return (
    <div className={styles.container}>
    <div className={styles.block}>
      <div className={styles.newPost}>
      <h1>Administração</h1>
      <Link href="/admin" className={styles.button}>
        Criar Novo Post
      </Link>
      </div>
      <AdminPostList />
    </div>
    </div>
  );
};

export default Admin;
