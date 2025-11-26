import { Camera } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Joystick } from './Joystick';
import { Vec3 } from 'cc';
import { ColliderGroup, AnnieInfo } from '../Config/GameConfig';
import { RigidBody } from 'cc';
import { CharacterController } from 'cc';
import { SkeletalAnimation } from 'cc';
import { CapsuleCollider } from 'cc';
import { ITriggerEvent } from 'cc';
import { Spider } from './Spider';
import { isValid } from 'cc';
import { Collider } from 'cc';
import { SpiderHome } from './SpiderHome';
const { ccclass, property } = _decorator;

export enum AnnieState {
    Idle = "idle",
    Run = "run",
    Die = "die",
    RunAttack = "runAttack",
    StandAttack = "standAttack",
}

@ccclass('Annie')
export class Annie extends Component {

    public static ins: Annie = null;

    @property(Joystick)
    private joystick: Joystick = null!;

    @property(Node)
    public bag: Node = null;

    @property(Camera)
    private mainCamera: Camera = null!;

    @property(SkeletalAnimation)
    private skeAnim: SkeletalAnimation = null;

    private rigidBody: RigidBody = null;
    private collider: Collider = null;

    // 变量
    private rotationSpeed: number = 10;
    private state: AnnieState = null;
    private attack_target: Spider = null; // 攻击目标

    // vec3缓存
    private moveDirection: Vec3 = new Vec3();
    private cameraForward: Vec3 = new Vec3();
    private cameraRight: Vec3 = new Vec3();
    private velocity: Vec3 = new Vec3();

    protected onLoad(): void {
        Annie.ins = this;

        this.rigidBody = this.getComponent(RigidBody);
        this.collider = this.getComponent(Collider);

        this.playAni(AnnieState.Idle);
    }

    // protected start(): void {
    //     this.collider.on('onTriggerEnter', this._onTriggerEnter, this);
    //     this.collider.on('onTriggerExit', this.onTriggerExit, this);
    // }

    // protected onDestroy(): void {
    //     this.collider.off('onTriggerEnter', this._onTriggerEnter, this);
    //     this.collider.off('onTriggerExit', this.onTriggerExit, this);
    // }

    // private _onTriggerEnter(e: ITriggerEvent) {
    //     this.attack_target = e.otherCollider.node.getComponent(Spider);
    // }

    // private onTriggerExit(e: ITriggerEvent) {
    //     this.attack_target = null;
    // }

    onAttacked() {
        this.attack_target.hurt(AnnieInfo.AttackPower);
        this.playAni(AnnieState.Idle);
    }

    update(deltaTime: number) {
        this.attack_target = SpiderHome.getSpiderByTargetRange(this.node, AnnieInfo.AttackRange);
        const joystickComp = this.joystick.getComponent(Joystick);
        const joystickDir = joystickComp.direction;
        this.moveDirection.set(Vec3.ZERO);

        if (joystickDir.length() > 0.1) {
            Vec3.transformQuat(this.cameraForward, Vec3.FORWARD, this.mainCamera.node.worldRotation);
            this.cameraForward.y = 0;
            this.cameraForward.normalize();

            Vec3.transformQuat(this.cameraRight, Vec3.RIGHT, this.mainCamera.node.worldRotation);
            this.cameraRight.y = 0;
            this.cameraRight.normalize();

            Vec3.scaleAndAdd(this.moveDirection, this.moveDirection, this.cameraForward, joystickDir.y);
            Vec3.scaleAndAdd(this.moveDirection, this.moveDirection, this.cameraRight, joystickDir.x);

            this.moveDirection.normalize();

            // 旋转角色朝向移动方向
            if (this.moveDirection.length() > 0.1) {
                let targetAngle: number;
                targetAngle = Math.atan2(this.moveDirection.x, this.moveDirection.z) * 180 / Math.PI;

                const currentAngle = this.node.eulerAngles.y;
                let newAngle = this.lerpAngle(currentAngle, -targetAngle, this.rotationSpeed * deltaTime);

                this.node.setRotationFromEuler(0, newAngle, 0);
            }

            // 设置线性速度
            this.velocity.set(
                this.moveDirection.x * AnnieInfo.Speed,
                0,
                this.moveDirection.z * AnnieInfo.Speed
            );

            // this.cc.move(this.velocity.multiplyScalar(deltaTime));
            this.rigidBody.setLinearVelocity(this.velocity);

            if (this.attack_target) {
                this.rotateTowardsTarget();
                this.playAni(AnnieState.RunAttack);
            } else {
                this.playAni(AnnieState.Run);
            }
        } else {
            this.rigidBody.setLinearVelocity(Vec3.ZERO);
            if (this.attack_target) {
                this.rotateTowardsTarget();
                this.playAni(AnnieState.StandAttack);
            } else {
                this.playAni(AnnieState.Idle);
            }
        }
    }

    // 角度插值函数（处理360度环绕）
    private lerpAngle(current: number, target: number, factor: number): number {
        let delta = target - current;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        return current + delta * factor;
    }

    private rotateTowardsTarget() {
        if (!this.attack_target) return;

        this.node.lookAt(this.attack_target.node.worldPosition);
        const currentRotation = this.node.eulerAngles.clone();
        currentRotation.y += 180;
        this.node.eulerAngles = currentRotation;
    }

    private playAni(name: AnnieState) {
        if (this.state === name) return;
        this.state = name;
        this.skeAnim.play(name);

        if (name === AnnieState.RunAttack || name === AnnieState.StandAttack) {
            // this.scheduleOnce(() => {
            //     this.attack_target.hurt(AnnieInfo.AttackPower);
            // }, 0.5);
        }
    }
}


