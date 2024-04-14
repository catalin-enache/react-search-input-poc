import { memo, useState, useCallback, ChangeEvent } from 'react';
import AutoComplete from 'src/components/AutoComplete';
import {
  getHints,
  generateFakeHints
} from 'components/Forms/SearchForm/getHints';
import './SearchForm.css';

const SearchForm = () => {
  const [showAutoComplete, setShowAutoComplete] = useState(true);
  const [useServer, setUseServer] = useState(true);
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
        <div className="searchForm__selectedValueContainer">
          Search value: {selectedValue}
        </div>
      </div>

      {showAutoComplete && (
        <div>
          <AutoComplete
            value={selectedValue}
            onChange={handleOnSelectedValueChange}
            getHints={useServer ? getHints : generateFakeHints}
          />
        </div>
      )}
    </div>
  );
};

export default memo(SearchForm);
