from flask import Flask, request, jsonify
from flask_cors import CORS
import tekore as tk

app = Flask(__name__)
CORS(app)

# Replace these with your Spotify app credentials
client_id = 'CLIENT_ID'
client_secret = 'CLIENT_SECRET'

# Set up client credentials authentication
app_token = tk.request_client_token(client_id, client_secret)
spotify = tk.Spotify(app_token)

# Define mood-based genres or keywords
mood_genres = {
    'happy': ['happy', 'joyful', 'upbeat'],
    'sad': ['sad', 'melancholy', 'depressing'],
    'relax': ['chill', 'calm', 'relaxing'],
    'angry': ['angry', 'aggressive', 'intense']
}

@app.route('/recommend', methods=['GET'])
def recommend_songs():
    mood = request.args.get('mood', '').lower()
    
    # Get the corresponding genres for the mood
    genres = mood_genres.get(mood)
    
    if not genres:
        return jsonify({
            'error': 'Mood not recognized. Please enter happy, sad, relax, or angry.'
        }), 400
    
    try:
        # Fetch recommendations based on the genres
        recommendations = spotify.recommendations(genres=genres, limit=10)
        
        # Format the response
        songs = []
        for track in recommendations.tracks:
            songs.append({
                'name': track.name,
                'artist': ', '.join(artist.name for artist in track.artists),
                'url': track.external_urls['spotify']
            })
        
        return jsonify(songs=songs)
    
    except Exception as e:
        return jsonify({
            'error': f'Error getting recommendations: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
