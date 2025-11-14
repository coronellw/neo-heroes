import { Request, Response } from "express";
import { JobsService } from "../services/jobs";

export class JobsController {
    static async getAll(req: Request, res: Response) {
        try {
            const jobs = JobsService.getAllJobs();
            res.status(200).json(jobs)
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve jobs" })
        }
    }
}