export const getUserInfor = (req, res) => {
    res.json({
        name:'曲丽丽',
        gender:'女',
        age:25,
        height:'165cm',
        weight:'55kg',
        workExperience:'work in Mic,was an leader of sales department,make profit 5000000 per year for company',
        character:'wise and humorous,beautiful and deeply minded woman'
    })
}
export default {
    getUserInfor
}