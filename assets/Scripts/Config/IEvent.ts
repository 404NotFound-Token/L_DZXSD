import { EventTarget } from "cc";

export const IEvent = new EventTarget();

export enum EventType {

    GameStart = "GameStart",

    Upgrade = "Upgrade"
}