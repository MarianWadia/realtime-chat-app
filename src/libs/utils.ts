import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]){
    return twMerge(clsx(inputs))
}

export function chatIdConstructor(id1: string, id2:string){
    const sortedIds = [id1, id2].sort();
    return sortedIds.join("--");
}

export function toPusherChannel(key: string){
    return key.replaceAll(":", "__")
}