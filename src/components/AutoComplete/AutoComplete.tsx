import {
  ChangeEvent,
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef
} from 'react';
import { useDebounce } from 'lib/hooks/useDebounce';
import SelectableList, { Item } from 'components/SelectableList';
import { useIsFirstRender } from 'lib/hooks/useIsFirstRender';
import { useIsMounted } from 'lib/hooks/useIsMounted';
import { highlightText } from 'lib/highlightText';
import { combineRefs } from 'lib/combineRefs';
import searchIconUrl from 'srcAssets/search.svg';
import './AutoComplete.css';

const DEBOUNCE_DELAY = 500;

const formatHint = (highlights: string) => (hint: string) => (
  <span dangerouslySetInnerHTML={{ __html: highlightText(hint, highlights) }} />
);

interface AutoCompleteProps {
  label?: string;
  value: string;
  onChange: (selectedHint: string) => void;
  getHints: (value: string) => Promise<string[]>;
}

const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>(
  ({ label = 'Search', value, getHints, onChange }, ref) => {
    const [internalValue, setInternalValue] = useState('');
    const [selectedValue, setSelectedValue] = useState<string>(value);
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
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const isFirstRender = useIsFirstRender();
    const isMounted = useIsMounted();

    const combinedRef = combineRefs([ref, inputRef]);

    hasReceivedNewValue.current = internalValue !== value;

    useEffect(() => {
      if (debouncedValue === internalValue) return;
      setDebouncedValue(internalValue);
    }, [setDebouncedValue, internalValue, debouncedValue]);

    const setSelectedValueAndSync = useCallback((value: string) => {
      setSelectedValue(value);
      setInternalValue(value);
      setDebouncedValueNoDelay(value);
    }, []);

    // Submitting selectedValue (which can be a hint, or the value that user typed in)
    useEffect(() => {
      // setSelectedValue from inside setSelectedValueAndSync is redundant (since we just received it),
      // but it doesn't matter for the sake of reusability
      setSelectedValueAndSync(selectedValue);
      onChange?.(selectedValue); // submitting
    }, [onChange, selectedValue, setSelectedValueAndSync]);

    const doGetHints = useCallback(
      (valueToGetHintsFor: string) => {
        setIsLoading(true);
        // we only need to trim here
        getHints?.(valueToGetHintsFor.trim()).then((hints) => {
          if (!isMounted.current) return;
          setHints(hints.map((hint) => ({ id: hint, value: hint })));
          setIsLoading(false);
        });
        shouldLookForHints.current = false;
      },
      [getHints, isMounted]
    );

    // retrieving hints for debouncedValue
    useEffect(() => {
      if (!shouldLookForHints.current) return;
      doGetHints(debouncedValue);
    }, [setHints, getHints, debouncedValue, doGetHints]);

    const handleInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        shouldLookForHints.current = true;
        setHasInputFocus(true);
        setInternalValue(e.target.value);
      },
      []
    );

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

    const handlePointerUp = useCallback((evt: PointerEvent) => {
      if (
        evt.target !== inputRef.current &&
        document.activeElement !== inputRef.current
      ) {
        setHasInputFocus(false);
      }
    }, []);

    const handlePointerDown = useCallback(
      (evt: PointerEvent) => {
        setHasInputFocus(evt.target === inputRef.current);
        shouldLookForHints.current = evt.target !== inputRef.current;
        if (shouldLookForHints.current) {
          setSelectedValueAndSync(internalValue);
          doGetHints(internalValue);
        }
      },
      [internalValue, setSelectedValueAndSync, doGetHints]
    );

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
          shouldLookForHints.current = true;
          setSelectedValueAndSync(internalValue);
          doGetHints(internalValue);
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
      [setSelectedValueAndSync, internalValue, hasInputFocus, doGetHints]
    );

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleKeyDown]);

    const handleSelectedHint = useCallback((item: Item) => {
      // do not use setSelectedValueAndSync here, because we don't want to submit the value
      setInternalValue(item.value);
      setDebouncedValueNoDelay(item.value);
      // setHasInputFocus(false);
      setTimeout(() => {
        // Wrapping it in setTimeout is due to browser behaviour.
        // It needs to be timed out because the native focus is just about to be lost
        // after selecting the hint.
        inputRef.current?.focus();
      });
    }, []);

    const shouldShowHints = hints.length > 0 && hasInputFocus;

    return (
      <div className="autoComplete">
        <div>
          <label>
            {label} {isLoading && '...'}
            <span className="autoComplete__inputContainer">
              <input
                ref={combinedRef}
                className={`autoComplete__input ${shouldShowHints ? 'autoComplete__input--withHints' : ''}`}
                type="text"
                value={internalValue}
                onChange={handleInputChange}
                placeholder="Search..."
              />
              <span className="autoComplete__inputIcon">
                <svg>
                  <use href={`${searchIconUrl}#icon`} />
                </svg>
              </span>
            </span>
          </label>
        </div>
        <div
          className={`autoComplete__hints ${shouldShowHints ? 'autoComplete__hints--visible' : ''}`}
        >
          <SelectableList
            formatter={formatHint(internalValue)}
            items={hints}
            isVisible={shouldShowHints}
            onSelect={handleSelectedHint}
          />
        </div>
      </div>
    );
  }
);

export default AutoComplete;
