import { Walls } from "./IWalls";
import {
  Direction,
  getNewPosition,
  getOppositeDirection,
  Position,
  randomBetween
} from "./MazeGeneratorUtils";

/*
 * Function to generate Maze
 * -------------------------
 *
 * I used wikipedia to have the principe of the algorithm
 *  follow this link https://fr.wikipedia.org/wiki/Mod%C3%A9lisation_math%C3%A9matique_de_labyrinthe
 * */
export default (width: number, height: number) => {
  // Initialisation of all walls
  const cases: Walls[][] = [];
  for (let i = 0; i < height; i++) {
    cases[i] = [];
    for (let j = 0; j < width; j++) {
      cases[i][j] = {
        top: true,
        left: true,
        right: true,
        bottom: true,
        visited: false
      };
    }
  }

  // To get the walls corresponding to the following position
  const getCase = (position: Position) => {
    return cases[position.y][position.x];
  };

  const isVisited = (position: Position) => {
    return getCase(position).visited;
  };

  const isInsideMaze = (position: Position) => {
    return (
      position.y >= 0 &&
      position.x >= 0 &&
      position.y < height &&
      position.x < width
    );
  };

  // Choose between a directions array
  const chooseDirection = (position: Position, directions: Array<number>) => {
    while (directions.length > 0) {
      const direction = directions.splice(
        randomBetween(directions.length),
        1
      )[0];

      const new_position = getNewPosition(position, direction);
      if (isInsideMaze(new_position) && !isVisited(new_position)) {
        return { direction: direction, position: new_position };
      }
    }
    return false;
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

  const openWallsBetweenCases = (
    position: Position,
    direction: Direction,
    new_position: Position
  ) => {
    const case1 = getCase(position);
    const case2 = getCase(new_position);
    const opposite = getOppositeDirection(direction);
    openWall(case1, direction);
    openWall(case2, opposite);
  };

  const searchCaseNotVisited = () => {
    for (let i = 0; i < cases.length; i++) {
      for (let j = 0; j < cases[i].length; j++) {
        if (!cases[i][j].visited) {
          const position_i_j = { y: i, x: j };
          let new_position = { y: i, x: j };
          const direction = Object.values(Direction)
            .slice(4, 8)
            .reduce((accumulator, value) => {
              const new_p = getNewPosition(position_i_j, value);
              if (isInsideMaze(new_p) && isVisited(new_p)) {
                new_position = new_p;
                return value;
              } else {
                return accumulator;
              }
            }, false);
          if (direction) {
            return {
              found_position: position_i_j,
              direction: direction,
              new_position: new_position
            };
          }
        }
      }
    }
    return {};
  };

  const explore = (position: Position) => {
    // The case we're exploring is set visited
    getCase(position).visited = true;

    const directions = Object.values(Direction).slice(4, 8);
    const chosen_direction = chooseDirection(position, directions);
    if (chosen_direction) {
      openWallsBetweenCases(
        position,
        chosen_direction.direction,
        chosen_direction.position
      );
      explore(chosen_direction.position);
    } else {
      const {
        found_position,
        direction,
        new_position
      } = searchCaseNotVisited();
      if (
        found_position !== undefined &&
        direction !== undefined &&
        new_position !== undefined
      ) {
        openWallsBetweenCases(found_position, direction, new_position);
        if (
          new_position.y !== found_position.y ||
          new_position.x !== found_position.x
        ) {
          explore(found_position);
        }
      }
    }
  };

  explore({
    y: randomBetween(height),
    x: randomBetween(width)
  });

  return cases;
};
