import * as jobRepository from "../../services/repository/jobRepository.js";

export const createJob = async (req, res) => {
    try{
        const {company, title, years, duties} = req.body
        const job = await jobRepository.addJob(company, title, years, duties);
        return res.json(job)

    } catch (err) {
        console.error(err)
    }
}
export const getJob = async (req, res) => {
    try {
        const job = await jobRepository.findJobById(req.params.id)
        return res.json(job)
    } catch (err) {
        console.error(err)
    }
}
export const updateJob = async (req, res) => {
    try{
        const {company, title, years, duties} = req.body
        const job = await jobRepository.updateJobId(company, title, years, duties, req.params.id);
        return res.json(job)

    } catch (err) {
        console.error(err)
    }
}
export const deleteJob = async (req, res) => {
    try{
        const job = await jobRepository.findJobById(req.params.id)
        if (job)
            await jobRepository.deleteJobById(req.params.id)
        return res.sendStatus(200)
    } catch (err) {
        console.error(err)
    }
}
