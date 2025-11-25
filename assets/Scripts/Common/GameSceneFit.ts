// import { _decorator, Camera, Component, ResolutionPolicy, screen, Size, view } from 'cc';
// import { UIMager } from '../UIMager';
// import { tween } from 'cc';
// import { CameraConfig } from '../config/GameData';
// import { director } from 'cc';
// import { EVENT_TYPE, IEvent } from '../tools/CustomEvent';
// const { ccclass, property } = _decorator;

// @ccclass('GameSceneFit')
// export class GameSceneFit extends Component {
//     @property(Camera)
//     gameCamera: Camera = null!;

//     start() {
//         view.on("canvas-resize", this.resize, this);
//         this.scheduleOnce(this.resize);

//         // @ts-ignore
//         if (window.setLoadingProgress) {
//             // @ts-ignore
//             window.setLoadingProgress(100);
//         }

//         IEvent.on(EVENT_TYPE.UPGRADE_LEVEL, this.resize, this);
//     }

//     update(deltaTime: number) {

//     }

//     private viewScale: number = 1;
//     private gameRatio: number = 1;

//     public get _viewScale() {
//         return this.viewScale;
//     }

//     public get _gameRatio() {
//         return this.gameRatio;
//     }

//     private resize(e?) {

//         let screenInPx: Size = screen.windowSize; // 屏幕像素尺寸
//         const sceneRatio = screenInPx.width / screenInPx.height; // 场景宽高比
//         this.gameRatio = sceneRatio;

//         // 判断是否为竖屏
//         const isPortrait = screenInPx.width < screenInPx.height;

//         console.log("屏幕方向:", isPortrait ? "竖屏" : "横屏", "尺寸:", screenInPx.width, "x", screenInPx.height);

//         if (screen.windowSize.height > screen.windowSize.width && screen.windowSize.width / screen.windowSize.height < 1) {
//             view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);

//             tween(this.gameCamera)
//                 .to(0.2, { orthoHeight: CameraConfig.Vertical_orthoHeight })
//                 .call(() => {
//                     console.log("横屏:", this.gameCamera.orthoHeight);
//                 })
//                 .start();
//             this.viewScale = screen.windowSize.height / screen.windowSize.width;
//             UIMager.instance.refeshUI();

//         } else {
//             view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);

//             tween(this.gameCamera)
//                 .to(0.2, { orthoHeight: CameraConfig.Horizontal_orthoHeight })
//                 .call(() => {
//                     console.log("竖屏:", this.gameCamera.orthoHeight);
//                 })
//                 .start();

//             this.viewScale = screen.windowSize.width / screen.windowSize.height;
//             UIMager.instance.refeshUI(this.viewScale)
//         }

//         console.log("缩放比例:", this.viewScale);
//         console.log("游戏宽高比:", this.gameRatio);
//     }
// }