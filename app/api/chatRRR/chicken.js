/**import OpenAI from "openai";

const openai = new OpenAI({
//  apiKey: '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',
});

export async function POST() {
    
  //const { prompt } = await request.json();

    const result = await openai.images.generate({
      model: "dall-e-3",
      prompt: "purple apple on cotton candy",
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    const imageUrl = result.data?.[0]?.url;

    return Response.json({ imageUrl});
}

*/