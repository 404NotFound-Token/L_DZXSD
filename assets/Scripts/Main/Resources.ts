import { Enum } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Annie } from './Annie';
const { ccclass, property } = _decorator;

export enum ResourceType {
    None = "None",
    Meat = "Meat",
}

@ccclass('Resources')
export class Resources extends Component {

    @property({ type: Enum(ResourceType) })
    public resourceType: ResourceType = ResourceType.None;

    private checkRange: number = 5;

    private annie: Node = null;
    private annieComp: Annie = null;

    protected onLoad(): void {
        this.annie = this.node.parent;
        this.annieComp = this.annie.getComponent(Annie);

    }

    checkAnnie() {

    }

}


