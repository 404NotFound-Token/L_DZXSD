/**
 * 角色信息
 */
export const PlayerInfo = {
    HP: 100,
    Speed: 7,
    AttackPower: 1,
    AttackRange: 1,
    AttackInterval: 1,
}

/**
 * 蜘蛛信息
 */
export const SpiderInfo = {
    HP: 1,
    Speed: 5,
    AttackPower: 1,
    AttackRange: 3,
    AttackInterval: 1,
}

/**
 * 碰撞组
 */
export enum ColliderGroup {
    Default = 1 << 0,
    Annie = 1 << 1,
    Spider = 1 << 2,
}

