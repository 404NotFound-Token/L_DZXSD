import { _decorator, Component, Node } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { Spider } from './Spider';
const { ccclass, property } = _decorator;

@ccclass('MainGame')
export class MainGame extends Component {

    @property({ type: [Node], tooltip: "蜘蛛初始位置" })
    private spiderInitPoints: Node[] = [];

    @property({ type: [Node], tooltip: "蜘蛛初始目标" })
    private spiderInitTargets: Node[] = [];

    protected start(): void {
        this.loadSpider();
    }

    private loadSpider() {
        const spider = ObjectPool.GetPoolItem("zhizhu", this.spiderInitPoints[0]);
        const spiderComp = spider.getComponent(Spider);
        spiderComp.initSpider(this.spiderInitTargets[0].worldPosition);
    }
}


