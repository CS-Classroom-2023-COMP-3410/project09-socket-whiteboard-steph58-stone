import React from 'react';
import ReactDOM from 'react-dom/client';
import Whiteboard from './whiteboard';

console.log('React app is mounting...');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Whiteboard />
    </React.StrictMode>
);
