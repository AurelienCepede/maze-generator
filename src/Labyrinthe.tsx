import React from "react";
import Case from "./Case";

interface LabyrintheProps {
  size: number;
}

interface Walls {
  top: boolean;
  left: boolean;
  right: boolean;
  bottom: boolean;
  visited: boolean;
}

interface Position {
  i: number;
  j: number;
}

enum Direction {
  top,
  left,
  right,
  bottom
}

const Labyrinthe = (props: LabyrintheProps) => {
  const cases: Walls[][] = [];
  for (let i = 0; i < props.size; i++) {
    cases[i] = [];
    for (let j = 0; j < props.size; j++) {
      cases[i][j] = {
        top: true,
        left: true,
        right: true,
        bottom: true,
        visited: false
      };
    }
  }

  const randomBetween = (max: number, min = 0) => {
    return Math.floor(Math.random() * (max - min));
  };

  const getNewPosition = (position: Position, direction: Direction) => {
    const new_position: Position = { i: -1, j: -1 };
    switch (direction) {
      case Direction.top:
        new_position.i = position.i - 1;
        new_position.j = position.j;
        break;
      case Direction.left:
        new_position.i = position.i;
        new_position.j = position.j - 1;
        break;
      case Direction.right:
        new_position.i = position.i;
        new_position.j = position.j + 1;
        break;
      case Direction.bottom:
        new_position.i = position.i + 1;
        new_position.j = position.j;
        break;
      default:
        throw new Error("An error occured while generating maze");
    }
    return new_position;
  };

  const chooseDirection = (position: Position, directions: Array<number>) => {
    while (directions.length > 0) {
      const direction = directions.splice(
        randomBetween(directions.length),
        1
      )[0];

      const new_position = getNewPosition(position, direction);
      if (couldBeVisited(new_position)) {
        return { direction: direction, position: new_position };
      }
    }
    return false;
  };

  const getOppositeDirection = (direction: Direction) => {
    switch (direction) {
      case Direction.top:
        return Direction.bottom;
      case Direction.left:
        return Direction.right;
      case Direction.right:
        return Direction.left;
      case Direction.bottom:
        return Direction.top;
      default:
        throw new Error("This is not a direction");
    }
  };

  const getCase = (position: Position) => {
    return cases[position.i][position.j];
  };

  const couldBeVisited = (position: Position) => {
    return (
      position.i >= 0 &&
      position.j >= 0 &&
      position.i < props.size &&
      position.j < props.size &&
      !getCase(position).visited
    );
  };

  const isVisited = (position: Position) => {
    return position.i >= 0 &&
      position.j >= 0 &&
      position.i < props.size &&
      position.j < props.size &&
        getCase(position).visited;
  };

  const openWall = (case_to_open: Walls, direction: Direction) => {
    switch (direction) {
      case Direction.top:
        case_to_open.top = false;
        break;
      case Direction.left:
        case_to_open.left = false;
        break;
      case Direction.right:
        case_to_open.right = false;
        break;
      case Direction.bottom:
        case_to_open.bottom = false;
        break;
      default:
        throw new Error("This is not a direction");
    }
  };

  const openWallsBetweenCases = (position:Position, direction:Direction, new_position:Position) => {
      const case1 = getCase(position);
      const case2 = getCase(new_position);
      const opposite = getOppositeDirection(direction);
      openWall(case1, direction);
      openWall(case2, opposite);
  };


  const explore = (explorer: Position) => {
    getCase(explorer).visited = true;

    const directions = Object.values(Direction).slice(4, 8);
    const choosen_direction = chooseDirection(explorer, directions);
    if (choosen_direction) {
      openWallsBetweenCases(explorer, choosen_direction.direction, choosen_direction.position);
      explore(choosen_direction.position);
    } else {
      for (let i = 0; i < cases.length; i++) {
        for (let j = 0; j < cases[i].length; j++) {
          if (!cases[i][j].visited) {
              const position_i_j = {i:i, j:j};
              let new_position = {i:i, j:j};
              const direction = Object.values(Direction).slice(4, 8).reduce((accumulator, value) => {
                  const position = getNewPosition(position_i_j, value);
                  if (isVisited(position)) {
                      new_position = position;
                      return value;
                  } else {
                      return accumulator;
                  }
              }, false);
              if (direction) {
                  openWallsBetweenCases(position_i_j, direction, new_position);
                  if (new_position.i !== position_i_j.i || new_position.j !== position_i_j.j) {
                      explore(position_i_j);
                  }
              }
          }
        }
      }
    }
  };


  explore({
    i: randomBetween(props.size),
    j: randomBetween(props.size)
  });

  const getClassDirection = (a_case: Walls) => {
      const class_name =
          (a_case.top ? '' : '-t-' )+
          (a_case.left ? '' : '-l-' )+
          (a_case.right ? '' : '-r-' )+
          (a_case.bottom ? '' : '-b-');

      return class_name.slice(0, class_name.length - 1).replace(/(--)/g, '-');
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexFlow: "wrap row",
          height: "500px",
          width: "500px",
          margin: "auto"
        }}
      >
          {cases.map((rows:Walls[], i) => {
                return rows.map((value:Walls, j) => {
                    return <Case width={100/props.size + "%"} height={100/props.size + "%"} title={i+','+j + ' => ' + value.top + ',' + value.left + ',' + value.right + ',' + value.bottom}
                                 key={i+','+j} direction={getClassDirection(value)} />
                })
          })}
      </div>
    </div>
  );
};

Labyrinthe.defaultProps = {
  size: 25
};

export default Labyrinthe;
