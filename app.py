from flask import Flask, render_template, jsonify, request
import database
import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    # Get hours from query string, default to 24
    hours = request.args.get('hours', default=24, type=int)

    # Return readings for the requested range
    readings = database.get_data(hours=hours)
    
    # Format for chart.js: lists of labels (timestamps) and data points
    # We'll return the raw list and let JS handle formatting, 
    # but for simplicity let's return a nice JSON structure
    
    data = {
        'timestamps': [r['timestamp'] for r in readings],
        'temperatures': [r['temperature'] for r in readings],
        'humidities': [r['humidity'] for r in readings]
    }
    
    # Reverse to show chronological order (oldest -> newest) because get_data orders by DESC
    data['timestamps'].reverse()
    data['temperatures'].reverse()
    data['humidities'].reverse()
    
    return jsonify(data)

if __name__ == '__main__':
    # Listen on all interfaces so it's accessible on the network
    app.run(host='0.0.0.0', port=5000, debug=False)
