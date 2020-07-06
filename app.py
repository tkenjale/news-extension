from flask import Flask, jsonify, render_template, request
from sklearn.externals import joblib
import numpy as np
import re
from newspaper import Article
import json

app = Flask(__name__)

c_model = joblib.load("../models/c_final_1_1.joblib")
t_model = joblib.load("../models/t_final_1_1.joblib")
lr = joblib.load("../models/lr_final_1_1.joblib")

@app.route('/predict', methods=['POST'])
def predict():
	url = request.form['url']

	article = Article(url)
	article.download()
	article.parse()

	temp = str(article.text)
	global text
	text = regex_clean(temp)
	x1 = c_model.predict_proba([text])[0][1]

	temp = str(article.title)
	global title
	title = regex_clean(temp)
	x2 = t_model.predict_proba([title])[0][1]

	prob = lr.predict_proba([[x1, x2]])[0][1]
	#pred = lr.predict([[x1, x2]])[0]

	rounded_prob = int(round(prob * 100))
	#print('title:', title)
	#print('content:', text)
	print('\n')
	print('content prob:', x1)
	print('title prob:', x2)
	print('combined prob:', prob)

	result = {
		'content prob' : x1,
		'title prob' : x2,
		'combined prob': rounded_prob
	}

	return jsonify(result)

@app.route('/feedback', methods=['POST'])
def feedback():
	feedback = request.form['feedback']

	with open('feedback/feedback.json') as json_file: 
		data = json.load(json_file) 

		obj = {
			'title' : title,
			'content' : text
		}

		if (feedback == 'Yes'):
			data['correct'].append(obj)
		else:
			data['incorrect'].append(obj)

	with open('feedback/feedback.json', 'w') as f:
		json.dump(data, f, indent=4)

	return jsonify({})

def regex_clean(content):
	try:
		temp = content.lower()
		temp = re.sub(r'u\.s\.', 'us', temp)
		temp = re.sub(r'\n|\r', ' ', temp)
		temp = re.sub(r"’|'", '', temp)
		temp = re.sub(r'\.', ' ', temp)
		temp = re.sub(r'e-mail', 'email', temp)
		temp = re.sub(r'(\[.*\])', ' ', temp)
		temp = re.sub(r"[^0-9^a-z^ ]", " ", temp)
		temp = re.sub(r'https?\S+', ' ', temp)
		temp = re.sub(r'[0-9]\S*', ' ', temp)
		temp = re.sub(r' {2,}', ' ', temp)
		temp = temp.strip()
	except:
		temp = ""

	return temp

if __name__ == '__main__':
    app.run(debug=False)