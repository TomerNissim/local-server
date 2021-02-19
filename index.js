const express = require("express");
const app = express();
const PORT = 3000;
const fs = require("fs");
const delay = (req, res, next) => {
    setTimeout(() => {
      next();
    },1000)
}
app.use(express.json());
app.use(delay);

app.post("/b/",  (request, response) => {
    const { body } = request;
    let id = Date.now();
    try{
        fs.writeFileSync(`./b/${id}.json`,JSON.stringify(body))
        response.status(201).send({"record":body,"metadata":{"id":id}});
        response.status(201).send(body);
    } catch (e) {
         response.status(500).json({ message: "Error!", error: e });
      } 
});

app.get("/b/:id",(request, response) => {
    try{
        const { id } = request.params;
        const data = JSON.parse(fs.readFileSync('./b/'+id+'.json', 
        {encoding:'utf8', flag:'r'}));
        response.send({"record":data,"metadata":{"id":id}});
    }catch (e){response.send("ERROR!",e)};
    
});

app.get("/b/", (request, response) => {
    try {
      let namesArray = fs.readdirSync(`./b`);
      let tasksArray = [];
      namesArray.forEach((name) => {
        tasksArray.push(JSON.parse(fs.readFileSync(`./b/${name}`, {encoding:'utf8', flag:'r'})));
      });
      
      console.log(tasksArray);
      response.send(tasksArray);
    } catch (e) {
      response.send("Error with the 'get' link"); 
    }
});
  
app.put("/b/:id",  (request, response) => {
    const { id } = request.params;
    const { body } = request;
    try{
        fs.writeFileSync(`./b/${id}.json`,JSON.stringify(body))
        response.status(201).send("task updated");

    } catch (e) {
         response.json({ message: "Error! whit put", error: e });
      }
});

app.delete("/b/:id", (request, response) =>{
    const { id } = request.params;
    try{
        fs.unlinkSync(`./b/${id}.json`);
        response.send("task deleted");
    }catch(e) { 
        response.send("Error with the 'delete'");
    }
})
  
app.listen(PORT);
