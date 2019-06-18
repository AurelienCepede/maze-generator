import React from 'react';
import './App.css';
import Maze from "./Maze";
import generateMaze from "./MazeGenerator";

const App: React.FC = () => {
  const __SIZE = 20;
  return (
    <div className="App">
      <Maze width={__SIZE} height={__SIZE} cases={generateMaze(__SIZE, __SIZE)}/>
    </div>
  );
};

export default App;
