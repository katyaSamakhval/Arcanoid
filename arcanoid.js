const CANVAS_NODE=document.getElementById("arcanoid"); // find the id of arcanoid element
const CTX = CANVAS_NODE.getContext("2d"); // there will be 2d context, where will be bricks, ball and platform

const BALL_RADIUS = 10; // radius of the ball

CTX.fillStyle= '#0095DD'; // the background of the playarea
CTX.font='16px Arial'; // font for all text

const PADDLE_WIDTH = 75; // width of the platform
const PADDLE_HEIGHT = 10; // height of the platform

const BRICK_ROW_COUNT = 5; // number of brick rows
const BRICK_COLUMN_COUNT = 3; // number of bricks columns
const BRICK_WIDTH = 75; // width of the brick
const BRICK_HEIGHT = 20; // height of the brick
const BRICK_PADDING = 10; // indention between bricks
const BRICK_OFFSET = 30; //indention of the bricks from the beggining of the playarea

let ballX = CANVAS_NODE.width / 2; // the x coordinate of the ball
let ballY = CANVAS_NODE.height - 30; // the y coordinate of the ball

let dx = 2; // speed-up of the ball(to the platform)
let dy = -2; //  speed-up of the ball(from the platform)

let paddleX = (CANVAS_NODE.width - PADDLE_WIDTH) / 2; // the x coordinate of the platform

let score = 0; // number of score
let lives = 3; // number of lifes

const bricks = []; // array of the bricks


for (let c=0; c<BRICK_COLUMN_COUNT; c++) { // there we generete coordinates for the bricks
    bricks[c]=[];

    for (let r=0; r<BRICK_ROW_COUNT; r++) {
        bricks[c][r]={
            x:0,
            y:0,
            status:1
        }
    }
}

function drawBall() { // there we draw the ball and fill it with color
    CTX.beginPath();
    CTX.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    CTX.fill();
    CTX.closePath();
}

function drawBricks() { // there we draw bricks at random free place at the right row and column and fill them with color
    for (let c=0; c<BRICK_COLUMN_COUNT; c++) {
        for (let r=0; r<BRICK_ROW_COUNT; r++) {
            if (bricks[c][r].status === 1) {
                const BRICK_X = r * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET;
                const BRICK_Y = c * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET;
                bricks[c][r].x = BRICK_X;
                bricks[c][r].y = BRICK_Y;

                CTX.beginPath();
                CTX.rect(BRICK_X, BRICK_Y, BRICK_WIDTH, BRICK_HEIGHT);
                CTX.fill();
                CTX.closePath();
            }
        }
    }
}

function drawPaddle() { // there we draw our platform at previosly stated x coordinate and y coordinate
    CTX.beginPath();
    CTX.rect(paddleX, CANVAS_NODE.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT)
    CTX.fill();
    CTX.closePath();
}

function drawScore() { // there we display score
    CTX.fillText("Score: " + score, 8, 20);
}
function drawLives() { // there we display lifes
    CTX.fillText("Lives: " + lives, CANVAS_NODE.width - 85, 20);
}

function detectCollision() { // there we check if the ball touched the brick
    for (let c=0; c<BRICK_COLUMN_COUNT; c++) {
        for (let r=0; r<BRICK_ROW_COUNT; r++) {
            let brick = bricks[c][r];

            if (brick.status===1) { // if brick status is 1-it's still alive 

                const isCollisionTrue = // we check if coordinates of the ball are the same with the bricks'
                ballX > brick.x && ballX < brick.x + BRICK_WIDTH &&
                ballY > brick.y && ballY < brick.y + BRICK_HEIGHT;

                if (isCollisionTrue) { // if collision is true then the ball will bounce off back to the platform and the brick will disappear and the score will increase
                    
                    dy = -dy;
                    brick.status = 0;

                    score++;

                    if (score === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) { // if there is no bricks you will win and game will reload
                        alert("You win");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

document.addEventListener('mousemove', handleMouseMove); // there we add an event named 'mosemove'. it can track your cursor

function handleMouseMove(e) { // the platform will move to your cursor, but it will not goes out of the frame
    const RELATIVE_X = e.clientX - CANVAS_NODE.offsetLeft;
    if (RELATIVE_X > 0 && RELATIVE_X < CANVAS_NODE.width) {
        paddleX = RELATIVE_X - PADDLE_WIDTH/2; 
    }
    
}

function draw() { // there we draw all elements
    CTX.clearRect(0, 0, CANVAS_NODE.width, CANVAS_NODE.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    detectCollision();

    ballX += dx; // ballX = ballX + dx
    ballY += dy;

    if (ballX + dx < BALL_RADIUS || ballX > CANVAS_NODE.width - BALL_RADIUS) { // check collision with left and right borders and bounce off
        dx = -dx;
    }
    if (ballY + dy < BALL_RADIUS) { // check collision with the top border
        dy = -dy;
    }
    if (ballY + dy > CANVAS_NODE.height - BALL_RADIUS) { // if the ball will goes out of the borders of the playground you will lose one life 
        if (ballX > paddleX && ballX < paddleX + PADDLE_WIDTH) { // collision with platform
            dy = -dy;
        } else {
            lives--;

            if (lives === 0) { // if you will have no lifes your game will be over
                alert("Game over");
                document.location.reload();
            } else { // or if you have a few more lifes you will continue this game
                ballX = CANVAS_NODE.width / 2;
                ballY = CANVAS_NODE.height - 30;
                dx=2;
                dy=-2;
                paddleX = (CANVAS_NODE.width - PADDLE_WIDTH) / 2;
            }
        }
    }
    requestAnimationFrame(draw); // to draw more than one time
}
draw(); // there we draw all