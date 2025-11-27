import { _decorator, Camera, Component, ResolutionPolicy, screen, Size, view } from 'cc';
import { tween } from 'cc';
import { EventType, IEvent } from '../Config/IEvent';
const { ccclass, property } = _decorator;

@ccclass('GameSceneFit')
export class GameSceneFit extends Component {

    @property(Camera)
    gameCamera: Camera = null!;

    private cameraHeight: number = 18;

    start() {
        view.on("canvas-resize", this.resize, this);
        this.scheduleOnce(this.resize);

        // @ts-ignore
        if (window.setLoadingProgress) {
            // @ts-ignore
            window.setLoadingProgress(100);
        }

        IEvent.on(EventType.Upgrade, this._upgrade, this);
    }

    private _upgrade() {
        this.cameraHeight = 25;
        this.resize();
    }

    public static viewScale: number = 1;

    private resize(e?) {
        let screenInPx: Size = screen.windowSize; // 屏幕像素尺寸
        const sceneRatio = screenInPx.width / screenInPx.height; // 场景宽高比
        GameSceneFit.viewScale = sceneRatio;

        const isPortrait = screenInPx.width < screenInPx.height;

        if (screen.windowSize.height > screen.windowSize.width && screen.windowSize.width / screen.windowSize.height < 1) {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);

            tween(this.gameCamera)
                .to(0.2, { orthoHeight: this.cameraHeight })
                .start();
        } else {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);

            tween(this.gameCamera)
                .to(0.2, { orthoHeight: this.cameraHeight })
                .start();
        }

        console.log(
            `%c屏幕方向: ${isPortrait ? "竖屏" : "横屏"}\n` +
            `分辨率: ${screenInPx.width} x ${screenInPx.height}\n` +
            `场景宽高比: ${sceneRatio}`,
            'color: blue ;',
        );
    }
}