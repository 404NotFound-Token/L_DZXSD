import { resources } from 'cc';
import { _decorator, Component } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { MainGame } from './MainGame';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    protected onLoad(): void {
        resources.loadDir("Prefab", (err, assets) => {
            const assetsInfo = assets.map(asset => ({
                type: asset.constructor.name,
                name: asset.name,
                uuid: asset.uuid
            }));

            if (err) {
                console.log(`资源加载异常：${JSON.stringify(assetsInfo, null, 2)}`);
            } else {
                console.log(`资源加载成功：${JSON.stringify(assetsInfo, null, 2)}`);
            }
        });

        this.scheduleOnce(() => {
            this.initPool();
        }, 1);
    }

    private initPool() {
        ObjectPool.ObjectPoolInit([
            { path: "Spider", num: 10 },
        ]);

        MainGame.ins.loadSpider();
    }
}


