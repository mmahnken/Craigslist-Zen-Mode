from flask import render_template, request, session
from app import app
import pycraig


@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")


@app.route('/index', methods=["POST"])
def get_images():
    soup, base_url = pycraig.get_soup(request.form.get('link'))
    final_soup = pycraig.get_images(soup, base_url)
    return render_template("index.html", images=final_soup)


#Async route
@app.route('/soup', methods=["POST"])
def get_soup():
    soup = pycraig.get_links(request.form.get('link'))
    return soup


#Async route
@app.route('/listing', methods=["POST"])
def get_listing():
    images = pycraig.get_one_listing(request.form.get('link'))
    return images
