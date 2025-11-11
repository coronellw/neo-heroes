import { Job } from "./job";
import { IStats } from "./stats";

export interface ICharacter {
    name: string
    job: Job,
    attributes?: IStats
}