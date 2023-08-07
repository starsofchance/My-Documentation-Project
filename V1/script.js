const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "HTML5",
    voteUsed: 24,
    voteDeprecated: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "CSS3",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "JavaScript",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];
const CATEGORIES = [
  { name: "HTML5", color: "#3b82f6" },
  { name: "CSS3", color: "#16a34a" },
  { name: "JavaScript", color: "#ef4444" },
  { name: "React", color: "#eab308" },
  { name: "JQuery", color: "#db2777" },
  { name: "Nodejs", color: "#14b8a6" },
  { name: "Bootstrap", color: "#f97316" },
  { name: "DOM", color: "#8b5cf6" },
];

// selecting DOM element
const addNewEl = document.querySelector(".addNew");
const formEl = document.querySelector(".docForm");
const docListEl = document.querySelector(".doc-list");

docListEl.innerHTML = "";
// load data from supabase
loadDocs();
async function loadDocs() {
  const res = await fetch(
    "https://yvmcrpyhmiawrwhkettf.supabase.co/rest/v1/documentation",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bWNycHlobWlhd3J3aGtldHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEwNzk0MzAsImV4cCI6MjAwNjY1NTQzMH0.0J-O_hqZXUL7Zg8heG-dFhFe_hICv9GQx9K7pa1BrRI",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bWNycHlobWlhd3J3aGtldHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEwNzk0MzAsImV4cCI6MjAwNjY1NTQzMH0.0J-O_hqZXUL7Zg8heG-dFhFe_hICv9GQx9K7pa1BrRI",
      },
    }
  );
  const data1 = await res.json();

  createDocumentationList(data1);
}

function createDocumentationList(dataArray) {
  const htmlArray = dataArray.map(
    (fact) => `<li class="documentation">
    <p>
    ${fact.text}
    <a class="source"href="${fact.source}" target="_blank" >(Source)</a>
  </p>
  <span class="tag" style="background-color: ${
    CATEGORIES.find((cat) => cat.name === fact.category).color
  }">${fact.category}</span>
    </li>`
  );

  const html = htmlArray.join("");
  docListEl.insertAdjacentHTML("afterbegin", html);
}

// Toggle DOM visibility
addNewEl.addEventListener("click", function () {
  if (formEl.classList.contains("hidden")) {
    formEl.classList.remove("hidden");
    addNewEl.textContent = "close";
  } else {
    formEl.classList.add("hidden");
    addNewEl.textContent = "Add New";
  }
});

// const allCat = CATEGORIES.map((el) => el.name);

// function calcFactAge(year) {
//   const currentYear = new Date().getFullYear();
//   const age = currentYear - year;
//   if (age >= 0) return age;
//   else return `Impossible year`;
// }
// const factAges = initialFacts.map((el) => calcFactAge(el.createdIn));
