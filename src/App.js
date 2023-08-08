import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

// function Counter() {
//   const [count, setCount] = useState(0);
//   return (
//     <div>
//       <span style={{ fontSize: "3em" }}>{count}</span>
//       <button
//         className="btn btn-large"
//         onClick={() => setCount((curentCount) => curentCount + 1)}
//       >
//         +1
//       </button>
//     </div>
//   );
// }

function App() {
  // part 1 of state variable:define state variable
  const [showForm, setShowForm] = useState(false);
  // next state is lifted up to app so it would be accessable to DocForm and DocList
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCategory, setCurrentCat] = useState("all");

  useEffect(
    function () {
      async function getDocuments() {
        setIsLoading(true);

        let query = supabase.from("documentation").select("*");
        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);
        const { data: documentation, error } = await query
          .order("used", { ascending: true })
          .limit(100000);

        if (!error) setDocs(documentation);
        else alert("There was a problem getting the data.");
        setDocs(documentation);
        setIsLoading(false);
      }
      getDocuments();
    },
    [currentCategory]
  );

  return (
    <>
      {/* header passed as proped: */}
      <Header showForm={showForm} propName={setShowForm} />
      {/* <Counter /> */}
      {/* part 2 of state variable: use state variable */}
      {showForm ? (
        <DocForm setDocs={setDocs} setShowForm={setShowForm} />
      ) : null}
      <main className="main">
        <CategoryFilter setCurrentCat={setCurrentCat} />
        {isLoading ? <Loader /> : <DocList docs={docs} />}
      </main>
    </>
  );
}
function Loader() {
  return <p className="loadingMassage">Loading...</p>;
}
function Header({ showForm, propName }) {
  const appTitle = "Ultimate's Documentation";
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="logo of the My Documentation app" />
        <h1>{appTitle}</h1>
      </div>

      <button
        className="btn btn-large addNew"
        // part 3 of state variable: update state variable
        onClick={() => propName((show) => !show)}
      >
        {showForm ? "Close" : "Add new"}
      </button>
    </header>
  );
}

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
function isValidUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function DocForm({ setDocs, setShowForm }) {
  const [inputText, setInputText] = useState("");
  const [inputSource, setSource] = useState("");
  const [inputCategory, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = inputText.length;
  async function handleSubmit(eventObj) {
    //1.prevent browser reload
    eventObj.preventDefault();
    console.log(inputText, inputSource, inputCategory);
    //2. check if data is walid. if so, create a new documentation
    if (
      inputText &&
      isValidUrl(inputSource) &&
      inputCategory &&
      textLength <= 1000
    ) {
      // 3.create a new fact object
      // const newDocumentation = {
      //   id: Math.round(Math.random() * 1000),
      //   text: inputText,
      //   source: inputSource,
      //   category: inputCategory,
      //   used: null,
      //   deprecated: null,
      //   createdIn: new Date().getFullYear(),
      // };
      // new3: upload fact to supabase and receive new fact obj
      setIsUploading(true);
      const { data: newDocumentation, error } = await supabase
        .from("documentation")
        .insert([
          { text: inputText, source: inputSource, category: inputCategory },
        ])
        .select();
      setIsUploading(false);
      console.log(newDocumentation);

      //     const { data, error } = await supabase
      // .from('documentation')
      // .insert([
      //   { some_column: 'someValue', other_column: 'otherValue' },
      // ])
      // .select()

      // 4.add the new fact to the UI: add the fact tp state
      if (!error) setDocs((docs) => [newDocumentation[0], ...docs]);
      // 5. reset the input fields
      setInputText("");
      setSource("");
      setCategory("");
      // 6.close the from
      setShowForm(false);
    }
  }
  return (
    <form className="docForm" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add what you learned"
        value={inputText}
        onChange={(eventObj) => setInputText(eventObj.target.value)}
        disabled={isUploading}
      />

      <span>{10000 - textLength}</span>
      <input
        type="text"
        placeholder="Add source"
        value={inputSource}
        onChange={(eventObj) => setSource(eventObj.target.value)}
        disabled={isUploading}
      />
      <select
        name=""
        id=""
        value={inputCategory}
        onChange={(eventObj) => setCategory(eventObj.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose Category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn  btn-post " disabled={isUploading}>
        post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCat }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all" onClick={() => setCurrentCat("all")}>
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCat(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
function DocList({ docs }) {
  const [docsList, setDocsList] = useState(docs);
  function handleDelete(id) {
    setDocsList(docsList.filter((doc) => doc.id !== id));
  }
  if (docs.length === 0)
    return <p className="loadingMassage">No Documentation in this category.</p>;
  return (
    <section>
      <ul className="doc-list">
        {docsList.map((doc) => (
          <Docs key={doc.id} doc={doc} onDelete={handleDelete} />
        ))}
      </ul>
      <p>There are {docs.length} Documentation Entry in the Database.</p>
    </section>
  );
}
function Docs({ doc, onDelete }) {
  const [usedButtonClicked, setUsedButtonClicked] = useState(false);
  const [deprecatedButtonClicked, setDeprecatedButtonClicked] = useState(false);
  useEffect(() => {
    // Fetch the document from the database to get the updated used and deprecated values
    async function fetchDocument() {
      const { data, error } = await supabase
        .from("documentation")
        .select("used, deprecated")
        .eq("id", doc.id)
        .single();

      if (!error) {
        setUsedButtonClicked(data.used);
        setDeprecatedButtonClicked(data.deprecated);
      }
    }

    fetchDocument();
  }, [doc.id]);
  async function handleStatus(property) {
    let usedValue = doc.used;
    let deprecatedValue = doc.deprecated;

    if (property === "used") {
      if (usedButtonClicked) {
        usedValue = null;
        deprecatedValue = null;
      } else {
        usedValue = true;
        deprecatedValue = false;
      }
    } else if (property === "deprecated") {
      if (deprecatedButtonClicked) {
        deprecatedValue = null;
        usedValue = null;
      } else {
        deprecatedValue = true;
        usedValue = false;
      }
    }

    const { data: updatedDoc, error } = await supabase
      .from("documentation")
      .update({ used: usedValue, deprecated: deprecatedValue })
      .eq("id", doc.id)
      .select();

    if (!error) {
      setUsedButtonClicked(property === "used" ? !usedButtonClicked : false);
      setDeprecatedButtonClicked(
        property === "deprecated" ? !deprecatedButtonClicked : false
      );
    }

    console.log(updatedDoc);
  }
  async function handleDelete() {
    const { error } = await supabase
      .from("documentation")
      .delete()
      .eq("id", doc.id);

    if (!error) {
      onDelete(doc.id);
    }
  }
  return (
    <li className="documentation">
      <p>
        {doc.text}
        <a
          className="source"
          href={doc.source}
          target="_blank"
          rel="noopener noreferrer"
        >
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === doc.category)
            .color,
        }}
      >
        {doc.category}
      </span>
      <div className="condition">
        <button
          className={`condBtn ${usedButtonClicked ? "clicked" : ""}`}
          onClick={() => handleStatus("used")}
        >
          ✅
        </button>
        <button
          className={`condBtn ${deprecatedButtonClicked ? "clicked" : ""}`}
          onClick={() => handleStatus("deprecated")}
        >
          ❌
        </button>
        <button className="condBtn deleteBtn" onClick={handleDelete}>
          🗑️
        </button>
        <button className="condBtn editBtn">✏️</button>
      </div>
    </li>
  );
}

// function Docs({ doc }) {

//   const [usedClicked, setUsedClicked] = useState(false);
//   const [deprecatedClicked, setDeprecatedClicked] = useState(false);
//   async function handleStatus(status) {
//     const { data: updatedDoc, error } = await supabase
//       .from("documentation")
//       .update({ [status]: !doc[status] })
//       .eq("id", doc.id)
//       .select();
//     console.log(updatedDoc);
//     if (!error) {
//       if (status === "used") {
//         setUsedClicked(!usedClicked);
//       } else if (status === "deprecated") {
//         setDeprecatedClicked(!deprecatedClicked);
//       }
//     }
//   }
//   return (
//     <li className="documentation">
//       <p>
//         {doc.text}
//         <a className="source" href={doc.source} target="_blank">
//           (Source)
//         </a>
//       </p>
//       <span
//         className="tag"
//         style={{
//           backgroundColor: CATEGORIES.find((cat) => cat.name === doc.category)
//             .color,
//         }}
//       >
//         {doc.category}
//       </span>
//       <div className="condition">
//         <button
//           className={`condBtn ${usedClicked ? "clicked" : ""}`}
//           onClick={() => handleStatus("used")}
//         >
//           ✅Used{doc.used}
//         </button>
//         <button
//           className={`condBtn ${deprecatedClicked ? "clicked" : ""}`}
//           onClick={() => handleStatus("deprecated")}
//         >
//           ❌Deprecated{doc.deprecated}
//         </button>
//       </div>
//     </li>
//   );
// }
export default App;
