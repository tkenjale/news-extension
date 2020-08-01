from sklearn.externals import joblib
import numpy as np
import re
from newspaper import Article
import math
import json
import sys

url = sys.argv[1]

c_model = joblib.load("models/c_final_sgd_log_1_1.joblib")
t_model = joblib.load("models/t_final_mnb_1_2.joblib")

b0 = -9.2371880
b1 = 9.3777393
b2 = 8.6144912 
b3 = 0.9323086

def predict(url):
	try:
		article = Article(url)
		article.download()
		article.parse()
	except:
		raise ValueError()
	title_raw = str(article.title)
	title = regex_clean(title_raw)
	x1 = t_model.predict_proba([title])[0][1]

	text_raw = str(article.text)
	text = regex_clean(text_raw)
	x2 = c_model.predict_proba([text])[0][1]

	prob = (math.e ** (b0 + b1 * x1 + b2 * x2 + b3 * x1 * x2)) / (1 + (math.e ** (b0 + b1 * x1 + b2 * x2 + b3 * x1 * x2)))

	rounded_prob = int(round(prob * 100))

	result = {
		'title' : title,
		'content' : text,
		'content_prob' : x1,
		'title_prob' : x2,
		'combined_prob': rounded_prob
	}

	return result


def regex_clean(text):
	try:
		temp = text.lower()
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

try:
    result = predict(url)
    print(result['title'])
    print(result['content'])
    print(result['content_prob'])
    print(result['title_prob'])
    print(result['combined_prob'])
except:
    print("error")