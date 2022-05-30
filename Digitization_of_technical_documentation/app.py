from flask import Flask, render_template, request
import base64
import main
import json
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/send_image', methods=['POST'])
def get_post_javascript_data():
    jsdata = request.form['javascript_data']

    img_data = str.encode(jsdata)

    with open("proc_image.png", "wb") as fh:
        fh.write(base64.decodebytes(img_data))

    return jsdata


@app.route('/get_contours')
def get_python_data():
    contours = main.image_proc("proc_image.png")

    return json.dumps(contours)


if __name__ == "__main__":
    app.run(debug=True)
