import { Camera } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Joystick } from './Joystick';
import { Vec3 } from 'cc';
import { PlayerInfo } from '../Config/GameConfig';
import { RigidBody } from 'cc';
import { CharacterController } from 'cc';
import { SkeletalAnimation } from 'cc';
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

    @property(Node)
    private joystick: Node = null!;

    @property(Camera)
    private mainCamera: Camera = null!;

    // 变量
    private rotationSpeed: number = 10;
    private state: AnnieState = null;

    // 组件
    private rigidBody: RigidBody = null;
    // private cc: CharacterController = null;
    private skeAnim: SkeletalAnimation = null;

    // vec3缓存
    private moveDirection: Vec3 = new Vec3();
    private cameraForward: Vec3 = new Vec3();
    private cameraRight: Vec3 = new Vec3();
    private velocity: Vec3 = new Vec3();

    protected onLoad(): void {
        Annie.ins = this;

        this.rigidBody = this.getComponent(RigidBody);
        // this.cc = this.getComponent(CharacterController);
        this.skeAnim = this.getComponent(SkeletalAnimation);
    }

    protected start(): void {
        this.playAni(AnnieState.Idle);
    }

    update(deltaTime: number) {
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
                let newAngle = this.lerpAngle(currentAngle, targetAngle, this.rotationSpeed * deltaTime);

                this.node.setRotationFromEuler(0, newAngle, 0);
            }

            // 设置线性速度
            this.velocity.set(
                this.moveDirection.x * PlayerInfo.Speed,
                0,
                this.moveDirection.z * PlayerInfo.Speed
            );

            // this.cc.move(this.velocity.multiplyScalar(deltaTime));
            this.rigidBody.setLinearVelocity(this.velocity);

            this.playAni(AnnieState.Run);
        } else {
            this.rigidBody.setLinearVelocity(Vec3.ZERO);
            this.playAni(AnnieState.Idle);
        }
    }

    // 角度插值函数（处理360度环绕）
    private lerpAngle(current: number, target: number, factor: number): number {
        let delta = target - current;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        return current + delta * factor;
    }

    private playAni(name: AnnieState) {
        if (this.state === name) return;
        this.state = name;
        this.skeAnim.play(name);
    }
}


