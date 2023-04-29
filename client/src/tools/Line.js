import Tool from "./Tool";

export default class Line extends Tool{
    constructor(canvas, socket, sessionId) {
        super(canvas, socket, sessionId);
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.sessionId,
            figure: {
                type: 'line',
                startX: this.startX,
                startY: this.startY,
                x: this.currentX,
                y: this.currentY,
                color: this.ctx.fillStyle
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;
            this.draw(this.currentX, this.currentY)
        }
    }

    draw(x, y) {
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.startX, this.startY)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }

    }

    static staticDraw(ctx, startX, startY, x, y, color) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(x, y)
        ctx.fill()
        ctx.stroke()
    }
}
