import { isValid } from 'cc';
import { Vec3 } from 'cc';
import { _decorator, Component, Node, tween } from 'cc';
import { Spider } from './Spider';
import { ArrowTowerInfo } from '../Config/GameConfig';
import { ObjectPool } from '../Tools/ObjectPool';
import { Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Arrow')
export class Arrow extends Component {

    private target: Spider = null;

    public init(target: Spider) {
        this.target = target;
        this.fire();
    }

    fire() {
        if (this.target && isValid(this.target)) {
            const direction = new Vec3();
            Vec3.subtract(direction, this.target.node.worldPosition, this.node.worldPosition);
            const distance = direction.length();
            const duration = distance / ArrowTowerInfo.ArrowMoveSpeed;
            this.node.lookAt(this.target.node.worldPosition);

            tween(this.node)
                .to(duration, { worldPosition: this.target.node.worldPosition }
                )
                .call(() => {
                    Tween.stopAllByTarget(this.node);
                    ObjectPool.PutPoolItem("Arrow", this.node);
                    this.target.hurt(ArrowTowerInfo.AttackPower);
                })
                .start();
        } else {
            Tween.stopAllByTarget(this.node);
            ObjectPool.PutPoolItem("Arrow", this.node);
        }
    }
}