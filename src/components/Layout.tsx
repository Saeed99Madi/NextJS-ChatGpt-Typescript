import Link from 'next/link';
import { useRouter } from 'next/router';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-lg mb-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 py-4">
            <Link
              href="/"
              className={`nav-link ${
                router.pathname === '/' ? 'text-primary' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/text-chat"
              className={`nav-link ${
                router.pathname === '/text-chat' ? 'text-primary' : ''
              }`}
            >
              Chat
            </Link>
            <Link
              href="/image-generator"
              className={`nav-link ${
                router.pathname === '/image-generator' ? 'text-primary' : ''
              }`}
            >
              Images
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4">{children}</main>
    </div>
  );
};

export default Layout;
