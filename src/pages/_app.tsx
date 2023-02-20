/* eslint-disable react/jsx-props-no-spreading */
import Link from 'next/link';
import '../styles/globals.css';

import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Component {...pageProps} />
      <div className="footer">
        <p>
          <Link href="/">Text</Link>
          <Link href="/art">Art</Link>
        </p>
      </div>
    </>
  );
};

export default MyApp;
