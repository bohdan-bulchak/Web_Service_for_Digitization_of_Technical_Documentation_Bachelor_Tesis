function onloadFlask(){
    $.ajax({
        url: "app.py",
        context: document.body
        });
}

function postImage() {

    let image = document.getElementById('output');
    image.setAttribute('style', 'display:flex');
    let base64image = getBase64Image(image);

    let step_2 = document.getElementById('step_2');
    step_2.setAttribute('style', 'display:block;');

    document.body.setAttribute('style', 'min-height: 200vh;');

    let butt = document.getElementById('button_2');
    let step2_title = document.getElementById('step2_title');
    butt.setAttribute('style', 'background-color: #6D8B74;');

    butt.onclick = function() {
            return false;
        };

    step2_title.scrollIntoView({block: "start", behavior: "smooth"});

    document.getElementById('button_3_div').setAttribute('style', 'display:block;');
    
    $.post( "/send_image", {
        javascript_data: base64image
    });
}


function getContours() {

    document.body.setAttribute('style', 'min-height: 250vh');
    document.getElementById('button_3_div').scrollIntoView({block: "start", behavior: "smooth"});
    document.getElementById('button_3_div').setAttribute('style', 'display:none');
    document.getElementById("p_div").setAttribute('style', 'display:block;');

    $.get("/get_contours", function(data) {
        let new_data = $.parseJSON(data);
        return areasGeneration(new_data);
    });
}

let loadFile = function (event) {
    let image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
    image.setAttribute('style', 'display:none');

    let input_im = document.getElementById('file');

    new_input = input_im.value.replace('C:\\fakepath\\', '');

    let p = document.createElement("p");
    let div = document.createElement("div");
    let boddy = document.getElementById('boddy');

    boddy.appendChild(div);

    div.appendChild(p);
    div.setAttribute('id', 'img_name_div')

    p.innerHTML = new_input;
    p.setAttribute('id','img_name')

    let butt = document.getElementById('button_1');
    butt.setAttribute('style', 'background-color: #6D8B74;');
    butt.onclick = function() {
            return false;
        };
    document.getElementById('button_2_div').setAttribute('style', 'display:block;');

    return new_input;
};


function getBase64Image(img) {
    let canvas = document.createElement("canvas");

    canvas.width = img.width;
    canvas.height = img.height;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


function areasGeneration(data) {
    const map = document.createElement("map");

    for(let i = 0; i < data.length; i++) {
        map.setAttribute('name', 'mapp');
        document.body.appendChild(map);

        let area = document.createElement("area");
        map.appendChild(area);

        area.setAttribute('id', i);
        area.setAttribute('shape', 'poly');
        area.setAttribute('coords', data[i+2]);
        area.setAttribute('href', '#!');
        area.setAttribute('data-maphilight', '{"strokeColor":"0000ff","strokeWidth":5,"fillColor":"ff0000","fillOpacity":0.6}');

        area.onmouseover = function() {
            makeCanvas(area);
        };

        area.onmouseout = function() {
            clearCanvas();
        };

        area.onclick = function() {
            imagesUploading(i, area);
        };
    }
}

var hdc;

function clearCanvas(area) {
    can = document.getElementById('myCanvas');
    hdc.clearRect(0, 0, can.width, can.height);
}


function makeCanvas(area){
    myInit();
    let hoveredElement = area;
    let coordStr = area.getAttribute('coords');

    let mCoords = coordStr.split(',');
    let i, n;
    n = mCoords.length;

    hdc.beginPath();
    hdc.moveTo(mCoords[0], mCoords[1]);

    for (i=2; i<n; i+=2)
    {
        hdc.lineTo(mCoords[i], mCoords[i+1]);
    }

    hdc.lineTo(mCoords[0], mCoords[1]);
    hdc.fill();
    console.log(hdc);
}

function myInit()
{

    var img = document.getElementById('output');

    var x,y, w,h;

    x = img.offsetLeft;
    y = img.offsetTop;
    w = img.clientWidth;
    h = img.clientHeight;

    var imgParent = img.parentNode;
    var can = document.getElementById('myCanvas');
    imgParent.appendChild(can);

    can.style.zIndex = 1;

    can.style.left = x+'px';
    can.style.top = y+'px';

    can.setAttribute('width', w+'px');
    can.setAttribute('height', h+'px');

    hdc = can.getContext('2d');

    hdc.fillStyle = "rgba(211, 204, 194, 0.5)";

    hdc.strokeStyle = 'red';
    hdc.lineWidth = 2;
}

function imagesUploading(i, area) {

    if(document.getElementById('button_4_div')) {
        document.getElementById('button_4_div').remove();
    }

    let del1 = document.getElementsByName('image');
    del1.forEach(function(el){
        el.remove();
    });

    let del2 = document.getElementsByName('image_lab');
    del2.forEach(function(el){
        el.remove();
    });

    let input = document.createElement("input");
    document.body.appendChild(input);

    input.setAttribute('type', "file");
    input.setAttribute('accept', "image/*");
    input.setAttribute('name', "image");
    input.setAttribute('id', i+100);
    input.setAttribute('style', 'display: none;');

    let div = document.createElement("div");
    document.body.appendChild(div);

    div.setAttribute('id', 'button_4_div');

    let div2 = document.createElement("div");
    div.appendChild(div2);
    div2.setAttribute("id", "button4");

    let label = document.createElement("label");

    div2.appendChild(label);
    label.setAttribute('id', "button_4");
    label.setAttribute('name', "image_lab");
    label.setAttribute('for', i+100);
    label.setAttribute('style', "cursor: pointer;");
    label.innerHTML = 'Add an Image';

    input.addEventListener("change",function () {
        let file = input.files[0];
        let new_image = URL.createObjectURL(file);

        area.onclick = function() {
            newPosting(new_image, area);
        };

        div.remove();
        input.remove();
    });
}

function newPosting(posting_image, area) {
    let div = document.createElement('div');
    document.getElementById('boddy').appendChild(div);

    let img = document.createElement("img");
    div.appendChild(img);
    console.log(posting_image);

    img.setAttribute('src', posting_image);
    img.setAttribute('style','border: 11px outset rgba(154,164,154,0.42); border-radius: 19px;max-width: 50vw;');

    div.setAttribute('style',"position: absolute;\n" +
        "margin-left: 1vw;\n" +
        "margin-right: auto;\n" +
        "left: 0;\n" +
        "right: 0;\n" +
        "top: 75vw;\n" +
        "text-align: center;")

    div.setAttribute('id','posting_image');

    document.getElementById('step_1').setAttribute('style', 'filter: blur(8px) brightness(70%);  display:block;');
    document.getElementById('step_2').setAttribute('style', 'filter: blur(8px) brightness(70%); display:block;');

    document.getElementById('img_name_div').setAttribute('style', 'filter: blur(8px) brightness(70%);  display:block;');


    document.getElementById('button_1_div').setAttribute('style', 'filter: blur(8px) brightness(70%); display:block;');
    document.getElementById('button_1_div2').setAttribute('style', 'filter: blur(8px) brightness(70%); display:block;');

    document.getElementById('button_2_div').setAttribute('style', 'filter: blur(8px) brightness(70%); display:block;');

    if(document.getElementById('button_4_div') != null) {
        document.getElementById('button_4_div').remove();
    }

    document.getElementById('p_div').setAttribute('style', 'filter: blur(8px) brightness(70%); display:block;');
    document.getElementById('out_div').setAttribute('style', 'display:none');

    let n = 0;
    getBack(n);
}


function getBack(n) {
    document.onclick = function () {
        n += 1;
        if(n !== 1) {
            document.onclick = null;
            document.getElementById('posting_image').remove();
            document.getElementById('step_1').setAttribute('style', 'display:block;');
            document.getElementById('step_2').setAttribute('style', 'display:block;');

            document.getElementById('img_name_div').setAttribute('style', 'display:block;');
            document.getElementById('button_1_div').setAttribute('style', 'display:block;');
            document.getElementById('button_1_div2').setAttribute('style', 'display:block;');

            document.getElementById('button_2_div').setAttribute('style', 'display:block;');
            document.getElementById('p_div').setAttribute('style', 'display:block;');
            document.getElementById('out_div').setAttribute('style', 'display:block;position: absolute;\n' +
                '    margin-left:1vw;\n' +
                '    margin-right:auto;\n' +
                '    width: 100%;\n' +
                '    display: flex;\n' +
                '    align-items: center;\n' +
                '    justify-content: center;\n' +
                '    margin-top: 82vw;');
        }
    }
}
