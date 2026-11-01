import os

from flask import Flask, jsonify, request

from rag import rag_answer

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/ask")
def ask():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Request body must be a JSON object."}), 400

    question = payload.get("question")
    if not isinstance(question, str) or not question.strip():
        return jsonify({"error": "Provide a non-empty 'question' string."}), 400

    question = question.strip()
    try:
        answer = rag_answer(question)
    except Exception:
        app.logger.exception("Failed to generate a RAG answer")
        return jsonify({"error": "Unable to generate an answer."}), 500

    return jsonify({"question": question, "answer": answer})


if __name__ == "__main__":
    app.run(
        host=os.environ.get("FLASK_HOST", "127.0.0.1"),
        port=int(os.environ.get("PORT", "5000")),
        debug=False,
    )