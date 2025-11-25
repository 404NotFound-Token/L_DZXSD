import { CCBoolean } from 'cc';
import { Quat } from 'cc';
import { Vec3 } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export let cameraToTarget_offset: Vec3 = new Vec3();
export let camera_worldRotation: Quat = new Quat();

@ccclass('CameraCtrl')
export class CameraCtrl extends Component {

    @property(Node) target: Node = null;

    onLoad() {
        camera_worldRotation = this.node.worldRotation.clone();
        cameraToTarget_offset = this.node.worldPosition.clone().subtract(this.target.worldPosition.clone());
    }

    update(dt: number) {
        const targetPos = this.target.worldPosition.clone();
        const cameraPos = targetPos.add(cameraToTarget_offset);
        this.node.setWorldPosition(cameraPos);
    }
}


