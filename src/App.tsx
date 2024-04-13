import { memo } from 'react';
import InputSearch from 'components/InputSearch/InputSearch';
import ErrorBoundary from 'components/ErrorBoundary';

const App = () => {
  return (
    <div>
      <h1>Search</h1>
      <ErrorBoundary>
        <InputSearch value={'6'} onChange={() => {}} />
      </ErrorBoundary>
    </div>
  );
};
export default memo(App);
