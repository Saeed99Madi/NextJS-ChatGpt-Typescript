import { ChangeEvent, useState } from 'react';

const MyPage = () => {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (data.error) {
        setAnswer(`${data.error} ${data.suggestion || ''}`);
      } else if (data.imageUrl) {
        setAnswer(
          `<img src="${data.imageUrl}" alt="Generated image" style="max-width: 100%; height: auto;" />`,
        );
      } else {
        setAnswer('Unexpected response format');
      }
    } catch (error) {
      setAnswer('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
  }

  return (
    <div className="container">
      <h1>AI Image Generator</h1>
      <form className="our-form" onSubmit={handleSubmit}>
        <input
          className="prompt-field"
          type="text"
          onChange={handleChange}
          placeholder="Describe the image you want to create..."
          value={prompt}
        />
        <button type="submit" className="prompt-button">
          Generate
        </button>
      </form>

      {isLoading && <div className="loading-spinner" />}

      <div
        className="answer-area"
        dangerouslySetInnerHTML={{ __html: answer }}
      />
    </div>
  );
};

export default MyPage;
