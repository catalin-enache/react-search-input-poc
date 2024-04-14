import {
  memo,
  useState,
  useCallback,
  ChangeEvent,
  Suspense,
  lazy
} from 'react';
import {
  getHints,
  generateFakeHints
} from 'components/Forms/SearchForm/getHints';
import './SearchForm.css';

const AutoComplete = lazy(() => import('src/components/AutoComplete'));

const SearchForm = () => {
  const [showAutoComplete, setShowAutoComplete] = useState(true);
  const [useServer, setUseServer] = useState(false);
  const [selectedValue, setSelectedValue] = useState('start');

  const handleShowAutoCompleteChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setShowAutoComplete(evt.target.checked);
    },
    []
  );

  const handleOnSelectedValueChange = useCallback((selectedValue: string) => {
    setSelectedValue(selectedValue);
  }, []);

  const handleUseServerChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setUseServer(evt.target.checked);
    },
    []
  );

  return (
    <div className="searchForm">
      <div>
        <div>
          <label>
            Show Autocomplete:
            <input
              checked={showAutoComplete}
              type="checkbox"
              onChange={handleShowAutoCompleteChange}
            />
          </label>
        </div>
        <div>
          <label>
            Use Server:
            <input
              checked={useServer}
              type="checkbox"
              onChange={handleUseServerChange}
            />
          </label>
        </div>
      </div>
      <div className="searchForm__autocompleteContainer">
        {showAutoComplete && (
          <Suspense fallback={<div>Loading...</div>}>
            <AutoComplete
              value={selectedValue}
              onChange={handleOnSelectedValueChange}
              getHints={useServer ? getHints : generateFakeHints}
            />
          </Suspense>
        )}
      </div>
      <div className="searchForm__selectedValueContainer">
        Search value: {selectedValue}
      </div>
    </div>
  );
};

export default memo(SearchForm);
