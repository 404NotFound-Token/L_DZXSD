/**
 * 
 * @param current 
 * @param target 
 * @param factor 
 * @returns 
 */
export function lerpAngle(current: number, target: number, factor: number): number {
    let delta = target - current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return current + delta * factor;
}