import { Vec3 } from 'cc';
import { SkeletalAnimation } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { SpiderInfo } from '../Config/GameConfig';
import { tween } from 'cc';
import { Tween } from 'cc';
import { Annie } from './Annie';
import { RigidBody } from 'cc';
import { CapsuleCollider } from 'cc';
import { Sprite } from 'cc';
import { ObjectPool } from '../Tools/ObjectPool';
import { camera_worldRotation } from './CameraCtrl';
import { UIOpacity } from 'cc';
import { SpiderHome } from './SpiderHome';
import { MainGame } from './MainGame';
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

    @property(Node) hp: Node = null!;

    // 组件
    private skeAnim: SkeletalAnimation = null;
    private rigidBody: RigidBody = null;
    private collider: CapsuleCollider = null;

    private bar: Node = null;
    private barBg: Node = null;

    private target: Vec3 = new Vec3();
    private state: SpiderState = null;
    private isInTemporaryTarget: boolean = false; // 是否在临时目标点
    private currentHP: number = SpiderInfo.HP;
    private isDieing: boolean = false;
    private isHurting: boolean = false;


    private barSprite: Sprite = null;
    private barBgSprite: Sprite = null;
    private hpUIOpacity: UIOpacity = null;



    protected onLoad(): void {
        this.skeAnim = this.getComponent(SkeletalAnimation);
        this.rigidBody = this.getComponent(RigidBody);
        this.hpUIOpacity = this.hp.getComponent(UIOpacity);
        this.bar = this.hp.getChildByName("Bar");
        this.barBg = this.hp.getChildByName("BarBg");
        this.barSprite = this.bar.getComponent(Sprite);
        this.barBgSprite = this.barBg.getComponent(Sprite);
        this.collider = this.getComponent(CapsuleCollider);
    }

    protected lateUpdate(dt: number): void {
        this.hp.setWorldRotation(camera_worldRotation);
    }

    /**
     * 初始化蜘蛛
     * @param temporaryTarget 临时目标点
     */
    public initSpider(temporaryTarget: Vec3) {
        this.target = temporaryTarget;
        this.hp.active = true;
        this.hpUIOpacity.opacity = 0;
        this.currentHP = SpiderInfo.HP;
        this.barSprite.fillRange = 1;
        this.collider.enabled = true;

        this.playAni(SpiderState.Run);
        this.rotateTowardsTarget();
        this.moveToTemporaryTdarget(temporaryTarget).then(() => {
            this.isInTemporaryTarget = true;
        });
    }

    /**
     * 移动到临时目标点
     * @param temporaryTarget 临时目标点
     * @returns 
     */
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
        if (this.isDieing) return;
        if (this.isHurting) return;
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

    /**
     * 移动到目标点
     * @param dt 时间间隔
     */
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

    hpTween: Tween<UIOpacity> = null;

    /**
     * 受伤
     * @param damage 伤害
     */
    public hurt(damage: number) {
        this.currentHP -= damage;

        tween(this.barSprite)
            .to(0.1, { fillRange: this.currentHP / SpiderInfo.HP })
            .call(() => {
                tween(this.barBgSprite)
                    .to(0.1, { fillRange: this.currentHP / SpiderInfo.HP })
                    .call(() => {
                        if (this.currentHP <= 0) {
                            this.hp.active = false;
                        }
                    })
                    .start();
            })
            .start();

        if (this.currentHP <= 0) {
            this.isDieing = true;
            this.collider.enabled = false;
            this.playAni(SpiderState.Die);
        } else {
            this.isHurting = true;
            this.playAni(SpiderState.Hit);
            this.hpUIOpacity.opacity = 255;
            this.hpTween = tween(this.hpUIOpacity)
                .delay(3)
                .call(() => {
                    if (this.hpTween) return;
                    this.hpUIOpacity.opacity = 0;
                })
                .start();
        }
    }

    private reset() {
        this.target = null;
        this.state = null;
        this.isInTemporaryTarget = false;
        this.currentHP = SpiderInfo.HP;
        this.isDieing = false;
        this.isHurting = false;
        this.hpUIOpacity.opacity = 0;
        this.barSprite.fillRange = 1;
        this.barBgSprite.fillRange = 1;
    }

    // #region 动画帧事件
    private onAttacked() {
        this.playAni(SpiderState.Idle);
    }

    private onHurted() {
        this.isHurting = false;
    }

    private onDied() {
        this.hpTween = null;
        Tween.stopAllByTarget(this.node);
        this.reset();
        MainGame.ins.dropMeat(this.node.worldPosition.clone());
        SpiderHome.recycleSpider(this);
        // ObjectPool.PutPoolItem("Spider", this.node);
    }
    // #endregion

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


