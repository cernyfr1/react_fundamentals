import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {recipeList} from "./data_mockup/recipes";
import RecipeList from "./bricks/RecipeList";

const cookbook = {
  name: "Kuchařka"
};

function App() {
  return (
      <div className="App">
          <h1>{cookbook.name}</h1>
          <h3>Recepty:</h3>
          <RecipeList recipeList={recipeList}  />
      </div>
  );
}

export default App;