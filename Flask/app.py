from flask import Flask, request, render_template
import os
import time
from datetime import datetime



app = Flask(__name__)

# Store start time before every request
@app.before_request
def start_timer():
    request.start_time = time.time()

# Log and print duration after each request
@app.after_request
def log_request_time(response):
    ip = request.remote_addr
    if hasattr(request, 'start_time'):
        duration = time.time() - request.start_time
        duration_ms = round(duration * 1000, 2)  # in milliseconds
        timestamp = datetime.now().isoformat()

        # Global log file path
        log_dir = os.path.join(os.path.dirname(__file__), '..', 'All_logs')
        os.makedirs(log_dir, exist_ok=True)
        log_file = os.path.join(log_dir, 'response_time_logs.txt')

        with open(log_file, 'a') as f:
            f.write(f"\n[{timestamp}] {request.method} {request.path} from IP: {ip}  responded in {duration_ms} ms (Flask)")


    return response

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        ip = request.remote_addr
        name = request.form['name']
        message = request.form['message']
        timestamp = datetime.now().isoformat()

        # Global log file path
        log_dir = os.path.join(os.path.dirname(__file__), '..', 'All_logs')
        os.makedirs(log_dir, exist_ok=True)
        log_file = os.path.join(log_dir, 'user_logs.txt')

        with open(log_file, 'a') as f:
            f.write(f"\n[{timestamp}] Name: {name}, Message: '{message}' from IP: {ip} (Flask).")

        return render_template('thankyou.html', name=name, message=message)
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)
