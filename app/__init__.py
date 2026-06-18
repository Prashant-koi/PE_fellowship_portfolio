import os
import sys

from flask import Flask, render_template
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from Adora.member import member as adora

load_dotenv()
app = Flask(__name__)

team = [
    adora,
    {
        "name": "Member Two",
        "image": "img/logo.jpg",
        "about": "Write a short bio about yourself here.",
        "work_experiences": [
            {
                "title": "Teaching Assistant",
                "company": "My University",
                "dates": "2023 - Present",
                "description": "Helped students with computer science coursework.",
            },
        ],
        "education": [
            {
                "school": "My University",
                "degree": "B.S. Computer Science",
                "dates": "2022 - Present",
            },
        ],
        "hobbies": [
            {"name": "Reading", "image": "img/logo.jpg"},
        ],
    },
    {
        "name": "Member Three",
        "image": "img/logo.jpg",
        "about": "Write a short bio about yourself here.",
        "work_experiences": [],
        "education": [],
        "hobbies": [],
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
