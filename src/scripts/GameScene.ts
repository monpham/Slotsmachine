import * as PIXI from 'pixi.js';
import { MainApp } from './app';
import Server from './Server';



const symbolTextures = {

   // Phần chứa hình ảnh khi chơi trò chơi sẽ thay đổi 

};


const symbolTypes = ['1', '2', '3', '4', '5', '6', '7', '8', 'K'];
export class GameScene extends PIXI.Container {
    constructor (server: Server) {
        super();
        this._server = server;
        // Phần này là chỉ server , được hiểu giống như Setter , hoặc repository Save chỉ đến Server với phương thức lưu (Set DATA trả về )
        this._server.registerDataRespondEvent(this._onSpinDataResponded.bind(this));
        // phần gọi các tính năng bên dưới . 
        // ví dụ     MainApp.inst.app.ticker.add(this._onAssetsLoaded, this); : sẽ làm ứng dụng vòng lập vô tận 
    
        MainApp.inst.app.ticker.add(this.onUpdate, this);
        // Phần load hình ảnh ra đầu tiên 
        MainApp.inst.app.loader
            .add('logo', 'images/logo.png')
            .add('symbol_1', 'images/symbol_1.png')
            .add('symbol_2', 'images/symbol_2.png')
            .add('symbol_3', 'images/symbol_3.png')
            .add('symbol_4', 'images/symbol_4.png')
            .add('symbol_5', 'images/symbol_5.png')
            .add('symbol_6', 'images/symbol_6.png')
            .add('symbol_7', 'images/symbol_7.png')
            .add('symbol_8', 'images/symbol_8.png')
            .add('symbol_K', 'images/symbol_K.png')
            .load(this._onAssetsLoaded.bind(this));

    }
    // static Phương thức tĩnh  ,
    // Readonly có thể được khởi tạo vào thời điểm khai báo hoặc trong constructor của class đó. 
    // Vì vậy các biến readonly có thể được sử dụng như là các hằng số lúc thực thi
    static readonly NUMBER_OF_REELS = 5;
    static readonly NUMBER_OF_ROWS = 3;
    static readonly SYMBOL_WIDTH = 140;
    static readonly SYMBOL_HEIGHT = 150;

    // khai báo truy cập nội bộ 
    // Bên java sẽ được khai báo là 
    // private Server server = new Server();
    private _server: Server;
    private _isInitialized: boolean = false;
    private _logoSprite: PIXI.Sprite;
    private _spinText: PIXI.Text;



    public init (): void {

        this.addChild(this._logoSprite);
        this._logoSprite.position.set(720 / 2, 100);
        this._logoSprite.anchor.set(0.5);
        this._logoSprite.scale.set(0.5);
    // Phần hình ảnh và bố cục 
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });
        this._spinText = new PIXI.Text('Start Spin', style);
        this._spinText.x = 720 / 2 - this._spinText.width / 2;
        this._spinText.y = MainApp.inst.app.screen.height - 100 + Math.round((100 - this._spinText.height) / 2);
        // Phần Code mẫu ở trang Pixijs minh họa - khi gỡ comment thì sẽ hiện ra trạng thái báo lỗi 
        // vì phần code này khác với cách code của bài đã cho. 
        // const style = new PIXI.TextStyle({
        //     fontFamily: 'Arial',
        //     fontSize: 36,
        //     fontStyle: 'italic',
        //     fontWeight: 'bold',
        //     fill: ['#ffffff', '#00ff99'], // gradient
        //     stroke: '#4a1850',
        //     strokeThickness: 5,
        //     dropShadow: true,
        //     dropShadowColor: '#000000',
        //     dropShadowBlur: 4,
        //     dropShadowAngle: Math.PI / 6,
        //     dropShadowDistance: 6,
        //     wordWrap: true,
        //     wordWrapWidth: 440,
        // });
    
        // const playText = new PIXI.Text('Spin the wheels!', style);
        // playText.x = Math.round((bottom.width - playText.width) / 2);
        // playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
        // bottom.addChild(playText);
    
        // // Add header text
        // const headerText = new PIXI.Text('PIXI MONSTER SLOTS!', style);
        // headerText.x = Math.round((top.width - headerText.width) / 2);
        // headerText.y = Math.round((margin - headerText.height) / 2);
        // top.addChild(headerText);
    
        // app.stage.addChild(top);
        // app.stage.addChild(bottom);

        this.addChild(this._spinText);
        this._spinText.interactive = true;
        this._spinText.buttonMode = true;
        this._spinText.addListener('pointerdown', this._startSpin.bind(this));
        this._isInitialized = true;
        const boardContainer = this.addChild(new PIXI.Container());        
        boardContainer.position = new PIXI.Point(720 / 2, 960 / 2 + 100);
        const boardWidth = GameScene.SYMBOL_WIDTH * GameScene.NUMBER_OF_REELS;
        const boardHeight = GameScene.SYMBOL_HEIGHT * GameScene.NUMBER_OF_ROWS;
        // bảng Mặc định đây chính là mặc định của các tham số sẽ bắt đầu 
        const defaultBoard = ['2', '7', '3', '4', '6', '8', '7', '3', 'K', '1', '5', '3', '4', '5', '6'];

        defaultBoard.forEach((symbol, idx) => {
            const reelId = Math.floor(idx / GameScene.NUMBER_OF_ROWS);
            const symbolId = idx % GameScene.NUMBER_OF_ROWS;
            const pos = new PIXI.Point(reelId * GameScene.SYMBOL_WIDTH - boardWidth / 2 + GameScene.SYMBOL_WIDTH / 2, symbolId * GameScene.SYMBOL_HEIGHT - boardHeight / 2);
            const symbolSpr = new PIXI.Sprite(symbolTextures[symbol]);
            symbolSpr.position = pos;
            symbolSpr.anchor.set(0.5);
            boardContainer.addChild(symbolSpr);
        });

     
    }

    public onUpdate (dtScalar: number) {
        const dt = dtScalar / PIXI.settings.TARGET_FPMS / 1000;
        if (this._isInitialized) {
            this._logoSprite.rotation += 0.01;
        // Phần xác nhận hình ảnh và các thông số cuối cùng 
        }
    }

    private _startSpin (): void {
        console.log(` >>> start spin`);
        this._server.requestSpinData();
    // Phần bắt đầu trò chơi . request SpinData được nối với phần bên server . 
    // Gửi đi 
    }

    private _onSpinDataResponded (data: string[]): void {
        console.log(` >>> received: ${data}`);
    // Dữ liệu được phản hồi từ máy chủ 
    // Nhận về     
    }

    private _onAssetsLoaded (loaderInstance: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>): void {
    // Phần chứa các hình ảnh sẽ thay đổi đến lúc cuối và các tham số . 
    // Phần này chính là phần gọi hình ảnh ở trên với vòng lập và logo.
        this._logoSprite = new PIXI.Sprite(resources['logo'].texture);
        symbolTypes.forEach((type) => {
            symbolTextures[type] = resources[`symbol_${type}`].texture;
        });
        
        this.init();
    }




};

