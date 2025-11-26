import { _decorator, Component, Node } from 'cc';
import { EventType, IEvent } from '../Config/IEvent';
import { ObjectPool } from '../Tools/ObjectPool';
import { Spider } from './Spider';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpiderHome')
export class SpiderHome extends Component {

    @property(Node)
    initPoint: Node = null; // 出生点

    @property(Node)
    temporaryTarget: Node = null; // 临时目标点

    @property
    isLoad: boolean = false; // 是否加载

    private static spiderList: Spider[] = [];
    private static spiderMax: number = 5;

    private spiderScale: Vec3 = new Vec3(5, 5, 5);

    protected onLoad(): void {
        IEvent.on(EventType.GameStart, this.gameStart, this)
    }

    protected onDestroy(): void {
        IEvent.off(EventType.GameStart, this.gameStart, this)
    }

    private gameStart() {
        if (this.isLoad) {
            this.loadSpider();
        }
        this.schedule(() => {
            if (this.isLoad) {
                this.loadSpider();
            }
        }, 10);
    }

    private loadSpider() {
        for (let i = 0; i < SpiderHome.spiderMax; i++) {
            this.scheduleOnce(() => {
                const spider = ObjectPool.GetPoolItem("Spider", this.initPoint);
                spider.scale = this.spiderScale;
                const spiderComp = spider.getComponent(Spider);
                spiderComp.initSpider(this.temporaryTarget.worldPosition);
                SpiderHome.spiderList.push(spiderComp);
            }, i * 1)
        }
    }

    /**
     * 返回最近的蜘蛛
     * @param target 目标点
     * @returns 蜘蛛
     */
    public static getSpiderByTargetRange(target: Node, range: number): Spider {
        let minDistance = Number.MAX_VALUE;
        let minSpider: Spider = null;
        for (let i = 0; i < SpiderHome.spiderList.length; i++) {
            const spider = SpiderHome.spiderList[i];
            const distance = Vec3.distance(spider.node.worldPosition, target.worldPosition);
            if (distance < minDistance) {
                minDistance = distance;
                minSpider = spider;
            }
        }
        if (minDistance > range) {
            return null;
        }
        return minSpider;
    }

    /**
     * 回收蜘蛛
     * @param spider 蜘蛛
     */
    public static recycleSpider(spider: Spider) {
        const index = SpiderHome.spiderList.indexOf(spider);
        if (index !== -1) {
            SpiderHome.spiderList.splice(index, 1);
        }
        ObjectPool.PutPoolItem("Spider", spider.node);
    }
}


