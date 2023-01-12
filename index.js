const express = require("express");
const fs = require("fs/promises");

const app = express();

// ini untuk parsing body json
app.use(express.json());

let db = { users: [] };

const load = async () => {
    const textData = await fs.readFile("./db.json", { encoding: "utf-8" });
    db = JSON.parse(textData);
}

const save = async () => {
    const textData = JSON.stringify(db);
    await fs.writeFile("./db.json", textData, { encoding: "utf-8" });
}

app.get("/", async (req, res) => {
    res.json(db.users);
});

app.get("/:id", async (req, res) => {
    const id = req.params.id;
    for (const user of db.users) {
        console.log(typeof user.id, typeof id);
        if (user.id === Number(id)) {
            console.log("masuk gan");
            return res.json(user);
        }
    }

    res.status(404).json({ message: "user not found" });
});

app.post("/", async (req, res) => {
    const user = req.body;
    // validasi
    db.users.push(user);
    await save();
    res.json(user);
});

app.put("/:id", async (req, res) => {
    const id = req.params.id;

    let index = 0;
    for (const user in db.users) {
        index++;
        if (user.id === Number(id)) {
            db.users[index] = req.body;
            await save();
            return res.json(user);
        }
    }

    return res.status(404).json({ message: "user not found" });
});

app.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const currentUser = db.users.find(u => u.id === Number(id));
    if(!currentUser) {
        return res.status(404).json({ message: "user not found" });
    }
    db.users = db.users.filter(u => u.id !== Number(id));
    await save();
    return res.json(currentUser);
});

async function main() {
    await load();
    console.log("db loaded");
    app.listen(3000, () => {
        console.log("application started at PORT 3000");
    });
}

main();
