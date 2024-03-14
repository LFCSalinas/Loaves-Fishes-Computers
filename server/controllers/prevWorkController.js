import * as prevWorkRepository from "../../services/repository/prevWorkRepository.js";

export const createWorkHistory = async (req, res) => {
    try{
        const {job_id, volunteer_id} = req.body
        const prevWork = await prevWorkRepository.createPrevWork(job_id, volunteer_id);
        return res.json(prevWork)

    } catch (err) {
        console.error(err)
    }
}
export const getWorkHistory = async (req, res) => {
    try {
        const workHistory = await prevWorkRepository.findPrevWork(req.params.id)
        return res.json(workHistory)
    } catch (err) {
        console.error(err)
    }
}
// export const updateWorkHistory = async (req, res) => {
//     try{
//         const {company, title, years, duties} = req.body
//         const job = await prevWorkRepository.updateJobId(company, title, years, duties, req.params.id);
//         return res.json(job)
//
//     } catch (err) {
//         console.error(err)
//     }
// }
// export const deleteWorkHistory = async (req, res) => {
//     try{
//         const job = await prevWorkRepository.findJobById(req.params.id)
//         if (job)
//             await prevWorkRepository.deleteJobById(req.params.id)
//         return res.sendStatus(200)
//     } catch (err) {
//         console.error(err)
//     }
// }
