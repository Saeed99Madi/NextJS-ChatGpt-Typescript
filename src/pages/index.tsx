import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="container">
      <h1>AI Assistant</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link
          href="/text-chat"
          className="p-6 text-center rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-bold mb-4">Chat Assistant</h2>
          <p>Have a conversation with AI</p>
        </Link>

        <Link
          href="/image-generator"
          className="p-6 text-center rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-bold mb-4">Image Generator</h2>
          <p>Create images with AI</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
