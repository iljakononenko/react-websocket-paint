import React, {useEffect, useRef} from 'react';
import "../styles/canvas.css"
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {useParams} from "react-router-dom";
import Rect from "../tools/Rect";
import axios from "axios";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";

const Canvas = observer(() => {

    const params = useParams()
    console.log(params)
    const canvasRef = useRef()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        const ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image();
                img.src = response.data;
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            })
    }, [])

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:5000/')
        canvasState.setSocket(socket)
        canvasState.setSessionId(params.id)
        toolState.setTool(new Brush(canvasRef.current, socket, params.id))
        socket.onopen = () => {
            socket.send(JSON.stringify({
                id: params.id,
                method: "connection"
            }))
        }

        socket.onmessage = (event) => {
            console.log(event)
            let data = JSON.parse(event.data)
            switch (data.method) {
                case "connection":
                    console.log(data)
                    break
                case "draw":
                    drawHandler(data)
                    break;
            }
        }
    }, [])

    const drawHandler = (data) => {
        const figure = data.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y)
                break;
            case "eraser":
                Eraser.draw(ctx, figure.x, figure.y)
                break;
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.w, figure.h, figure.color)
                break
            case "arc":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.w, figure.h, figure.color)
                break
            case "line":
                Line.staticDraw(ctx, figure.startX, figure.startY, figure.x, figure.y, figure.color)
                break;
            case "finish":
                ctx.beginPath()
                break;
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
    }

    const mouseUpHandler = () => {
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()}).then(response => console.log(response))
    }

    return (
        <div className={'canvas'}>
            <canvas onMouseUp={() => mouseUpHandler()} onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400}></canvas>
        </div>
    );
});

export default Canvas;
