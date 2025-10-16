# wsgi.py
#this code and file only for production not need to change here okay.
from app import app

if __name__ == "__main__":
    app.run()