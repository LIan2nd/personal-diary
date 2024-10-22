# Import Package
import os
from datetime import datetime
from os.path import join, dirname
from dotenv import load_dotenv

from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

# Setup

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME =  os.environ.get("DB_NAME")

client = MongoClient(MONGODB_URI)

db = client[DB_NAME]
app = Flask(__name__)

@app.route('/')
def home() :
  return render_template('index.html')


@app.route('/diary', methods=["GET"])
def getDiary() :
  diaries = list(db.diary.find({}, {'_id' : False}))
  return jsonify({"msg" : "Get Diary...", "diaries" : diaries})

@app.route('/diary', methods=["POST"])
def postDiary() :
  title = request.form["title"]
  description = request.form["description"]
  diaryImg = request.files.get("diaryImg")
  profileImg = request.files.get("profileImg")

  now = datetime.now()
  time = now.strftime("%d-%m-%Y-%H-%M-%S")[:10]

  if diaryImg : 
    extensionDiaryImg = diaryImg.filename.split('.')[-1]
    today = now.strftime("%Y-%m-%d-%H-%M-%S")
    diaryImgName = f"diary-{today}.{extensionDiaryImg}"
    diarySave_to = f'static/img/diary/{diaryImgName}'
    diaryImg.save(diarySave_to)
  else : 
    diaryImgName = "default.jpg"

  if profileImg : 
    extensionProfileImg = profileImg.filename.split('.')[-1]
    nameProfileImg = profileImg.filename.split('.')[0]
    profileImgName = f"profile-{nameProfileImg}.{extensionProfileImg}"
    profileSave_to = f'static/img/profile/{profileImgName}'
    profileImg.save(profileSave_to)
  else :
    profileImgName = "default.jpg"

  doc = {
    "profileImg" : profileImgName,
    "diaryImg" : diaryImgName,
    "title" : title,
    "description" : description,
    "time" : time
  }
  
  db.diary.insert_one(doc)
  
  return jsonify({"msg" : "Your Diary has been saved!"})

port=5000
debug=True

if __name__ == "__main__":
  app.run('0.0.0.0', port=port, debug=debug)