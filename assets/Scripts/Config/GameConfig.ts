export const GameInfo = {
    ArrowTowerMax: 2,
    ArrowTowerCurrent: 0,
}

/**
 * 安妮信息
 */
export const AnnieInfo = {
    HP: 100,
    Speed: 10,
    AttackPower: 5,
    AttackRange: 3,
    AttackInterval: 1,
}

/**
 * 蜘蛛信息
 */
export const SpiderInfo = {
    HP: 10,
    Speed: 5,
    AttackPower: 1,
    AttackRange: 3,
    AttackInterval: 1,
}

export const TowerInfo = {
    Arrow: {
        HP: 10,
        ArrowMoveSpeed: 100,
        AttackPower: 10,
        AttackRange: 20,
        AttackInterval: 1,
    },
    Cannon: {
        HP: 10,
        CannonMoveSpeed: 100,
        AttackPower: 10,
        AttackRange: 20,
        AttackInterval: 3,
    },
}

/**
 * 碰撞组
 */
export enum ColliderGroup {
    Default = 1 << 0,
    Annie = 1 << 1,
    Spider = 1 << 2,
    DiTie = 1 << 3,
}



