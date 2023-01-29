
import {
  BrowserRouter as Router, Redirect, Route, Switch
} from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import './style.css';
import TextEditor from './TextEditor';
function App() {
  return (
     
      // <UseRef />
      <Router>
        <Switch>
        <Route path="/" exact>
         <Redirect to={`/documents/${uuidV4()}`} />
        </Route>
        <Route path="/documents/:id">
         <TextEditor />
        </Route>
        </Switch>
      </Router>

  );
}

export default App;
