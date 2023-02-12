let url = "http://localhost:9000/"

// params = {body: {}, cid: 1}
export const createNewbet = async (params) => {
    try{
        url = new URL(`${url}place-bet/${params.cid}`)
        const response = await fetch(`${url}place-bet/${params.cid}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user: params.body})
        })
        return await response.json()
    } catch(error) {
        console.log(error)
    }
}