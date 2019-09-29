
const DIRECTION_TRESHOLD = 0.1;

export class Points {
    constructor(X, Y) {
        this.x = X;
        this.y = Y;
    }
}
export class HandsPosition {
    constructor(leftHand, rightHand) {
        this.left = leftHand;
        this.right = rightHand;
    }
}

export const Direction = {
    LEFT: 1,
    RIGHT: 2,
    STRAIGHT: 0
}
/**
 * 
 * @param {HandsPositions} handsPosition 
 * returns undefined if the input is not acceptable
 */
export function coordsToDirection(handsPosition) {
    if (handsPosition && handsPosition.left && handsPosition.right) {
        if (handsPosition.left.x && handsPosition.left.y
            && handsPosition.right.x && handsPosition.right.y) {
            return {
                direction: getDirection(handsPosition.left.y, handsPosition.right.y),
                intensity: getDirectionIntensity(handsPosition)
            }
        }
    }
    return undefined;
}

function getDirection(leftY, rightY) {
    if (leftY > rightY + DIRECTION_TRESHOLD) {
        return Direction.LEFT;
    }
    else if (rightY > leftY + DIRECTION_TRESHOLD) {
        return Direction.RIGHT;
    }
    return Direction.STRAIGHT;
}
// returns value from 0 to 1
function getDirectionIntensity(handsPosition) {
    const vec = getVectorBetweenHands(handsPosition);
    console.log('vector :');
    console.log(vec);
    const norm = getVectorLength(vec); 
    console.log(norm);
    return Math.abs(vec.y)/norm;
}

function getVectorBetweenHands(handsPosition) {
    return new Points(
        handsPosition.left.x - handsPosition.right.x,
        handsPosition.left.y - handsPosition.right.y
    );
}

function getVectorLength(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}



function test() {
    let leftHand = new Points(0.5143422484397888, 0.7054749250411987);
    let rightHand = new Points(0.20286448299884796, 0.5620867609977722);
    let testpos = new HandsPosition(leftHand, rightHand);
    let out = coordsToDirection(testpos);
    console.log(out);
}

test();