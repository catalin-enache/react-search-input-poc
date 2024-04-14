import { memo } from 'react';
import SearchForm from 'components/Forms/SearchForm';
import ErrorBoundary from 'components/ErrorBoundary';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <ErrorBoundary>
        <div className="app__searchFormContainer">
          <SearchForm />
        </div>
      </ErrorBoundary>
    </div>
  );
};
export default memo(App);
