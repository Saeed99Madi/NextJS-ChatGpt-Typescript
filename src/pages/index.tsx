import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1>AI Assistant</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <button
          onClick={() => router.push('/text-chat')}
          className="p-6 text-center rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-bold mb-4">Chat Assistant</h2>
          <p>Have a conversation with AI</p>
        </button>

        <button
          onClick={() => router.push('/image-generator')}
          className="p-6 text-center rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-bold mb-4">Image Generator</h2>
          <p>Create images with AI</p>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
