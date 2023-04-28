import React from 'react';
import "../styles/toolbar.css"
import toolState from "../store/toolState";

const SettingBar = () => {
    return (
        <div className={'setting-bar'}>
            <label htmlFor="'line-width'">Line width</label>
            <input
                onChange={e => toolState.setLineWidth(e.target.value)}
                style={{margin: '0 10px'}} id='line-width' type="number" defaultValue={1} min={1} max={50}/>
            <label htmlFor="stroke-color">Stroke color</label>
            <input
                onChange={e => toolState.setStrokeColor(e.target.value)}
                style={{margin: '0 10px'}} id='stroke-color' type="color" />
        </div>
    );
};

export default SettingBar;
