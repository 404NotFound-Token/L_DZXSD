import { _decorator, Component, Node } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { SpiderHome } from './SpiderHome';
import { Vec3 } from 'cc';
import { Bezier } from '../Tools/Bezier';
import { Tween } from 'cc';
import { isValid } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Turret')
export class Turret extends Component {

    @property(Node)
    shootPoint: Node = null;

    @property(Node)
    towerHead: Node = null;

    protected start(): void {
        this.schedule(() => {
            this.shootCannonBall();
        }, 1);
    }

    bezierTween: Tween<Node> = null;

    /**
     * 发射炮弹
     */
    private shootCannonBall() {
        const cannonBall = ObjectPool.GetPoolItem("CannonBall", this.shootPoint);
        const spider = SpiderHome.getSpiderByTargetRange(this.shootPoint, 20);
        if (spider && isValid(spider.node)) {
            cannonBall.lookAt(spider.node.worldPosition);
            this.towerHead.lookAt(spider.node.worldPosition, Vec3.UP);


            const startPos = this.shootPoint.worldPosition;
            const endPos = spider.node.worldPosition;
            const ctrlPos = this.shootPoint.worldPosition.add(new Vec3(0, 5, 0));

            if (this.bezierTween) {
                this.bezierTween.start();
            } else {
                this.bezierTween = new Tween(cannonBall)
                    .bezierTo3D(1, startPos, ctrlPos, endPos)
                    .call(() => {
                        ObjectPool.PutPoolItem("CannonBall", cannonBall);
                    })
                    .start();
            }
        }
    }
}


