import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { Pinecone } from '@pinecone-database/pinecone';

const filePath = 'source-files';

export const run = async () => {
  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';

  const PINECONE_NAME_SPACE = 'pdf-test';
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ?? '',
  });
  try {
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new PDFLoader(path),
    });

    const rawDocs = await directoryLoader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('docs: ', docs.length);

    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: 'text',
    });

    console.log('complete.');
  } catch (error) {
    console.log('error: ', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();

})();
