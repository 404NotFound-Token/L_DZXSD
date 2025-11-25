import { _decorator, Component, Node } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { Spider } from './Spider';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainGame')
export class MainGame extends Component {

    public static ins: MainGame = null;

    @property({ type: [Node], tooltip: "蜘蛛初始位置" })
    private spiderInitPoints: Node[] = [];

    @property({ type: [Node], tooltip: "蜘蛛初始目标" })
    private spiderInitTargets: Node[] = [];

    private spiders: Spider[] = [];

    protected onLoad(): void {
        MainGame.ins = this;
    }

    loadSpider() {
        const spider = ObjectPool.GetPoolItem("Spider", this.spiderInitPoints[0]);
        const spiderComp = spider.getComponent(Spider);
        spiderComp.initSpider(this.spiderInitTargets[0].worldPosition);
        this.spiders.push(spiderComp);
    }

    public getSpiderByTargetRange(target: Node): Spider {
        let minDistance = Number.MAX_VALUE;
        let minSpider: Spider = null;
        for (let i = 0; i < this.spiders.length; i++) {
            const spider = this.spiders[i];
            const distance = Vec3.distance(spider.node.worldPosition, target.worldPosition);
            if (distance < minDistance) {
                minDistance = distance;
                minSpider = spider;
            }
        }
        return minSpider;
    }
}


