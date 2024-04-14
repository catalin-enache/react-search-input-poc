import { ChangeEvent, useState, useCallback, useEffect, useRef } from 'react';
import { useDebounce } from 'lib/hooks/useDebounce';
import SelectableList, { Item } from 'components/SelectableList';
import './AutoComplete.css';
import { useIsFirstRender } from 'lib/hooks/useIsFirstRender';

const DEBOUNCE_DELAY = 500;

interface AutoCompleteProps {
  label?: string;
  value: string;
  onChange: (selectedHint: string) => void;
  getHints: (value: string) => Promise<string[]>;
}

const AutoComplete = ({
  label = 'Search',
  value,
  getHints,
  onChange
}: AutoCompleteProps) => {
  const [internalValue, setInternalValue] = useState('');
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [debouncedValue, setDebouncedValueNoDelay] = useState(internalValue);
  const setDebouncedValue = useDebounce(
    setDebouncedValueNoDelay,
    DEBOUNCE_DELAY
  );
  // input focus state is internal, it is not correlated with actual input focus
  const [hasInputFocus, setHasInputFocus] = useState(false);
  const [hints, setHints] = useState<Item[]>([]);
  const shouldLookForHints = useRef(false);
  const hasReceivedNewValue = useRef(internalValue !== value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isFirstRender = useIsFirstRender();

  hasReceivedNewValue.current = internalValue !== value;

  useEffect(() => {
    setDebouncedValue(internalValue);
  }, [setDebouncedValue, internalValue]);

  // retrieving hints for debouncedValue
  useEffect(() => {
    if (!shouldLookForHints.current) return;
    // TODO: add a loader here
    console.log('looking for hints for new debouncedValue', {
      debouncedValue
    });
    // we only need to trim here
    getHints?.(debouncedValue.trim()).then((hints) => {
      console.log('received hints', hints);
      setHints(hints.map((hint) => ({ id: hint, value: hint })));
    });
  }, [setHints, getHints, debouncedValue]);

  const setSelectedValueAndSync = useCallback((value: string) => {
    setSelectedValue(value);
    setInternalValue(value);
    setDebouncedValueNoDelay(value);
  }, []);

  // Submitting selectedValue (which can be a hint, or the value that user typed in)
  useEffect(() => {
    if (selectedValue === null) return;
    // no hints needed for submitted value
    shouldLookForHints.current = false;
    // setSelectedValue from inside setSelectedValueAndSync is redundant (since we just received it),
    // but it doesn't matter for the sake of reusability
    setSelectedValueAndSync(selectedValue);
    onChange?.(selectedValue); // submitting
    setHasInputFocus(false);
  }, [onChange, selectedValue, setSelectedValueAndSync]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // we only want to look for hints when user is typing
    // (not when we programmatically set the final value, when user selects a hint)
    shouldLookForHints.current = true;
    setHasInputFocus(true);
    setInternalValue(e.target.value);
  }, []);

  useEffect(() => {
    if (hasReceivedNewValue.current) {
      // The input can be seeded with a value from outside initially,
      // in which case we want to look for hints
      // This is for cases like sharing a link with a search query
      shouldLookForHints.current = isFirstRender;
      // sync internal value with the external value
      // the external value is basically the submitted value
      setInternalValue(value);
    }
  }, [value, isFirstRender]);

  const handlePointerUp = useCallback(
    (evt: PointerEvent) => {
      if (
        evt.target !== inputRef.current &&
        document.activeElement !== inputRef.current
      ) {
        setHasInputFocus(false);
        // we don't want to also blur here because the mouse can be on input
        setSelectedValueAndSync(internalValue);
      }
    },
    [setSelectedValueAndSync, internalValue]
  );

  const handlePointerDown = useCallback((evt: PointerEvent) => {
    if (evt.target === inputRef.current) {
      setHasInputFocus(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [handlePointerDown]);

  useEffect(() => {
    // Using blur is too early, because we can't select the hint
    document.addEventListener('pointerup', handlePointerUp);
    return () => {
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerUp]);

  const handleKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.key === 'Enter') {
        setSelectedValueAndSync(internalValue); // TODO: work here, we need to shoe default hints for empty value
        if (inputRef.current === document.activeElement) {
          if (hasInputFocus) {
            // We're not closing here the dropdown if the input is empty
            // but the empty value is still submitted to get default hints
            setHasInputFocus(!internalValue);
          } else {
            // allowing to open the dropdown with enter key
            setHasInputFocus(true);
          }
        }
      }
    },
    [setSelectedValueAndSync, internalValue, hasInputFocus]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleSelectedHint = useCallback(
    (item: Item) => {
      setSelectedValueAndSync(item.value);
      setTimeout(() => {
        // needs to be timed out because the focus is just about to be lost after selecting the hint
        inputRef.current?.focus();
      });
    },
    [setSelectedValueAndSync]
  );

  const shouldShowHints = hints.length > 0 && hasInputFocus;

  return (
    <div className="autoComplete">
      <div>
        <label>
          {label}
          <input
            ref={inputRef}
            className={`autoComplete__input ${shouldShowHints ? 'autoComplete__input--withHints' : ''}`}
            type="text"
            value={internalValue}
            onChange={handleInputChange}
            placeholder="Search..."
          />
        </label>
      </div>
      <div
        className={`autoComplete__hints ${shouldShowHints ? 'autoComplete__hints--visible' : ''}`}
      >
        <SelectableList
          highlight={internalValue}
          items={hints}
          isVisible={shouldShowHints}
          onSelect={handleSelectedHint}
        />
      </div>
    </div>
  );
};

export default AutoComplete;
