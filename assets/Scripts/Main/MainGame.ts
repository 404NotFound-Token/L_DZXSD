import { _decorator, Component, Node } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { Spider } from './Spider';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainGame')
export class MainGame extends Component {

    public static ins: MainGame = null;

    protected onLoad(): void {
        MainGame.ins = this;
    }

}


