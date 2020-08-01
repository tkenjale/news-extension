from flask import Flask, jsonify, render_template, request
from sklearn.externals import joblib
import numpy as np
import re
from newspaper import Article
import json
import math
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

c_model = joblib.load("models/c_final_sgd_log_1_1.joblib")
t_model = joblib.load("models/t_final_mnb_1_2.joblib")
#lr = joblib.load("../models/lr_final_1_1.joblib")
b0 = -9.2371880
b1 = 9.3777393
b2 = 8.6144912 
b3 = 0.9323086

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
	global url
	url = request.form['url']
	
	try:
		article = Article(url)
		article.download()
		article.parse()
	except:
		return jsonify({
			'title' : "error",
			'content' : 'error',
			'content_prob' : "error",
			'title_prob' : "error",
			'combined_prob': "error"
		})

	title_raw = str(article.title)
	global title
	title = regex_clean(title_raw)
	x1 = t_model.predict_proba([title])[0][1]

	text_raw = str(article.text)
	global text
	text = regex_clean(text_raw)
	x2 = c_model.predict_proba([text])[0][1]

	#prob = lr.predict_proba([[x1, x2]])[0][1]
	#pred = lr.predict([[x1, x2]])[0]
	prob = (math.e ** (b0 + b1 * x1 + b2 * x2 + b3 * x1 * x2)) / (1 + (math.e ** (b0 + b1 * x1 + b2 * x2 + b3 * x1 * x2)))

	rounded_prob = int(round(prob * 100))
	#print('title:', title)
	#print('content:', text)
	print('\n')
	print('title prob:', x1)
	print('content prob:', x2)
	print('combined prob:', prob)

	result = {
		'title' : title,
		'content' : text,
		'content_prob' : x1,
		'title_prob' : x2,
		'combined_prob': rounded_prob
	}

	return jsonify(result)

@app.route('/feedback', methods=['POST', 'OPTIONS'])
def feedback():
	feedback = request.form['feedback']

	with open('../feedback/feedback.json') as json_file: 
		data = json.load(json_file) 

		obj = {
			'url' : url,
			'title' : title,
			'content' : text
		}

		if (feedback == 'Yes'):
			data['correct'].append(obj)
		else:
			data['incorrect'].append(obj)

	with open('../feedback/feedback.json', 'w') as f:
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