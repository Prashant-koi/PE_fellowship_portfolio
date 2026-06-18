import os
import sys

from flask import Flask, render_template
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from Adora.member import member as adora
from Prasant.member import member as prasant

load_dotenv()
app = Flask(__name__)

team = [
    adora,
    prasant,
    {
        "name": "Member Three",
        "image": "img/logo.jpg",
        "about": "Write a short bio about yourself here.",
        "work_experiences": [],
        "education": [],
        "hobbies": [],
        "visited_places": [],
    },
]

pages = [
    {"endpoint": "index", "name": "Home", "url": "/"},
    {"endpoint": "hobbies", "name": "Hobbies", "url": "/hobbies"},
]


@app.route("/")
def index():
    return render_template(
        "index.html",
        title="MLH Fellow",
        url=os.getenv("URL"),
        team=team,
        pages=pages,
    )


@app.route("/hobbies")
def hobbies_page():
    return render_template(
        "hobbies.html",
        title="My Hobbies",
        url=os.getenv("URL"),
        team=team,
        pages=pages,
    )
