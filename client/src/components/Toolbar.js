import React from 'react';
import "../styles/toolbar.css"
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";

const Toolbar = () => {

    const changeColor = e => {
        toolState.setStrokeColor(e.target.value)
        toolState.setFillColor(e.target.value)
    }

    return (
        <div className={'toolbar'}>
            <button className={'toolbar__btn brush'} onClick={() => toolState.setTool(new Brush(canvasState.canvas))} />
            <button className={'toolbar__btn rect'} onClick={() => toolState.setTool(new Rect(canvasState.canvas))} />
            <button className={'toolbar__btn circle'} onClick={() => toolState.setTool(new Circle(canvasState.canvas))} />
            <button className={'toolbar__btn eraser'} onClick={() => toolState.setTool(new Eraser(canvasState.canvas))} />
            <button className={'toolbar__btn line'} onClick={() => toolState.setTool(new Line(canvasState.canvas))} />
            <input  onChange={e => changeColor(e)} style={{marginLeft: 10}} type="color"/>
            <button className={'toolbar__btn undo'} onClick={() => canvasState.undo()} />
            <button className={'toolbar__btn redo'} onClick={() => canvasState.redo()} />
            <button className={'toolbar__btn save'} />
        </div>
    );
};

export default Toolbar;
