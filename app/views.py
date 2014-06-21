from flask import render_template, request
from app import app
import pycraig
#import other necessary files

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")

@app.route('/index', methods=["POST"])
def get_images():
    soup, base_url = pycraig.get_soup(request.form.get('link'))
    final_soup = pycraig.get_images(soup, base_url)
    return render_template("index.html", images = final_soup)