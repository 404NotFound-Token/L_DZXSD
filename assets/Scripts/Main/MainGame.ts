import { _decorator, Component, Node } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { Spider } from './Spider';
import { Vec3 } from 'cc';
import { Bezier } from '../Tools/Bezier';
import { Effect } from '../Tools/Effect';
import { Resources } from './Resources';
const { ccclass, property } = _decorator;

@ccclass('MainGame')
export class MainGame extends Component {

    public static ins: MainGame = null;

    protected onLoad(): void {
        MainGame.ins = this;
    }

    public dropMeat(startPos: Vec3) {
        const meat = ObjectPool.GetPoolItem("Meat", this.node);
        meat.setWorldPosition(startPos);

        const randomRadius = 1; // 随机半径范围
        const randomAngle = Math.random() * Math.PI;
        const offsetX = Math.cos(randomAngle) * randomRadius;
        const offsetZ = Math.sin(randomAngle) * randomRadius;

        const endPos = new Vec3(
            startPos.x + offsetX,
            0,
            startPos.z + offsetZ
        );

        const ctrlPos = new Vec3(
            startPos.x + offsetX * 0.5,
            2,
            startPos.z + offsetZ * 0.5
        );

        Bezier.createBezierTween(
            meat,
            startPos, ctrlPos,
            endPos,
            0.2,
            () => {
                Effect.jellyEffect(meat)
                    .call(() => {
                        meat.getComponent(Resources).checkAnnie();
                    })
                    .start();
            });
    }
}


