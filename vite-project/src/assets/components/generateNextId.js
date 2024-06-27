const generateNextId = (data) =>{
   return  data.length ? parseInt(data[data.length - 1].id, 10) + 1 : 1;
}
export default generateNextId;