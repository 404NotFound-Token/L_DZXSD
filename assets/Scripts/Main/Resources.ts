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

    // private annie: Node = null;
    // private annieComp: Annie = null;


    // protected onLoad(): void {
    //     this.annie = Annie.ins.node;
    //     this.annieComp = this.annie.getComponent(Annie);
    // }

    checkAnnie() {
        this.schedule(() => {
            if (!this.isCheck) return;

            const annie = Annie.ins.node;

            const bol = Vec3.distance(this.node.worldPosition, annie.worldPosition) <= this.checkRange;
            if (bol) {
                const bag = annie.getComponent(Bag);
                bag.add(this,
                    (success) => {
                        if (success) {
                            console.log("物品成功添加到背包");
                        } else {
                            console.log("添加失败");
                        }
                    },
                    0.5
                );
            }
        }, 0.1)
    }
}


