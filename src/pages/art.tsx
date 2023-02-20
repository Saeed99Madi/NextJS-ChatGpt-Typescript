import { ChangeEvent, FormEvent, useState } from 'react';

const MyPage = () => {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch('/api/get-image', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    setAnswer(data.text);
    setIsLoading(false);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
  }

  return (
    <div className="container">
      <h1>What Do You Want a Happy Painting Of?</h1>
      <form className="our-form" onSubmit={handleSubmit}>
        <input className="prompt-field" type="text" onChange={handleChange} />
        <button type="submit" className="prompt-button">
          Go!
        </button>
      </form>

      {isLoading && <div className="loading-spinner" />}

      {isLoading === false && <img src={answer} alt={answer} />}
    </div>
  );
};

export default MyPage;
