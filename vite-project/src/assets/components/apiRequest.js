const apiRequest = async(url ='', optionObj = null, errMsg = null)=>{
    try{
        const reponse = await fetch(url, optionObj);
        if(!reponse.ok) throw Error('Please reload the app');
    } catch(err){
        errMsg = err.message;
    } finally{
        return errMsg;
    }
}

export default apiRequest;