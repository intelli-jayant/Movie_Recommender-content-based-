from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender import recommend
import pandas as pd
df = pd.read_pickle("movies.pkl")
app = Flask(__name__)
CORS(app)  

@app.route("/recommend", methods=["POST"])
def get_recommendations():
    data = request.get_json()
    movie = data.get("movie", "")
    results = recommend(movie)
    return jsonify(results)

@app.route("/search", methods=["POST"])
def search():
    query = request.json.get("query", "").lower().strip()

    if len(query) < 2:
        return jsonify([])

    matches = (
        df[df["original_title"].str.contains(query, na=False)]
        ["original_title"]
        .head(10)
        .tolist()
    )

    return jsonify(matches)

if __name__ == "__main__":
    app.run(debug=True)
