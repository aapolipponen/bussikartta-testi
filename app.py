from flask import Flask, jsonify, send_from_directory
import requests
import os

app = Flask(__name__, static_folder='.')

def fetch_bus_locations(url):
    response = requests.get(url)
    data = response.json()
    return [(bus['latitude'], bus['longitude']) for bus in data['result']['vehicles'].values()]

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/bus-locations')
def bus_locations():
    url = 'http://data.foli.fi/siri/vm'
    locations = fetch_bus_locations(url)
    return jsonify(locations)

if __name__ == '__main__':
    app.run(debug=True)
