const BALL_COLOURS = ['#1D5C98', '#1D97CF', '#A8B336', '#0094A8', '#E2ECF0']

const group_start = {x: 733, y:16}; // Top Right cluster xy start
const group_x_diff = 28; // x distance between balls
const group_y_diff = 28; // y distance between balls

export const startingBalls = [
    {x: 0, y: 90, size: 100, colour: BALL_COLOURS[0], }, // Top Left Ball
    {x: 50, y: 400, size: 450, colour: BALL_COLOURS[1], }, // Bottom Left Ball
    // Top Right Balls Cluster
    {x: group_start.x, y: group_start.y, size: 14, colour: BALL_COLOURS[3], },  // Top Left of the cluster
    {x: group_start.x, y: group_start.y + group_y_diff, size: 10, colour: BALL_COLOURS[0], }, // One down
    {x: group_start.x, y: group_start.y + group_y_diff*2, size: 8, colour: BALL_COLOURS[1], }, // Two down
    {x: group_start.x, y: group_start.y + group_y_diff*3, size: 17, colour: BALL_COLOURS[2], }, // Three down
    {x: group_start.x, y: group_start.y + group_y_diff*4, size: 19, colour: BALL_COLOURS[4], }, // Four down
    {x: group_start.x, y: group_start.y + group_y_diff*5, size: 6, colour: BALL_COLOURS[1], }, // Five down
      // Right Column
    {x: group_start.x + group_x_diff, y: group_start.y, size: 13, colour: BALL_COLOURS[2], },  // Top Right of the cluster
    {x: group_start.x + group_x_diff, y: group_start.y + group_y_diff, size: 10, colour: BALL_COLOURS[0], }, // One down
    {x: group_start.x + group_x_diff, y: group_start.y + group_y_diff*2, size: 20, colour: BALL_COLOURS[4], }, // Two down
    {x: group_start.x + group_x_diff, y: group_start.y + group_y_diff*3, size: 10, colour: BALL_COLOURS[1], }, // Three down
    {x: group_start.x + group_x_diff, y: group_start.y + group_y_diff*4, size: 18, colour: BALL_COLOURS[0], }, // Four down
    {x: group_start.x + group_x_diff, y: group_start.y + group_y_diff*5, size: 7, colour: BALL_COLOURS[1], }, // Five down
 
    // Top Right Balls End
    {x: 730, y: 420, size: 320, colour: BALL_COLOURS[3], }, // bottom right ball
    {x: 650, y: 205, size: 88, colour: BALL_COLOURS[0], }, // bottom right ball
    {x: 705, y: 255, size: 125, colour: BALL_COLOURS[2], }, // bottom right yellow middle ball
  ]
 