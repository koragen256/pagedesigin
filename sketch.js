let lines = [];
let sitalines = [];

let tlines = [];
let linebuffer = [];
let draggingline = [];
let isDragged = false;
let ErasedFlag = false;
let Sitagaki = false;
let SVisibility = true;
let myh;
let mxh;

let bgcolindex = 0;
let seleColindex = 0;
let size = 4;
let esize = 10;
let ispen = true;

let canvas;

let history = [];
let lhistory = [];
let slhistory = [];

const BGcoltable = [[000, 000, 000, false, "ぶらっく"],
[178, 178, 178, true, "ぬくぬく"],
[255, 255, 255, true, "ほわいと"],
]


const coltable = [[255, 255, 255],
[000, 000, 000],
[255, 000, 000],
[255, 166, 000],
[255, 255, 000],
[166, 255, 000],
[000, 255, 000],
[000, 255, 166],
[000, 255, 255],
[000, 166, 255],
[000, 000, 255],
[166, 000, 255],
[255, 000, 255],
[255, 000, 166],
]

let vaib = 3;
let spaceLen = 20;



class Point {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    getVecPoint(p) {
        return new Vec(p.x - this.x, p.y - this.y);
    }
}

class Vec {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    // ベクトル同士の内積を求める
    dotVec(v) {
        return this.x * v.x + this.y * v.y;
    }

    // ベクトル同士の外積を求める
    crossVec(v) {
        return this.x * v.y - this.y * v.x;
    }

    // ベクトルの長さを求める
    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

class Line {
    constructor(_start_p, _end_p) {
        this.start_p = _start_p;
        this.end_p = _end_p;
        // ベクトルを設定
        this.v = new Vec(
            this.end_p.x - this.start_p.x,
            this.end_p.y - this.start_p.y
        );
    }
}

class Circle {
    constructor(_p, _r) {
        this.p = _p;
        this.r = _r;
    }
}

async function sGif() {
    createCanvas(windowWidth, windowHeight);
    frameRate(12);
    saveE.text = "せーぶちゅうだよ";
    createLoop({ duration: 1, gif: { fileName: "UGO.gif", render: false, open: true, download: true } });

    var URL = "https://script.google.com/macros/s/AKfycbxurjsgx22KqUqfyNWTIb4eydmUzrHN4cBUBf7DMc1phm2UECA/exec";
    
    var SendDATA = {
        "size": lines.length,
        "Exported": lines
    };

    var postparam =
    {
        "method": "POST",
        "mode": "no-cors",
        "Content-Type": "application/x-www-form-urlencoded",
        "body": JSON.stringify(SendDATA)
    };

    fetch(URL, postparam);

}

function changebg() {
    bgcolindex = (bgcolindex + 1) % BGcoltable.length;
    let element = document.getElementsByTagName('a');
    haike.text = "はいけい[" + BGcoltable[bgcolindex][4] + "]"
    var theme = BGcoltable[bgcolindex][3];
    for (elm of element) {
        if (!theme) {
            elm.style.color = "White";
        } else {
            elm.style.color = "Black";
        }

    }
    if (theme) {
        andu.style.color = "#000000";
    } else {
        andu.style.color = "#ff7300";
    }

}

function changev() {
    vaib = (vaib) % 20 + 1;
    sVaib.text = "ゆれはば[" + vaib + "]";
}

function changchoten() {
    spaceLen = (spaceLen) % 80 + 5;
    sLen.text = "あらさ[" + spaceLen / 10 + "]";
}

function changesize() {
    size = (size) % 10 + 1;
    futosa.text = "ふとさ[" + size + "]";
}

function togglecol() {
    seleColindex = (seleColindex + 1) % coltable.length;
    let r = coltable[seleColindex][0];
    let g = coltable[seleColindex][1];
    let b = coltable[seleColindex][2];
    colbutton.style.color = "rgb(" + r + "," + g + "," + b + ")";
    colbutton.text = "いろへんこー[" + seleColindex + "]";
    console.log("#" + r + g + b + ";");
}

function togglesitagaki() {
    Sitagaki = !Sitagaki;
    if (Sitagaki) {
        SVisibility=true;
        sitagaki.text = "したがきもーど[X]";
        sitagakiv.text = "したがきひょうじ[X]";
    } else {
        sitagaki.text = "したがきもーど[ ]";
    }
}

function togglesitagakiVisibility() {
    SVisibility = !SVisibility;
    if (SVisibility) {
        sitagakiv.text = "したがきひょうじ[X]";
    } else {
        Sitagaki=false;
        sitagaki.text = "したがきもーど[ ]";
        sitagakiv.text = "したがきひょうじ[ ]";
    }
}

function toggletool() {
    ispen = !ispen;
    if (ispen) {
        toolmode.text = "ぺん";
    } else {
        toolmode.text = "けしごむ";
    }
}

function keyPressed() {
    if (key == "z") {
        undo();
    }
}

function undo() {
    if (history.length == 0) return;
    if (history[history.length - 1] == 0) {
        lines.pop();
        history.pop();
    } else if (history[history.length - 1] == -1) {
        sitalines.pop();
        history.pop();
    } else if (history[history.length - 1] == 1){
        lines = lhistory[lhistory.length - 1];
        lhistory.pop();
        history.pop();
    }else{
        sitalines = slhistory[slhistory.length - 1];
        slhistory.pop();
        history.pop();
    }
}

function RresetButton(){
    let t = window.confirm("本当にすべて削除してもよろしいですか？")
    if(t){
        setup();
    }
}


function setup() {

    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);//canvasをページの原点に固定
    canvas.style('z-index', '-1');//canvasを後ろに移動する
    
    frameRate(12);
    background(0);

    draggingline = [];
    linebuffer = [];
    lines = [];
}

function mouseDragged() {
    if (ispen) {
        if (!isDragged) {
            mxh = mouseX;
            myh = mouseY;
            isDragged = true;
        } else {
            if (GetdistSqrt(mxh, myh, mouseX, mouseY) > spaceLen) {
                draggingline.push([mxh, myh, mouseX, mouseY, seleColindex, size]);
                linebuffer.push([mxh, myh, mouseX, mouseY, seleColindex, size]);
                mxh = mouseX;
                myh = mouseY;
            }
        }
    } else {
        if (!isDragged) {
            isDragged = true;
        } else {
            if(!Sitagaki){
                let cp = new Circle(new Point(mouseX, mouseY), esize);
                if (!ErasedFlag) {
                    tlines = lines.concat();
                }
                let ef = false;
                lines.forEach((l, lindex) => {
                    l.forEach((x, index) => {
                        let line_start_p = new Point(x[0], x[1]);
                        let line_end_p = new Point(x[2], x[3]);
    
                        if (circleColLine(cp, new Line(line_start_p, line_end_p)) && !ef) {
                            line(x[0], x[1], x[2], x[3])
                            ErasedFlag = true;
                            ef = true;
                            lines[lindex] = [];//erase
                            lines.push(l.slice(index + 1));
                            lines.push(l.slice(0, index));
                        }
                    })
                })
            }else{
                let cp = new Circle(new Point(mouseX, mouseY), esize);
                if (!ErasedFlag) {
                    tlines = sitalines.concat();
                }
                let ef = false;
                sitalines.forEach((l, lindex) => {
                    l.forEach((x, index) => {
                        let line_start_p = new Point(x[0], x[1]);
                        let line_end_p = new Point(x[2], x[3]);
    
                        if (circleColLine(cp, new Line(line_start_p, line_end_p)) && !ef) {
                            line(x[0], x[1], x[2], x[3])
                            ErasedFlag = true;
                            ef = true;
                            sitalines[lindex] = [];//erase
                            sitalines.push(l.slice(index + 1));
                            sitalines.push(l.slice(0, index));
                        }
                    })
                })
            }
        }

    }

}

function mouseReleased() {
    if (ispen) {
        if (linebuffer.length > 0) {//draw
            if (!Sitagaki) {
                lines.push(linebuffer);
                history.push(0);
            } else {
                sitalines.push(linebuffer);
                history.push(-1);
            }
        }
        linebuffer = [];
        draggingline = [];
    } else {
        if (ErasedFlag) {
            if(!Sitagaki){
                lhistory.push(tlines.filter(n => n.length));
                history.push(1);
            }else{
                slhistory.push(tlines.filter(n => n.length));
                history.push(2);
            }
        }
    }
    isDragged = false;
    ErasedFlag = false;
}

function GetdistSqrt(x0, y0, x1, y1) {
    return Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2);
}

function judgeIentersected(ax, ay, bx, by, cx, cy, dx, dy) {
    var ta = (cx - dx) * (ay - cy) + (cy - dy) * (cx - ax);
    var tb = (cx - dx) * (by - cy) + (cy - dy) * (cx - bx);
    var tc = (ax - bx) * (cy - ay) + (ay - by) * (ax - cx);
    var td = (ax - bx) * (dy - ay) + (ay - by) * (ax - dx);

    return tc * td < 0 && ta * tb < 0;
}

function circleColLine(circleP, lineAB) {
    // ① 線分APのベクトルを求める
    let vecAP = lineAB.start_p.getVecPoint(circleP.p);
    let vecBP = lineAB.end_p.getVecPoint(circleP.p);

    // ② 線分ABと線分APの内積・外積を線分ABの長さで除算することで
    // 線分AX、PXの長さを求める
    let dotAX = lineAB.v.dotVec(vecAP) / lineAB.v.getLength();
    let crossPX = lineAB.v.crossVec(vecAP) / lineAB.v.getLength();

    // ③ 最短距離を設定
    // 基本は線分PXの長さを設定
    let distance = Math.abs(crossPX);
    if (dotAX < 0) {
        // 例外１：線分AXと逆方向に最短座標がある場合 -> 線分APの長さを設定
        distance = vecAP.getLength();
    } else if (dotAX > lineAB.v.getLength()) {
        // 例外２：線分ABよりも先に最短座標がある場合 -> 線分BPの長さを設定
        distance = vecBP.getLength();
    }
    // ④ 最短距離が円の半径より小さければ衝突と判定
    return distance < circleP.r;
}

function draw() {
    lines = lines.filter(n => n.length);
    sitalines = sitalines.filter(n => n.length);
    background(BGcoltable[bgcolindex][0], BGcoltable[bgcolindex][0], BGcoltable[bgcolindex][0]);

    if(touches.length==3){
        undo();
    }

    stroke(255);

    fill(coltable[seleColindex][0], coltable[seleColindex][1], coltable[seleColindex][2]);

    if (!ispen && isDragged) {
        noFill();
        circle(mouseX, mouseY, esize * 2);
    }
    if(SVisibility){
        for (let l of sitalines) {
            let xt = l[0][0] + random(-vaib, vaib);
            let yt = l[0][1] + random(-vaib, vaib);
            for (let x of l) {
                stroke(coltable[x[4]][0], coltable[x[4]][1], coltable[x[4]][2]);
                let tx = x[2] + random(-vaib, vaib);
                let ty = x[3] + random(-vaib, vaib);
                strokeWeight(x[5]);
                line(xt, yt, tx, ty);
                xt = tx;
                yt = ty;
    
    
            }
        }
        background(BGcoltable[bgcolindex][0], BGcoltable[bgcolindex][0], BGcoltable[bgcolindex][0], 200);
    }

    for (let l of lines) {
        push();
        let xt = l[0][0] + random(-vaib, vaib);
        let yt = l[0][1] + random(-vaib, vaib);
        for (let x of l) {
            stroke(coltable[x[4]][0], coltable[x[4]][1], coltable[x[4]][2]);
            let tx = x[2] + random(-vaib, vaib);
            let ty = x[3] + random(-vaib, vaib);
            strokeWeight(x[5]);
            line(xt, yt, tx, ty);
            xt = tx;
            yt = ty;


        }
        pop();
    }

    for (let x of draggingline) {
        strokeWeight(x[5]);
        if(!Sitagaki){
            stroke(coltable[seleColindex][0], coltable[seleColindex][1], coltable[seleColindex][2]);
        }else{
            stroke(coltable[seleColindex][0], coltable[seleColindex][1], coltable[seleColindex][2],20);
        }
        
        line(x[0], x[1], x[2], x[3]);
        
    }

}