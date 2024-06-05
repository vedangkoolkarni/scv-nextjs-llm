import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { RunnableSequence } from 'langchain/schema/runnable';
import { VectorStoreRetriever } from 'langchain/vectorstores/base';

const QA_TEMPLATE = `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

<context>
  {context}
</context>

Question: {question}
Helpful answer in markdown:`;

const combineDocumentsFn: any = (docs: Document[], separator = '\n\n') => {
  const serializedDocs = docs.map((doc: any) => doc.pageContent);
  return serializedDocs.join(separator);
};

const makeChain = (retriever: VectorStoreRetriever) => {
  const answerPrompt = ChatPromptTemplate.fromTemplate(QA_TEMPLATE);

  const model = new ChatOpenAI({
    temperature: 0, // 0 because we dont want any creativity
    modelName: 'gpt-3.5-turbo',
  });

  // Retrieve documents based on a query, then format them.
  const retrievalChain = retriever.pipe(combineDocumentsFn);

  // Generate an answer to the standalone question based on the chat history
  // and retrieved documents. Additionally, we return the source documents directly.
  const answerChain = RunnableSequence.from([
    {
      context: RunnableSequence.from([
        (input) => input.question,
        retrievalChain,
      ]),
      question: (input) => input.question,
    },
    answerPrompt,
    model,
    new StringOutputParser(),
  ]);

  const conversationalRetrievalQAChain = RunnableSequence.from([
    {
      question: (input) => input.question,
    },
    answerChain,
  ]);

  return conversationalRetrievalQAChain;
}

export async function GET(request: Request, res: Response) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  return Response.json({ query });
}

export async function POST(request: Request, res: Response) {

  const body = await request.json();
  const { query } = body;
  const sanitizedQuestion = query.trim().replaceAll('\n', ' ');
  console.log('sanitizedQuestion: ', sanitizedQuestion);
  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';
  const PINECONE_NAME_SPACE = 'pdf-test';
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ?? '',
  });
  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
      },
    );

    const retriever = vectorStore.asRetriever({});

    const chain = makeChain(retriever);

    const response = await chain.invoke({
      question: sanitizedQuestion,
    });

    console.log('response', response);
    return Response.json({text: response});
  } catch (error: any) {
    console.log('error', error);
    return Response.json({error: error.message});
  }
}
