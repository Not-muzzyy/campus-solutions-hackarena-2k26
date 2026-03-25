"""
CampusIQ RAG Pipeline
Fixed for Python 3.12+ / LangChain 0.3.x / Pydantic v2
LLaMA 3.1 via Groq + HuggingFace Embeddings + ChromaDB
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPTS = {
    "qa": """You are CampusIQ, an AI assistant for NIMS (Nandi Institute of Management and Science), Ballari, Karnataka (affiliated VSKUB). 6th Semester BCA Final Year.

You have access to college documents. Answer based on the context provided.
If answer is not in context, say: "I don't have this in the uploaded documents. Please check with your faculty."
Be concise, accurate, and helpful.

Context: {context}
Question: {question}
Answer:""",

    "study": """You are CampusIQ Study Helper for BCA final year at NIMS Ballari.
Help understand concepts clearly with examples. Topics: DBMS, Computer Networks, ML, SE, Python.
Context: {context}
Question: {question}
Answer:""",

    "exam": """You are CampusIQ Exam Prep for BCA final year.
Give important questions, key topics, revision notes. Be structured.
Context: {context}
Question: {question}
Answer:""",

    "debug": """You are CampusIQ Code Debug assistant.
Help debug Python, Java, C, JavaScript code. Explain the error and give the fix.
Context: {context}
Code/Question: {question}
Solution:"""
}


class CampusIQRAG:
    def __init__(self):
        self.embeddings = None
        self.vectorstore = None
        self.llm = None
        self._initialized = False

    def initialize(self):
        if self._initialized:
            return
        try:
            from langchain_huggingface import HuggingFaceEmbeddings
            from langchain_community.vectorstores import Chroma
            from langchain_groq import ChatGroq

            self.embeddings = HuggingFaceEmbeddings(
                model_name=os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"),
                model_kwargs={"device": "cpu"},
                encode_kwargs={"normalize_embeddings": True}
            )

            self.vectorstore = Chroma(
                collection_name="campusiq_docs",
                embedding_function=self.embeddings,
                persist_directory="./chroma_db"
            )

            self.llm = ChatGroq(
                api_key=os.getenv("GROQ_API_KEY"),
                model_name=os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile"),
                temperature=0.1,
                max_tokens=800
            )

            self._initialized = True
            print("✓ RAG Pipeline initialized")
        except Exception as e:
            print(f"⚠ RAG initialization error: {e}")

    def load_pdf(self, file_path: str):
        """Load PDF using pdfplumber"""
        import pdfplumber
        from langchain_core.documents import Document
        docs = []
        with pdfplumber.open(file_path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    docs.append(Document(
                        page_content=text,
                        metadata={"page": i + 1, "source": Path(file_path).name}
                    ))
        return docs

    def load_docx(self, file_path: str):
        """Load DOCX file"""
        from langchain_community.document_loaders import Docx2txtLoader
        return Docx2txtLoader(file_path).load()

    def index_documents(self, file_path: str, college: str = "NIMS Ballari") -> int:
        self.initialize()
        path = Path(file_path)
        if path.suffix.lower() == ".pdf":
            docs = self.load_pdf(file_path)
        elif path.suffix.lower() in [".docx", ".doc"]:
            docs = self.load_docx(file_path)
        else:
            raise ValueError(f"Unsupported file type: {path.suffix}")

        # LangChain 0.3.x: use langchain_text_splitters
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(docs)
        for chunk in chunks:
            chunk.metadata["college"] = college

        self.vectorstore.add_documents(chunks)
        print(f"✓ Indexed {len(chunks)} chunks from {path.name}")
        return len(chunks)

    def query(self, question: str, mode: str = "qa", college: str = "NIMS Ballari") -> dict:
        self.initialize()
        if not self._initialized:
            return self._query_direct(question, mode)

        try:
            # LangChain 0.3.x: use LCEL instead of deprecated RetrievalQA
            from langchain_core.prompts import PromptTemplate
            from langchain_core.output_parsers import StrOutputParser
            from langchain_core.runnables import RunnablePassthrough

            retriever = self.vectorstore.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 4}
            )

            prompt = PromptTemplate(
                template=SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["qa"]),
                input_variables=["context", "question"]
            )

            def format_docs(docs):
                return "\n\n".join(d.page_content for d in docs)

            chain = (
                {"context": retriever | format_docs, "question": RunnablePassthrough()}
                | prompt
                | self.llm
                | StrOutputParser()
            )

            answer = chain.invoke(question)

            # Get sources separately
            source_docs = retriever.invoke(question)
            sources = list(set([
                doc.metadata.get("source", "college document")
                for doc in source_docs
            ]))

            return {"answer": answer, "sources": sources, "mode": mode}

        except Exception as e:
            print(f"RAG query error: {e}")
            return self._query_direct(question, mode)

    def _query_direct(self, question: str, mode: str) -> dict:
        """Direct Groq query without RAG — fallback"""
        try:
            from groq import Groq
            client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            system = {
                "qa":    "You are CampusIQ, an AI assistant for NIMS Ballari BCA 6th Semester students. Be helpful and concise.",
                "study": "You are a study helper for BCA final year students. Explain concepts clearly with examples.",
                "exam":  "You are an exam prep assistant. Give important questions and key topics for BCA subjects.",
                "debug": "You are a code debugging assistant. Find the error and provide the fix with explanation."
            }.get(mode, "You are CampusIQ, a helpful campus assistant.")

            response = client.chat.completions.create(
                model=os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile"),
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": question}
                ],
                max_tokens=800
            )
            return {"answer": response.choices[0].message.content, "sources": [], "mode": mode}
        except Exception as e:
            return {"answer": f"AI service error: {str(e)}", "sources": [], "mode": mode}


rag = CampusIQRAG()
