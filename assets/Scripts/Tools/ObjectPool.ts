import { Component, director, instantiate, Node, NodePool, resources, Vec3 } from "cc";

export class ObjectPool {
    public static objectPools: Map<string, NodePool>;

    /** 初始化对象池 */
    public static ObjectPoolInit(datas: { path: string, num: number }[]) {
        this.objectPools = new Map<string, NodePool>();
        console.log(datas)
        datas.forEach((data) => {
            let pool = new NodePool();
            for (let a = 0; a < data.num; a++) {
                pool.put(instantiate(resources.get("Prefab/" + data.path)));
            }
            this.objectPools.set(data.path, pool);
            console.log(`%c初始化对象池=> path: Prefab/${data.path} , num:${data.num}`, 'color:green;')
        });
    }

    /** 获取指定对象池节点 */
    public static GetPoolItem(path: string, parent: Node, pos?: Vec3) {

        if (this.objectPools == null) {
            return;
        }
        if (!this.objectPools.has(path)) {
            return;
        }

        let pool = this.objectPools.get(path);
        let obj: Node = null;
        if (pool.size() > 0) {
            obj = this.objectPools.get(path).get();
        } else {
            for (let a = 0; a < 10; a++) {
                pool.put(instantiate(resources.get("Prefab/" + path)));
            }
            obj = this.objectPools.get(path).get();
            // obj = instantiate(resources.get("Prefab/" + path));
        }

        obj.active = true;
        obj.setParent(parent);
        if (pos) {
            obj.setPosition(pos);
        } else {
            obj.setPosition(Vec3.ZERO);

        }
        return obj;
    }

    /** 回收指定对象池节点 */
    public static PutPoolItem(path: string, item: Node) {
        item.active = false;
        let pool = this.objectPools.get(path);
        pool.put(item);
    }
}

/**分帧器 */
export function generator(generator: Generator, duration: number, scheduler?, callback?: Function) {
    let component;
    if (scheduler) {
        component = scheduler;
    } else {
        let node: Node = new Node();
        node.setParent(director.getScene());
        component = node.addComponent(Component);
    }
    return new Promise((resolve, reject) => {
        var gen = generator;
        var execute = () => {
            var startTime = new Date().getTime();
            for (var iter = gen.next(); ; iter = gen.next()) {
                if (iter == null || iter.done) {
                    /**分帧完成 */
                    if (!scheduler) {
                        component.node.destroy();
                    }
                    callback && callback();
                    resolve("");
                    return;
                }
                if (new Date().getTime() - startTime > duration) {
                    component.scheduleOnce(() => {
                        execute();
                    });
                    return;
                }
            }
        };
        // 运行执行函数
        execute();
    });
}
