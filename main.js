const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/predict', (req, res) => {
    let url = req.body.url;

    let arr;

    const python = spawn('python', ['run_model.py', url]);

    python.stdout.on('data', function(data) {
        arr = data.toString().split("\r\n");
    });

    python.on('close', () => {
        if (arr.length < 5) {
            console.error("article error");
            return res.status(500).send("error");
        } else {
            let obj = {
                title: arr[0],
                content: arr[1],
                content_prob: parseFloat(arr[2]),
                title_prob: parseFloat(arr[3]),
                combined_prob: parseFloat(arr[4])
            };
            console.log(obj);

            res.send(obj);
        }

    });
});

app.put('/feedback', (req, res) => {
    fs.readFile('feedback/feedback.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send("Read error");
        } else {
            let obj = JSON.parse(data);
            let toSend = {
                url: req.body.url,
                title: req.body.title,
                content: req.body.content
            };

            if (req.body.feedback === 'yes') {
                obj.correct.push(toSend);
            } else {
                obj.incorrect.push(toSend);
            }

            json = JSON.stringify(obj);
            fs.writeFile('feedback/feedback.json', json, 'utf8', (err) => {
                if (err) {
                    console.error("Write error");
                    return res.status(500).send("Write error");
                } else {
                    return res.send("Received feedback");
                }
            });
        }
    });

});

let server = app.listen(5000, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});