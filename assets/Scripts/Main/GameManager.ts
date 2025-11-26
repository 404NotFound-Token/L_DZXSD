import { resources } from 'cc';
import { _decorator, Component } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { MainGame } from './MainGame';
import { PhysicsSystem } from 'cc';
import { EventType, IEvent } from '../Config/IEvent';
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

        PhysicsSystem.instance.enable = true;
        PhysicsSystem.instance.debugDrawFlags = 1;


        this.scheduleOnce(() => {
            this.initPool();
        }, 1);
    }

    private initPool() {
        ObjectPool.ObjectPoolInit([
            { path: "Spider", num: 10 },
            { path: "Meat", num: 100 },
            { path: "Arrow", num: 100 },
        ]);

        IEvent.emit(EventType.GameStart);
    }
}


