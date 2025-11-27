import { _decorator, Component, Node } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { Spider } from './Spider';
import { Vec3 } from 'cc';
import { Bezier } from '../Tools/Bezier';
import { Effect } from '../Tools/Effect';
import { Resources } from './Resources';
import { EventType, IEvent } from '../Config/IEvent';
import { SpiderHome } from './SpiderHome';
import { DiTie } from './DiTie';
const { ccclass, property } = _decorator;

@ccclass('MainGame')
export class MainGame extends Component {
    public static ins: MainGame = null;


    @property({ type: DiTie, displayName: "地贴", tooltip: "用于解锁炮塔" })
    public diTie1: DiTie = null;

    @property({ type: DiTie, displayName: "地贴", tooltip: "用于解锁炮塔" })
    public diTie2: DiTie = null;

    protected onLoad(): void {
        MainGame.ins = this;

        IEvent.on(EventType.Upgrade, this.upgrade, this)
    }

    upgrade() {
        // SpiderHome.ins.isLoad = true;
        this.diTie1.node.active = true;
        this.diTie2.node.active = true;
    }

    public dropMeat(startPos: Vec3) {
        for (let i = 0; i < 5; i++) {
            const meat = ObjectPool.GetPoolItem("Meat", this.node);
            meat.setScale(new Vec3(0.5, 0.5, 0.5));
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
                            meat.setScale(new Vec3(0.5, 0.5, 0.5));
                            meat.getComponent(Resources).isCheck = true;
                            meat.getComponent(Resources).checkAnnie();
                        })
                        .start();
                });
        }
    }
}


