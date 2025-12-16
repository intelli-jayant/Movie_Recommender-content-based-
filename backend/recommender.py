import pandas as pd
import pickle
from sklearn.metrics.pairwise import cosine_similarity # type: ignore

df = pd.read_pickle("movies.pkl")
vectors = pickle.load(open("vectors.pkl", "rb"))
df["poster_path"] = df["poster_path"].fillna("")


def recommend(movie):
    movie = movie.lower()

    if movie not in df['original_title'].values:
        return []

    idx = df[df['original_title'] == movie].index[0]

    sim = cosine_similarity(
        vectors[idx].reshape(1, -1),
        vectors
    )[0]

    top = sim.argsort()[::-1][1:11]

    res = [] 
    n = 0
    for i in top:
        res.append(df.iloc[i][['id','imdb_id','original_title','poster_path']].to_dict()) 
        n += 1 
    return res 
