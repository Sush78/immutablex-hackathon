let url = "http://localhost:9001/"

// params = {body: {}, cid: 1}
export const createNewbet = async (params) => {
    try{
        const response = await fetch(`${url}place-bet/${params.cid}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params.body)
        })
        return await response.json()
    } catch(error) {
        console.log(error)
    }
}