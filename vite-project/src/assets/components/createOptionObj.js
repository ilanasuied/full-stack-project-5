const createOptionObj = {

    updateOptions: (updateData) => {
        return (
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            }
        )
    },
    deleteOptions: () => {
        return(
            {
                method: 'DELETE'
            }
        )
    },
    createOptions: (newItem) =>{
        return(
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem)
            }
        )
    },
    postOptions: (data) =>{
        return(
            {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              }
        )
    }
};

export default createOptionObj;