import { Enum } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Annie } from './Annie';
import { Vec3 } from 'cc';
import { Bag } from './Bag';
const { ccclass, property } = _decorator;

export enum ResourceType {
    None = "None",
    Meat = "Meat",
}

@ccclass('Resources')
export class Resources extends Component {

    @property({ type: Enum(ResourceType) })
    public resourceType: ResourceType = ResourceType.None;

    public isCheck: boolean = true;

    private checkRange: number = 30;

    checkAnnie() {
        this.schedule(() => {
            if (!this.isCheck) return;
            const bol = Vec3.distance(this.node.worldPosition, Annie.ins.node.worldPosition) <= this.checkRange;
            if (bol) {
                switch (this.resourceType) {
                    case ResourceType.Meat:
                        this.colletMeat();

                        break;
                }
            }
        }, 0.1)
    }

    private colletMeat() {
        const meatBag = Annie.ins.meatBag;
        meatBag.add(this,
            (success) => {
                if (success) {
                    this.isCheck = false;
                }
            },
            0.5
        );
    }



}


