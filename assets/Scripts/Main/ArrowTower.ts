import { _decorator, Component, Node } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { SpiderHome } from './SpiderHome';
import { Arrow } from './Arrow';
import { Vec3 } from 'cc';
import { isValid } from 'cc';
import { tween } from 'cc';
import { Tween } from 'cc';
import { TowerInfo } from '../Config/GameConfig';
const { ccclass, property } = _decorator;

@ccclass('ArrowTower')
export class ArrowTower extends Component {

    @property(Node)
    shootPoint: Node = null;

    @property(Node)
    towerHead: Node = null;

    @property(Node)
    bulletParent: Node = null;

    protected start(): void {
        this.schedule(() => {
            this.shootArrow();
        }, TowerInfo.Arrow.AttackInterval)
    }

    private shootArrow() {
        // this.schedule((() => {
        const arrow = ObjectPool.GetPoolItem("Arrow", this.bulletParent);
        arrow.setWorldPosition(this.shootPoint.worldPosition);
        const targetEnemy = SpiderHome.getSpiderByTargetRange(this.shootPoint,  TowerInfo.Arrow.AttackRange);

        if (targetEnemy && isValid(targetEnemy)) {
            this.towerHead.lookAt(targetEnemy.node.worldPosition);
            arrow.lookAt(targetEnemy.node.worldPosition);
            // arrow.getComponent(Arrow).init(targetEnemy);

            const direction = new Vec3();
            Vec3.subtract(direction, targetEnemy.node.worldPosition, this.node.worldPosition);
            const distance = direction.length();
            const duration = distance /  TowerInfo.Arrow.ArrowMoveSpeed;

            tween(arrow)
                .to(duration, { worldPosition: targetEnemy.node.worldPosition }
                )
                .call(() => {
                    Tween.stopAllByTarget(arrow);
                    ObjectPool.PutPoolItem("Arrow", arrow);
                    targetEnemy.hurt( TowerInfo.Arrow.AttackPower);
                })
                .start();
        } else {
            Tween.stopAllByTarget(arrow);
            ObjectPool.PutPoolItem("Arrow", arrow);
        }
    }
    // }),  TowerInfo.Arrow.AttackInterval);
}
