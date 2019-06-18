export const randomBetween = (max: number, min = 0) => {
  return Math.floor(Math.random() * (max - min));
};

export interface Position {
  y: number;
  x: number;
}

export enum Direction {
  top,
  left,
  right,
  bottom
}

export const getOppositeDirection = (direction: Direction) => {
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
export const getNewPosition = (position: Position, direction: Direction) => {
  const new_position: Position = {y: -1, x: -1};
  switch (direction) {
    case Direction.top:
      new_position.y = position.y - 1;
      new_position.x = position.x;
      break;
    case Direction.left:
      new_position.y = position.y;
      new_position.x = position.x - 1;
      break;
    case Direction.right:
      new_position.y = position.y;
      new_position.x = position.x + 1;
      break;
    case Direction.bottom:
      new_position.y = position.y + 1;
      new_position.x = position.x;
      break;
    default:
      throw new Error("An error occured while generating maze");
  }
  return new_position;
};