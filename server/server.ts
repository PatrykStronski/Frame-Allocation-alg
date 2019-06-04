import express = require("express");
import main = require("./main");
import cors = require("cors");
import bodyp = require("body-parser");

const app: express.Application = express();

app.use(cors());
app.use(bodyp());

app.post('/getData',(req,res) => {
	console.log(req.body);
	res.send(main.runProcess(req.body.progs, req.body.ram, req.body.coefficient*100, req.body.tasks));
});

app.listen(8080);

