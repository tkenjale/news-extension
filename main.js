const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

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

let server = app.listen(5000, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});