from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chat_models import init_chat_model
from langgraph.prebuilt import create_react_agent
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from pathlib import Path
import sys, os
from config import MODEL_ID


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


load_dotenv()

# ⑤ open the same vector store we built in step 1
embedder = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
db       = Chroma(
    persist_directory=str(Path(__file__).resolve().parent / "chroma_db"),
    embedding_function=embedder,
)

# Initialize the LLM via Bedrock
llm = init_chat_model(
    MODEL_ID,
    model_provider="bedrock_converse", # this is the Bedrock Converse API
)

# Create a ReAct agent with the tool
# agent = create_react_agent(model=llm, tools=[db.as_tool()])


# ⑥ the prompt: instructions + chunks + question
prompt = ChatPromptTemplate.from_template("""
Answer the question using ONLY the context below. If the context doesn't contain
the answer, say "I don't know." Be concise and quote facts directly.
f
Context:
{context}

Question: {question}
""")

def rag_answer(question):
    chunks = db.similarity_search(question, k=3)         # ⑦ retrieve top 3
    # print(f"chunks: {[c.page_content for c in chunks]}")  # debug
    context = "\n\n".join(c.page_content for c in chunks)
    print("context", context)
    chain = prompt | llm                                # ⑧ same chain trick as Class 2
    return chain.invoke({"context": context, "question": question}).content

if __name__ == "__main__":
    print(rag_answer("Where did Harshal pursue his Engineering degree?"))
