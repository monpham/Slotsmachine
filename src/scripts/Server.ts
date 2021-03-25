const spinDataMocked = [
    ['1', '2', '3', '4', '5', '6', '7', 'K', '1', '2', '3', '4', '5', '6', '7'],
    ['1', '2', '6', '2', '1', '6', '4', 'K', '5', '2', '8', '3', '3', '3', '3'],
    ['1', '2', '6', '3', '4', '7', 'K', 'K', 'K', '1', '3', '5', '2', '4', '2'],
    ['1', '2', '3', '4', '3', '5', '3', '8', '3', '1', '5', '3', '4', '5', '7'],
    ['2', '7', '3', '2', '3', '8', '7', '3', 'K', '1', '5', '3', '4', '6', '5'],
    ['2', '7', '3', 'K', '6', '8', '5', '2', 'K', '1', '5', '3', '4', '5', '8']
];

/**
 * A fake Server class that simulating Client-Server communication for mini-game
 */
export default class Server {

    private _dataRespondCallbacks: Function[] = [];
// Đây là chức năng hiện ra cái giá trị 
// ['1', '2', '3', '4', '5', '6', '7', 'K', '1', '2', '3', '4', '5', '6', '7'],
// ['1', '2', '6', '2', '1', '6', '4', 'K', '5', '2', '8', '3', '3', '3', '3'],
// ['1', '2', '6', '3', '4', '7', 'K', 'K', 'K', '1', '3', '5', '2', '4', '2'],
// ['1', '2', '3', '4', '3', '5', '3', '8', '3', '1', '5', '3', '4', '5', '7'],
// ['2', '7', '3', '2', '3', '8', '7', '3', 'K', '1', '5', '3', '4', '6', '5'],
// ['2', '7', '3', 'K', '6', '8', '5', '2', 'K', '1', '5', '3', '4', '5', '8']
    public registerDataRespondEvent (callback: Function): void {
        this._dataRespondCallbacks.push(callback);
    }

    public requestSpinData (): void {
// đây là phần data được gọi vào _startSpin
        const delay = this._randomRange(100, 1500) + ((Math.random() > 0.8) ? 2000 : 0);
        window.setTimeout(() => {

            const index = this._randomRange(0, spinDataMocked.length - 1, true);
            const data: string[] = [];
            Object.assign(data, spinDataMocked[index]);

            this._dataRespondCallbacks.forEach((callback) => {
                callback(data);
            });
        }, delay);
    }

    private _randomRange (min: number, max: number, int: boolean = false) {
/// Đây là phần sẽ random 
        const delta = max - min;
        const rnd = Math.random();
        let result = min + rnd * delta;
        if (int) {
            result = Math.round(result);
        }
        return result;
    }
}