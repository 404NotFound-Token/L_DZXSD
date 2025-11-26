import { RigidBody } from 'cc';
import { ITriggerEvent } from 'cc';
import { Collider } from 'cc';
import { Enum } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ResourceType } from './Resources';
import { ColliderGroup } from '../Config/GameConfig';
import { Annie } from './Annie';
import { director } from 'cc';
import { Quat } from 'cc';
import { Vec3 } from 'cc';
import { TransformUtils } from '../Tools/TransformUtils';
import { ObjectPool } from '../Tools/ObjectPool';
import { Label } from 'cc';
import { Sprite } from 'cc';
import { Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DiTie')
export class DiTie extends Component {

    @property({ type: Enum(ResourceType) })
    public type: ResourceType = ResourceType.None;

    @property(Sprite)
    green: Sprite = null;

    @property(Label)
    label: Label = null;

    @property
    maxNumber: number = 50;

    @property({ type: Node, tooltip: "改地贴要解锁的建筑" })
    private build: Node = null;

    private currentCount: number = 0;

    private rigidBody: RigidBody = null;
    private collider: Collider = null;

    protected onLoad(): void {
        this.rigidBody = this.getComponent(RigidBody);
        this.collider = this.getComponent(Collider);

        this.green.fillRange = 0;
        this.label.string = `${this.currentCount}/${this.maxNumber}`;
    }

    start() {
        this.collider.on('onTriggerEnter', this._onTriggerEnter, this);
        this.collider.on('onTriggerStay', this._onTriggerStay, this);
        this.collider.on('onTriggerExit', this._onTriggerExit, this);
    }



    private _onTriggerEnter(e: ITriggerEvent) {

    }


    private _onTriggerStay(e: ITriggerEvent) {
        if (e.otherCollider.getGroup() === ColliderGroup.Annie) {
            switch (this.type) {
                case ResourceType.Meat:
                    this.submitMeat();
                    break;
            }
        }
    }


    private _onTriggerExit(e: ITriggerEvent) {

    }

    private submitMeat() {
        const meatBag = Annie.ins.meatBag;
        const meat = meatBag.lastItem();
        TransformUtils.changeParent(meat, director.getScene())
        Annie.ins.meatBag.remove(meat, this.node, ((success) => {
            if (success) {
                meat.isCheck = true;
                Tween.stopAllByTarget(meat.node);
                ObjectPool.PutPoolItem("Meat", meat.node);
                this.currentCount++;
                if (this.currentCount >= this.maxNumber) {
                    this.build.active = true;
                    this.node.active = false;
                    return;
                };
                this.label.string = `${this.currentCount}/${this.maxNumber}`;
                this.green.fillRange = this.currentCount / this.maxNumber;
            }
        }))
    }
}


