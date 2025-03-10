/* eslint-disable react/jsx-props-no-spreading */
import Link from 'next/link';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
