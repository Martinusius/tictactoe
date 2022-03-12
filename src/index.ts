type Bounds = null | { minX: number; minY: number; maxX: number; maxY: number };

interface TicTacToeEventMap {
    'win': (winner: string) => void,
    'draw': () => void,
}

type GoalPath = { x: number, y: number}[];

class TicTacToe {
    private _board: Record<string, string> = {};
    private _bounds: Bounds = { minX: 0, maxX: 2, minY: 0, maxY: 2 };
    
    private _winCallbacks: ((winner?: string, goalPath?: GoalPath) => void)[] = [];
    private _drawCallbacks: (() => void)[] = [];

    private _goal = 3;

    private _fillPosition = { x: 0, y: 0 };

    boundingBox: Bounds = null;

    gameOver: boolean = false;
    winner: string | null = null;
    goalPath: GoalPath | null = null;
    

    constructor() {}

    private _checkWinner(x: number, y: number, player: string) {
        const checkLine = (dx: number, dy: number) => {
            let _x = x + dx, _y = y + dy;

            const path: GoalPath = [];

            while(this._board[`${_x},${_y}`] === player) {
                path.push({ x: _x, y: _y });

                _x += dx;
                _y += dy;
            }

            return path;
        }

        const directions = [
            [...checkLine(1, 0), ...checkLine(-1, 0)],
            [...checkLine(0, 1), ...checkLine(0, -1)],
            [...checkLine(1, 1), ...checkLine(-1, -1)],
            [...checkLine(1, -1), ...checkLine(-1, 1)]
        ];

        const goalPath = [{ x, y }];

        directions.forEach(direction => {
            if(direction.length + 1 >= this._goal)
            goalPath.push(...direction);
        });

        if(goalPath.length > 1) {
            this.gameOver = true;
            this.winner = player;
            this.goalPath = goalPath;
            this._winCallbacks.forEach(callback => callback(player, goalPath));
        }
    }

    private _moveFill() {
        if(!this._bounds || this.gameOver) return;

        while(this._board[`${this._fillPosition.x},${this._fillPosition.y}`] !== undefined) {
            

            if(this._fillPosition.x === this._bounds.maxX) {
                if(this._fillPosition.y === this._bounds.maxY) {
                    this.gameOver = true;
                    this._drawCallbacks.forEach(callback => callback());
                    return;
                }

                this._fillPosition.x = this._bounds.minX;
                this._fillPosition.y++;

                continue;
            }
            
            this._fillPosition.x++;
        }
    }


    bounds(minX: number, minY: number, maxX: number, maxY: number) {
        if(minX > maxX || minY > maxY) {
            throw new Error(`Invalid bounds: ${minX}, ${minY}, ${maxX}, ${maxY}`);
        }

        this._bounds = { minX, minY, maxX, maxY };
        this._fillPosition = { x: minX, y: minY };

        return this;
    }

    size(width: number, height: number = width) {
        if(width <= 0 || height <= 0) {
            throw new Error(`Invalid size (not positive): ${width}, ${height}`);
        }

        this._bounds = { minX: 0, minY: 0, maxX: width - 1, maxY: height - 1 };
        this._fillPosition = { x: 0, y: 0 };

        return this;
    }

    infinite() {
        this._bounds = null;

        return this;
    }

    goal(goal: number) {
        if(goal <= 0) {
            throw new Error(`Invalid goal (not positive): ${goal}`);
        }

        this._goal = goal;

        return this;
    }

    move(x: number, y: number, player: string) {
        if(this.gameOver) {
            throw new Error('Cannot move: This game is already over');
        }

        if(typeof player !== 'string') {
            throw new Error('The move has to be a string');
        }

        if(this._bounds && (this._bounds.minX > x || this._bounds.maxX < x || this._bounds.minY > y || this._bounds.maxY < y)) {
            throw new Error(`Move out of bounds: (Move: ${x}, ${y}, Bounds: ${this._bounds.minX}, ${this._bounds.minY}, ${this._bounds.maxX}, ${this._bounds.maxY})`);
        }

        if(this._board[`${x},${y}`] !== undefined) {
            throw new Error('Cannot move: Position is already taken');
        }

        if(!this.boundingBox) {
            this.boundingBox = { minX: x, minY: y, maxX: x, maxY: y };
        }
        else {
            this.boundingBox = {
                minX: Math.min(this.boundingBox.minX, x),
                minY: Math.min(this.boundingBox.minY, y),
                maxX: Math.max(this.boundingBox.maxX, x),
                maxY: Math.max(this.boundingBox.maxY, y)
            };
        }

        this._board[`${x},${y}`] = player;
        this._checkWinner(x, y, player);

        this._moveFill();

        return this;
    }


    on<K extends keyof TicTacToeEventMap>(event: K, callback: TicTacToeEventMap[K]) {
        if(event === 'draw') {
            this._drawCallbacks.push(callback as any);
        }
        else if(event === 'win') {
            this._winCallbacks.push(callback as any);
        }

    }

    get(x: number, y: number) {
        if(this._bounds && (this._bounds.minX > x || this._bounds.maxX < x || this._bounds.minY > y || this._bounds.maxY < y)) {
            throw new Error(`Get out of bounds: (Get: ${x}, ${y}, Bounds: ${this._bounds.minX}, ${this._bounds.minY}, ${this._bounds.maxX}, ${this._bounds.maxY})`);
        }

        return this._board[`${x},${y}`] || null;
    }

    reset() {
        this.gameOver = false;
        this.winner = null;
        this.goalPath = null;

        this._fillPosition = { x: 0, y: 0 };
        this._board = {};
    }
}

export default function tictactoe() {
    return new TicTacToe();
}
