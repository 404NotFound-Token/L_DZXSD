import { Vec3 } from 'cc';
import { SkeletalAnimation } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { SpiderInfo } from '../Config/GameConfig';
import { tween } from 'cc';
import { Tween } from 'cc';
import { Annie } from './Annie';
import { RigidBody } from 'cc';
import { CapsuleCollider } from 'cc';
const { ccclass, property } = _decorator;

export enum SpiderState {
    Idle = "idle_enemy",
    Run = "walk_enemy",
    Die = "die_enemy",
    Attack = "attack_enemy",
    Hit = "hit_enemy",
}

@ccclass('Spider')
export class Spider extends Component {

    // 组件
    private skeAnim: SkeletalAnimation = null;
    private rigidBody: RigidBody = null;
    private collider: CapsuleCollider = null;

    private target: Vec3 = new Vec3();
    private state: SpiderState = null;
    /** 是否在临时目标点 */
    private isInTemporaryTarget: boolean = false;

    protected onLoad(): void {
        this.skeAnim = this.getComponent(SkeletalAnimation);
        this.rigidBody = this.getComponent(RigidBody);
        // this.collider = this.getComponent(CapsuleCollider);
    }

    protected start(): void {
        // this.collider.on('onCollisionEnter',onCollisionEnter,)
    }

    /**
     * 初始化蜘蛛
     * @param temporaryTarget 临时目标点
     */
    public initSpider(temporaryTarget: Vec3) {
        this.target = temporaryTarget;
        this.playAni(SpiderState.Run);
        this.rotateTowardsTarget();
        this.moveToTemporaryTdarget(temporaryTarget).then(() => {
            this.isInTemporaryTarget = true;
        });
    }

    private moveToTemporaryTdarget(temporaryTarget: Vec3): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            tween(this.node)
                .to(1.0, { worldPosition: temporaryTarget })
                .call(() => {
                    resolve();
                })
                .start();
        });
    }

    protected update(dt: number): void {
        if (this.state === SpiderState.Attack) return;
        if (this.isInTemporaryTarget) {
            this.target = Annie.ins.node.worldPosition;

            if (Vec3.distance(this.node.worldPosition, this.target) < SpiderInfo.AttackRange) {
                this.playAni(SpiderState.Attack);
            } else {
                this.moveToTarget(dt);
                this.playAni(SpiderState.Run);
            }
            this.rotateTowardsTarget();

        }
    }

    private moveToTarget(dt: number) {
        // 计算当前方向向量
        const direction = new Vec3();
        Vec3.subtract(direction, this.target, this.node.worldPosition);

        // 标准化方向向量
        direction.normalize();

        // 计算移动距离
        const moveDistance = direction.multiplyScalar(SpiderInfo.Speed * dt);

        // 更新位置
        const newPosition = new Vec3();
        Vec3.add(newPosition, this.node.worldPosition, moveDistance);
        this.node.worldPosition = newPosition;
    }

    /**
     * 动画帧事件，攻击动画播放完毕执行
     */
    private onAttacked() {
        this.playAni(SpiderState.Idle);
    }

    /**
     * 旋转角度朝向目标
     */
    private rotateTowardsTarget() {
        if (!this.target) return;

        this.node.lookAt(this.target);
        const currentRotation = this.node.eulerAngles.clone();
        currentRotation.y += 180;
        this.node.eulerAngles = currentRotation;
    }

    private playAni(name: SpiderState) {
        if (this.state === name) return;
        this.state = name;
        this.skeAnim.play(name);
    }
}


