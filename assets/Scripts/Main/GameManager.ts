import { resources } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    protected onLoad(): void {
        resources.preloadDir("Prefab", (err, assets) => {
            if (err) {
                console.log(`资源加载异常：${err}`);
            } else {
                console.log(`资源加载成功数量：${assets.length}`);
            }
        });
        this.initPool();
    }

    initPool() {
        ObjectPool.ObjectPoolInit([
            { path: "zhizhu", num: 10 },
        ]);
    }
}


