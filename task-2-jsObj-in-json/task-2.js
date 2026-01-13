const person = {
  name: "Anton",
  age: 36,
  skills: ["Javascript", "HTML", "CSS"],
  salary: 80000
};


const jsonString = JSON.stringify(person, ["name", "age", "skills", "salary"]);


console.log(jsonString);

