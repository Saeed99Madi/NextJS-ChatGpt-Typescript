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
      json: { (arg0: { text: string | undefined }): void; new (): any };
    };
  },
) {
  if (typeof req.body.prompt === 'string') {
    const response = await openai.createImage({
      prompt: `A wet on wet oil painting of ${req.body.prompt} by Bob Ross.`,
      n: 1,
      size: '512x512',
    });

    res.status(200).json({ text: response.data.data[0].url });
  } else {
    res.status(200).json({
      text: 'https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_1722.jpg',
    });
  }
}
