import React, {useState, useEffect, useRef} from "react";
import Case from "./Case";
import Personnage from "./Personnage";
import {Walls} from "./IWalls";
import {Position} from "./MazeGeneratorUtils"
interface LabyrintheProps {
  width: number,
  height: number,
  cases: Walls[][],
}

const Maze = ({width, height, cases}: LabyrintheProps) => {
  const [position, setPosition] = useState({x: 0, y: 0});
  const maze_size_width = 500;
  const maze_size_height = 500;
  const case_size_width_px = maze_size_width/width;
  const case_size_height_px = maze_size_height/height;
  const maze_ref = useRef<HTMLInputElement>(null);
  const focusMaze = () => {
    if (maze_ref !== null && maze_ref.current !== null) {
      maze_ref.current.focus();
    }
  };
  useEffect(() => {
    focusMaze();
  });

  const isInsideMaze = (position:Position) => {
    return (
      position.y >= 0 &&
      position.x >= 0 &&
      position.y < height &&
      position.x < width
    );
  };

  const isNotBlocked = (position: Position, direction: string|boolean) => {
    switch(direction) {
      case "top":
        return !cases[position.y][position.x].top;
      case "bottom":
        return !cases[position.y][position.x].bottom;
      case "left":
        return !cases[position.y][position.x].left;
      case "right":
        return !cases[position.y][position.x].right;
      default:
    }
    return false;
  };

  const getClassDirection = (a_case: Walls) => {
      const class_name =
          (a_case.top ? '' : '-t-' )+
          (a_case.left ? '' : '-l-' )+
          (a_case.right ? '' : '-r-' )+
          (a_case.bottom ? '' : '-b-');

      return class_name.slice(0, class_name.length - 1).replace(/(--)/g, '-');
  };

  const movePersonnage = ({key}:React.KeyboardEvent) => {
    const new_position =
      key === "ArrowUp" ? {x: position.x, y: position.y - 1} :
      key === "ArrowDown" ? {x: position.x, y: position.y + 1} :
      key === "ArrowLeft" ? {x: position.x - 1, y: position.y} :
      key === "ArrowRight" ? {x: position.x + 1, y: position.y} :
        false;
    const direction =
      key === "ArrowUp" ? "top":
      key === "ArrowDown" ? "bottom":
      key === "ArrowLeft" ? "left":
      key === "ArrowRight" ? "right":
        false;
      if (new_position !== false && isInsideMaze(new_position) && isNotBlocked(position, direction)) {
        setPosition(new_position);
      }
  };

  return (
      <div
        style={{
          display: "flex",
          flexFlow: "wrap row",
          width: maze_size_width + "px",
          height: maze_size_height + "px",
          margin: "70px auto",
          position: "relative",
        }}
        onKeyDown={movePersonnage}
        tabIndex={0}
        ref={maze_ref}
      >
          {
            cases.map((rows:Walls[], i) => {
                return rows.map((value:Walls, j) => {
                    return <Case width={case_size_width_px} height={case_size_height_px}
                                 key={i+','+j} direction={getClassDirection(value)} />
                })
            })
          }
          <Personnage x={(case_size_width_px * position.x)} y={(case_size_height_px * position.y)} width={case_size_width_px} height={case_size_height_px} />
      </div>
  );
};

Maze.defaultProps = {
  size: 3
};

export default Maze;
