// eslint-disable-next-line import/no-extraneous-dependencies
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: { body: { prompt: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { text: any }): void; new (): any };
    };
  },
) {
  if (typeof req.body.prompt === 'string') {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: req.body.prompt,
      temperature: 0,
      max_tokens: 1000,
    });

    res.status(200).json({ text: response.data.choices[0].text });
  } else {
    res.status(200).json({ text: 'Invalid prompt provided.' });
  }
}
