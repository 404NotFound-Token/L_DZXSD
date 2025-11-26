import { _decorator, Component, Node } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { SpiderHome } from './SpiderHome';
import { ArrowTowerInfo } from '../Config/GameConfig';
import { Arrow } from './Arrow';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ArrowTower')
export class ArrowTower extends Component {

    @property(Node)
    shootPoint: Node = null;

    @property(Node)
    towerHead: Node = null;

    protected start(): void {
        this.shootArrow();
    }

    private shootArrow() {
        this.schedule((() => {
            const targetEnemy = SpiderHome.getSpiderByTargetRange(this.shootPoint, ArrowTowerInfo.AttackRange);
            const arrow = ObjectPool.GetPoolItem("Arrow", this.shootPoint);

            if (targetEnemy) {
                this.towerHead.lookAt(targetEnemy.node.worldPosition);
                arrow.lookAt(targetEnemy.node.worldPosition);
            }
            arrow.getComponent(Arrow).init(targetEnemy);
        }), ArrowTowerInfo.AttackInterval);
    }
}