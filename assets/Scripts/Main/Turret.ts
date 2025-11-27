import { _decorator, Component, Node } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { SpiderHome } from './SpiderHome';
import { Vec3 } from 'cc';
import { Bezier } from '../Tools/Bezier';
import { Tween } from 'cc';
import { isValid } from 'cc';
import { TowerInfo } from '../Config/GameConfig';
import { tween } from 'cc';
import { Utils } from '../Tools/Utils';
const { ccclass, property } = _decorator;

@ccclass('Turret')
export class Turret extends Component {

    @property(Node)
    shootPoint: Node = null;

    @property(Node)
    towerHead: Node = null;

    @property(Node)
    bulletParent: Node = null;

    protected start(): void {
        this.schedule(() => {
            this.shootCannonBall();
        }, TowerInfo.Cannon.AttackInterval);
    }

    /**
     * 发射炮弹
     */
    private shootCannonBall() {
        const cannonBall = ObjectPool.GetPoolItem("CannonBall", this.bulletParent);
        cannonBall.setWorldPosition(this.shootPoint.worldPosition);
        const spider = SpiderHome.getSpiderByTargetRange(this.node, TowerInfo.Cannon.AttackRange);
        if (spider && isValid(spider.node)) {
            console.log("发射炮弹");
            // cannonBall.lookAt(spider.node.worldPosition);
            this.towerHead.lookAt(spider.node.worldPosition, Vec3.UP);

            const startPos = this.shootPoint.worldPosition.clone();
            const endPos = spider.node.worldPosition.clone();
            let controlPos = new Vec3();
            controlPos = Vec3.add(controlPos, startPos, endPos)
            controlPos.multiplyScalar(0.5);
            controlPos.y += 5;

            let worldPos = new Vec3();
            tween({ process: 0 })
                .to(0.5, { process: 1 }, {
                    onUpdate: (t) => {
                        Utils.bezierCurve(t.process, startPos, controlPos, endPos, worldPos)
                        cannonBall.setWorldPosition(worldPos);
                        cannonBall.lookAt(worldPos);
                    }
                })
                .call(() => {
                    ObjectPool.PutPoolItem("CannonBall", cannonBall);
                    const spiders = SpiderHome.findSpidersInRange(endPos, 3);
                    spiders.forEach(spider => {
                        console.log("命中", spider);
                        spider.hurt(TowerInfo.Cannon.AttackPower);
                    });
                })
                .start();
            // new Tween(cannonBall)
            //     .bezierTo3D(1, startPos, controlPos, endPos)
            //     .call(() => {
            //         ObjectPool.PutPoolItem("CannonBall", cannonBall);
            //         const spiders = SpiderHome.findSpidersInRange(endPos, 3);
            //         spiders.forEach(spider => {
            //             console.log("命中", spider);
            //             spider.hurt(TowerInfo.Cannon.AttackPower);
            //         });
            //     })
            //     .start();


        } else {
            console.log("没有目标");
            ObjectPool.PutPoolItem("CannonBall", cannonBall);
        }
    }
}


